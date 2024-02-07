import { Body, Controller, FileTypeValidator, Get, HttpStatus, MaxFileSizeValidator, Param, ParseFilePipe, Post, Res, UploadedFile, UseInterceptors } from '@nestjs/common';
import { GptService } from './gpt.service';
import { AudioToTextDto, ImageGenerationDto, ImageVariationDto, OrthographyDto, TextToAudioDto, TranslateDto } from './dtos';
import { ProsConsDto } from './dtos/pros-cons.dto';
import type { Response } from 'express';
import { diskStorage } from 'multer';
import { FileInterceptor } from '@nestjs/platform-express';


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

    const filePath = this.gptService.getAudioFromId(id);
    res.setHeader('Content-Type', 'audio/mp3');
    res.status(HttpStatus.OK);
    res.sendFile(filePath);
  }


  @Post('audio-to-text')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination:  './generated/uploads',
        filename: (req, file, callback ) => {
          const fileExtension = file.originalname.split('.').pop();
          const fileName = `${ new Date().getTime()}.${ fileExtension }`;
          return callback(null, fileName);
        }
      })
    })
    )
    
    async audioToText(
    @Body() audioToTextDto: AudioToTextDto,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 1000 * 1024 * 5, message: 'File is bigger than 5mb'}),
          new FileTypeValidator({fileType: 'audio/*'})
        ]
      })
    ) file: Express.Multer.File,
  ) {
   
    return this.gptService.audioToText(file, audioToTextDto);
  }

  @Post('generate-image') 
  async imageGeneration(
    @Body() imageGenerationDto: ImageGenerationDto
  )
    {
      return await this.gptService.imageGeneration( imageGenerationDto );
    }

  @Get('image/:filename') 
  async getGeneratedImage(
    @Param('filename') fileName: string,
    @Res() res: Response,
  )
    {
      //return await this.gptService.getGeneratedImage( fileName );
      const filePath = await this.gptService.getGeneratedImage(fileName);
      res.setHeader('Content-Type', 'image/png');
      res.status(HttpStatus.OK);
      res.sendFile(filePath);
    }

    @Post('image-variation') 
    async imageVariation(
      @Body() imageVariationDto: ImageVariationDto
    )
      {
        return await this.gptService.imageVariation( imageVariationDto );
      }
  
  
}
