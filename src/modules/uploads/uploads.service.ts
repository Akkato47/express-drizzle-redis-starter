import config from '@/config';
import { db } from '@/db/drizzle/connect';
import {
  files,
  images,
  ThumbnailImage,
} from '@/db/drizzle/schema/upload/schema';
import { CustomError } from '@/utils/custom_error';
import { HttpStatus } from '@/utils/enums/http-status';
import { S3 } from 'aws-sdk';
import path from 'path';
import sharp from 'sharp';
import { v4 } from 'uuid';

const isImage = (mimetype: string) => {
  return mimetype.startsWith('image/');
};

const isPDF = (mimetype: string) => {
  return mimetype === 'application/pdf';
};

export const uploadFile = async (
  file: Express.Multer.File,
  uploader: string
) => {
  try {
    if (isImage(file.mimetype)) {
      const convertedOrigin = await convertImg(file);
      const originBuffer = await convertedOrigin.toBuffer();
      const thumbnail = await createThumbnail(convertedOrigin);
      const res = await uploadPublicFile(originBuffer, '.webp', 'images');
      const image = await db
        .insert(images)
        .values({
          key: res.Key,
          name: file.originalname,
          thumbnail:
            thumbnail || new ThumbnailImage(res.Location, 'image/webp'),
          type: 'image/webp',
          url: res.Location,
          uploader,
        })
        .returning();
      return image[0];
    } else if (isPDF(file.mimetype)) {
      const uploadedRes = await uploadPublicFile(
        file.buffer,
        path.extname(file.originalname),
        'PDF'
      );
      const uploadedFile = await db
        .insert(files)
        .values({
          key: uploadedRes.Key,
          name: file.originalname,
          type: file.mimetype,
          url: uploadedRes.Location,
          uploader,
        })
        .returning();
      return uploadedFile[0];
    } else {
      throw new CustomError(
        HttpStatus.UNSUPPORTED_MEDIA_TYPE,
        'Такой формат не поддерживается'
      );
    }
  } catch (error) {
    throw error;
  }
};

const createThumbnail = async (img: sharp.Sharp) => {
  const metadata = await img.metadata();
  const thumbnailSize = 40;

  if (metadata && metadata.width <= thumbnailSize) {
    return null;
  }

  let width: number, height: number;

  if (metadata.width >= metadata.height) {
    width = thumbnailSize;
    height = Math.round(metadata.height * (thumbnailSize / metadata.width));
  } else {
    height = thumbnailSize;
    width = Math.round(metadata.width * (thumbnailSize / metadata.height));
  }

  const thumbnail = await img
    .resize({ width, height, fit: 'contain' })
    .toBuffer();

  const res = await uploadPublicFile(thumbnail, '_thumb.webp', 'images');

  return new ThumbnailImage(res.Location, 'image/webp');
};

const convertImg = async (
  rawImg: Express.Multer.File
): Promise<sharp.Sharp> => {
  const img = sharp(rawImg.buffer);
  const metadata = await img.metadata();

  if (metadata.format === 'webp') {
    return img;
  }

  return img.webp();
};

export const uploadPublicFile = async (
  buffer: Buffer,
  extension: string,
  folder: string
) => {
  const s3 = new S3({
    accessKeyId: config.bucket.key,
    secretAccessKey: config.bucket.secret,
    endpoint: config.bucket.endpoint,
  });
  let key = '';
  if (folder === 'PDF') {
    key = 'ITUGRA/PDF/' + v4() + extension;
  } else if (folder === 'images') {
    key = 'ITUGRA/images/' + v4() + extension;
  }
  const res = await s3
    .upload({
      Bucket: process.env.BUCKET_NAME,
      Body: buffer,
      Key: key,
    })
    .promise();
  return res;
};

// export const findFile = async (uid: string) => {
//     return await DI.em.findOne(UploadFile, { uid });
// };
// export const findImage = async (uid: string) => {
//     return await DI.em.findOne(UploadImage, { uid });
// };
