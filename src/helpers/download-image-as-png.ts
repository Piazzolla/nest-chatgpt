import { InternalServerErrorException } from "@nestjs/common";
import * as path from 'path';
import * as fs from 'fs';
import * as sharp from 'sharp';

export const downloadImageAsPng =async (url:string, fullPath: boolean = false) => {
    const response = await fetch(url);
    if( !response.ok ) {
        throw new InternalServerErrorException('Image download was not possible')
    }

    const folderPath = path.resolve('./','./generated/images/');
    fs.mkdirSync(folderPath, { recursive: true });
    const imageNamePng = `${ new Date().getTime()}.png`; //TODO: deberia usar uuid o algo para generar ids
    const buffer = Buffer.from( await response.arrayBuffer() );
    //fs.writeFileSync( `${ folderPath }/${ imageNamePng }`, buffer)
    
    const completePath = path.join(folderPath, imageNamePng);

    await sharp( buffer )
        .png()
        .ensureAlpha()
        .toFile(completePath)

    if( fullPath )
        return completePath;
    return imageNamePng;

    
}

export const downloadBase64ImageAsPng = async (base64Image: string, fullPath: boolean = false) => {

    // Remover encabezado
    base64Image = base64Image.split(';base64,').pop();
    const imageBuffer = Buffer.from(base64Image, 'base64');
  
    const folderPath = path.resolve('./', './generated/images/');
    fs.mkdirSync(folderPath, { recursive: true });
  
    const imageNamePng = `${ new Date().getTime() }-64.png`;
    
  
    // Transformar a RGBA, png // Así lo espera OpenAI
    await sharp(imageBuffer)
      .png()
      .ensureAlpha()
      .toFile(path.join(folderPath, imageNamePng));
  
    if( fullPath )
      return path.join(folderPath, imageNamePng);
    return imageNamePng; // path.join(folderPath, imageNamePng);
  
  }
