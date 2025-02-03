import { jsonb, pgTable, uuid, varchar } from 'drizzle-orm/pg-core';

import { baseSchema } from '../base.schema';

export class ThumbnailImage {
  url: string;
  type: string;

  constructor(url: string, type: string) {
    this.url = url;
    this.type = type;
  }
}

export const files = pgTable('files', {
  ...baseSchema,
  key: varchar('key', { length: 255 }).notNull(),
  url: varchar('url', { length: 255 }).notNull(),
  fileType: varchar('file_type', { length: 255 }).notNull(),
  name: varchar('name', { length: 255 }).notNull(),
  uploaderUid: uuid('uploaderUid').notNull()
});

export const images = pgTable('images', {
  ...baseSchema,
  key: varchar('key', { length: 255 }).notNull(),
  url: varchar('url', { length: 255 }).notNull(),
  fileType: varchar('file_type', { length: 255 }).notNull(),
  name: varchar('name', { length: 255 }).notNull(),
  uploaderUid: uuid('uploaderUid').notNull(),
  thumbnail: jsonb('thumbnail').$type<ThumbnailImage>().notNull()
});
