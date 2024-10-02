import { relations } from "drizzle-orm";
import { userProfleInfo, users } from "./schema";

export const userRelations = relations(users, ({ one }) => ({
    userProfleInfo: one(userProfleInfo, {
        fields: [users.uid],
        references: [userProfleInfo.userUid],
    }),
}));
