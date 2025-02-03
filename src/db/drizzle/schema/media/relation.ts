import { relations } from 'drizzle-orm';

import { users } from '../user/schema';
import { files, images } from './schema';

export const imagesRelations = relations(images, ({ one }) => ({
  usersRelation: one(users, {
    fields: [images.uploaderUid],
    references: [users.uid]
  })
}));

export const filesRelations = relations(files, ({ one }) => ({
  usersRelation: one(users, {
    fields: [files.uploaderUid],
    references: [users.uid]
  })
}));
