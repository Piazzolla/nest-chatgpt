import { Injectable, NotFoundException } from '@nestjs/common';
import { audioToTextUseCase, imageGenerationUseCase, imageVariationUseCase, orthographyCheckUseCase, prosConsDiscusserStreamUseCase, prosConsDiscusserUseCase, textToAudioUseCase, translateUseCase } from './use-cases';
import { AudioToTextDto, ImageVariationDto, OrthographyDto, TextToAudioDto, TranslateDto } from './dtos';
import OpenAI from "openai";
import { ProsConsDto } from './dtos/pros-cons.dto';
import * as path from 'path';
import * as fs from 'fs';
import { ImageGenerationDto } from './dtos/image-generation.dto';

@Injectable()
export class GptService {
    // Solo va a llamar casos de uso
    private openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
    })

    async orthographyCheck(orthographyDto: OrthographyDto){
        return await orthographyCheckUseCase( this.openai, {
            prompt: orthographyDto.prompt
        });
    
    }
    async prosConsDiscusser(prosConsDto: ProsConsDto){
        return await prosConsDiscusserUseCase( this.openai, {
            prompt: prosConsDto.prompt
        });
    }
    async prosConsDiscusserStream(prosConsDto: ProsConsDto){
        return await prosConsDiscusserStreamUseCase( this.openai, {
            prompt: prosConsDto.prompt
        });
    }

    async translate(translateDto: TranslateDto){
        return await translateUseCase( this.openai, {
            prompt: translateDto.prompt,
            lang: translateDto.lang
        });
    }

    async textToAudio(textToAudioDto: TextToAudioDto){
        return await textToAudioUseCase( this.openai, {
            prompt: textToAudioDto.prompt,
            voice: textToAudioDto.voice
        });
    }
 
    getAudioFromId(id: string ) {
        const filePath = path.resolve(__dirname,`../../generated/audios/${id}.mp3`); 
        if(fs.existsSync(filePath))
            return filePath;
        else
            throw new NotFoundException(`File ${id} not found`)
    }

    async audioToText( audioFile: Express.Multer.File, audioToTextDto: AudioToTextDto) {
        const { prompt } = audioToTextDto;
        return await audioToTextUseCase(this.openai, { audioFile, prompt })
    }

    async imageGeneration( imageGenerationDto: ImageGenerationDto) {
        return await imageGenerationUseCase( this.openai, {...imageGenerationDto});

    }

    async getGeneratedImage( fileName: string ) {
        const filePath = path.resolve(__dirname, '../../generated/images/' + fileName + '.png')
        if(!fs.existsSync(filePath)) throw new NotFoundException(`File ${fileName} not found`);
        return filePath;
    }

    async imageVariation( {baseImage}: ImageVariationDto) {

        return await imageVariationUseCase( this.openai, { baseImage });

    }
}

