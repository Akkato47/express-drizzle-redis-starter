CREATE TABLE IF NOT EXISTS "files" (
	"uid" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" date DEFAULT now() NOT NULL,
	"updated_at" date NOT NULL,
	"key" varchar(255) NOT NULL,
	"url" varchar(255) NOT NULL,
	"file_type" varchar(255) NOT NULL,
	"name" varchar(255) NOT NULL,
	"uploaderUid" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "images" (
	"uid" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" date DEFAULT now() NOT NULL,
	"updated_at" date NOT NULL,
	"key" varchar(255) NOT NULL,
	"url" varchar(255) NOT NULL,
	"file_type" varchar(255) NOT NULL,
	"name" varchar(255) NOT NULL,
	"uploaderUid" uuid NOT NULL,
	"thumbnail" jsonb NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "user_profle" (
	"uid" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" date DEFAULT now() NOT NULL,
	"updated_at" date NOT NULL,
	"user_uid" uuid
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "users" (
	"uid" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" date DEFAULT now() NOT NULL,
	"updated_at" date NOT NULL,
	"oauth_id" varchar(16),
	"first_name" text NOT NULL,
	"second_name" text NOT NULL,
	"email" text NOT NULL,
	"password" text,
	"phone" text,
	"role" text DEFAULT 'USER' NOT NULL,
	"birth_date" date,
	CONSTRAINT "users_oauth_id_unique" UNIQUE("oauth_id"),
	CONSTRAINT "users_email_unique" UNIQUE("email"),
	CONSTRAINT "users_mail_unique" UNIQUE("email"),
	CONSTRAINT "users_phone_unique" UNIQUE("phone")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "user_profle" ADD CONSTRAINT "user_profle_user_uid_users_uid_fk" FOREIGN KEY ("user_uid") REFERENCES "public"."users"("uid") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
