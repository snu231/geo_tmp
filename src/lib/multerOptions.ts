import { existsSync, mkdirSync } from 'fs';
import { diskStorage } from 'multer';
import * as config from 'config';
import { randomUUID } from 'crypto';
import { BadRequestException } from '@nestjs/common';

const addressConfig = config.get('file');

export const multerOptions = {
  fileFilter: (request, file, callback) => {

    console.log( typeof(file.m ) );
    if (file.mimetype.match(/\/(jpg|jpeg|png)$/)) {
      // 이미지 형식은 jpg, jpeg, png만 허용합니다.

      callback(null, true);
    } else {
      callback(new BadRequestException('upload jpg, jpeg, png') );
    }
  },

  storage: diskStorage({
    destination: (request, file, callback) => {
      const uploadPath: string = 'public';

      if (!existsSync(uploadPath)) {
        // public 폴더가 존재하지 않을시, 생성합니다.
        mkdirSync(uploadPath);
      }


      callback(null, uploadPath);
    },

    filename: (request, file, callback) => {
      callback(null, file.originalname  );
    }
  })
}

export const createImageURL = (file): string => {
  const serverAddress: string = addressConfig.serverAddress;
  
  // 파일이 저장되는 경로: 서버주소/public 폴더
  // 위의 조건에 따라 파일의 경로를 생성해줍니다.
  const dir =  `${serverAddress}/public/${file.filename}`;

  //console.log(dir);

  return dir;
}