import OpenAI from "openai";
import { downloadImageAsPng } from "src/helpers";
import * as fs from 'fs';

interface Options {
    baseImage: string;
}

export const imageVariationUseCase = async (openai: OpenAI, options: Options) => {

    const { baseImage } = options;

    const pngImagePath = await downloadImageAsPng( baseImage, true );

    const response = await openai.images.createVariation({
        model: 'dall-e-2',
        image: fs.createReadStream(pngImagePath),
        n: 1,
        size: '1024x1024',
        response_format: 'url'
    });


    const fileName = await downloadImageAsPng( response.data[0].url, false);
    const url = `${process.env.SERVER_URL}/gpt/image-variation/${fileName}`


    return {
        url: url,
        openAIUrls: response.data[0].url,
        revised_prompt: response.data[0].revised_prompt
    };

}