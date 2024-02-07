import { InternalServerErrorException } from "@nestjs/common";
import * as path from 'path';
import * as fs from 'fs';

export const downloadImageAsPng =async (url:string) => {
    const response = await fetch(url);
    if( !response.ok ) {
        throw new InternalServerErrorException('Image download was not possible')
    }

    const folderPath = path.resolve('./','./generated/images/');
    fs.mkdirSync(folderPath, { recursive: true });
    const imageNamePng = `${ new Date().getTime()}.png`; //TODO: deberia usar uuid o algo para generar ids
    const buffer = Buffer.from( await response.arrayBuffer() );
    fs.writeFileSync( `${ folderPath }/${ imageNamePng }`, buffer)
    
}