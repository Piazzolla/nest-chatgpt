import { Injectable } from '@nestjs/common';
import { orthographyCheckUseCase, prosConsDiscusserStreamUseCase, prosConsDiscusserUseCase, textToAudioUseCase, translateUseCase } from './use-cases';
import { OrthographyDto, TextToAudioDto, TranslateDto } from './dtos';
import OpenAI from "openai";
import { ProsConsDto } from './dtos/pros-cons.dto';


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
}

