import { relations } from 'drizzle-orm';

import { files, images } from '../media/schema';
import { userProfle, users } from './schema';

export const userRelations = relations(users, ({ one, many }) => ({
  userProfleRelation: one(userProfle),
  imagesRelation: many(images),
  fileRelation: many(files)
}));

export const userProfileRelations = relations(userProfle, ({ one }) => ({
  usersRelation: one(users, {
    fields: [userProfle.userUid],
    references: [users.uid]
  })
}));
