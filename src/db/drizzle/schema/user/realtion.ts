import { relations } from 'drizzle-orm';

import { files, images } from '../media/schema';
import { userProfle, users } from './schema';

export const userRelations = relations(users, ({ one }) => ({
  userProfleRelation: one(userProfle)
}));

export const userProfileRelations = relations(userProfle, ({ one, many }) => ({
  usersRelation: one(users, {
    fields: [userProfle.userUid],
    references: [users.uid]
  }),
  imagesRelation: many(images),
  fileRelation: many(files)
}));
