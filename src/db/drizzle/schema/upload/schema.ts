import { jsonb, pgTable, varchar, uuid } from 'drizzle-orm/pg-core';
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
  type: varchar('type', { length: 255 }).notNull(),
  name: varchar('name', { length: 255 }).notNull(),
  uploader: uuid('uploader').notNull(),
});

export const images = pgTable('images', {
  ...baseSchema,
  key: varchar('key', { length: 255 }).notNull(),
  url: varchar('url', { length: 255 }).notNull(),
  type: varchar('type', { length: 255 }).notNull(),
  name: varchar('name', { length: 255 }).notNull(),
  uploader: uuid('uploader').notNull(),
  thumbnail: jsonb('thumbnail').$type<ThumbnailImage>().notNull(),
});
