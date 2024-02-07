import OpenAI from 'openai';
import { downloadBase64ImageAsPng, downloadImageAsPng } from 'src/helpers';
import * as fs from 'fs';
import * as path from 'path';


interface Options {
    prompt: string;
    originalImage?: string;
    maskImage?: string;
}

export const imageGenerationUseCase =async (openai:OpenAI, options: Options) => {
    const { prompt, originalImage, maskImage} = options;

    if(! originalImage || !maskImage){
        const response = await openai.images.generate({
            prompt: prompt,
            model: 'dall-e-3',
            n: 1,
            size: '1024x1024',
            quality: 'standard',
            response_format: 'url'
        });
        
        //TODO: guardar la imagen en FS
        const fileName = await downloadImageAsPng( response.data[0].url);
        const url = `${process.env.SERVER_URL}/gpt/generate-image/${fileName}`

        return {
            url: url,
            openAIUrl: response.data[0].url,
            revised_prompt: response.data[0].revised_prompt
        }
    }


    // originalImage=localhost:3000/gpt/image/1707242972648
    // maskImage=Base64;ASKJFKASDFIJF23J4K23IJFAKD...
    const pngImagePath = await downloadImageAsPng(originalImage, true);
    const maskPath = await downloadBase64ImageAsPng( maskImage, true);
    const response = await openai.images.edit({
        model: 'dall-e-2',
        prompt: prompt,
        image: fs.createReadStream(pngImagePath),
        mask: fs.createReadStream(maskPath),
        n: 1,
        size: '1024x1024',
        response_format: 'url'
    });

    const fileName = await downloadImageAsPng( response.data[0].url);
    const url = `${process.env.SERVER_URL}/gpt/generate-image/${fileName}`

    return {
        url: url,
        openAIUrl: response.data[0].url,
        revised_prompt: response.data[0].revised_prompt
    }


    

}