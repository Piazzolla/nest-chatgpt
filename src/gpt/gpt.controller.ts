import { Body, Controller, Get, HttpStatus, Param, Post, Res } from '@nestjs/common';
import { GptService } from './gpt.service';
import { OrthographyDto, TextToAudioDto, TranslateDto } from './dtos';
import { ProsConsDto } from './dtos/pros-cons.dto';
import type { Response } from 'express';
import * as path from 'path';

@Controller('gpt')
export class GptController {
  constructor(private readonly gptService: GptService) { }
  @Post('orthography-check')
  orthographyCheck(
    @Body() orthographyDto: OrthographyDto,
  ) {
    return this.gptService.orthographyCheck(orthographyDto);
  }

  @Post('pros-cons-discusser')
  prosConsDiscusser(
    @Body() prosConsDto: ProsConsDto,
  ) {
    return this.gptService.prosConsDiscusser(prosConsDto);
  }

  @Post('pros-cons-discusser-stream')
  async prosConsDiscusserStream(
    @Body() prosConsDto: ProsConsDto,
    @Res() res: Response,
  ) {
    const stream = await this.gptService.prosConsDiscusserStream(prosConsDto);
    res.setHeader('Content-Type', 'application/json');
    res.status(HttpStatus.OK)

    for await( const chunk of stream) {
      const piece = chunk.choices[0].delta.content || '';
      //console.log(piece);
      res.write(piece);
    }
    res.end();
  }


  @Post('translate')
  translate(
    @Body() translateDto: TranslateDto,
  ) {
    return this.gptService.translate(translateDto);
  }

  @Post('text-to-audio')
  async textToAudio(
    @Body() textToAudioDto: TextToAudioDto,
    @Res() res: Response
  ) {
     const filePath = await this.gptService.textToAudio(textToAudioDto);
     res.setHeader('Content-Type', 'audio/mp3');
     res.status(HttpStatus.OK);
     res.sendFile(filePath);
  }

  @Get('text-to-audio/:fileId')
  async textToAudioGetter(
    @Res() res: Response,
    @Param('fileId') id: string
  ) {

    const filePath = path.resolve(__dirname,`../../generated/audios/${id}.mp3`)   // await this.gptService.getAudioFromFS(fileId)
    res.setHeader('Content-Type', 'audio/mp3');
    res.status(HttpStatus.OK);
    res.sendFile(filePath);



  }

}
