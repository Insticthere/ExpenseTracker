CREATE TABLE "budget" (
	"id" serial PRIMARY KEY NOT NULL,
	"budget" integer,
	"month" integer NOT NULL,
	"year" integer NOT NULL,
	CONSTRAINT "budget_month_year_unique" UNIQUE("month","year")
);
--> statement-breakpoint
CREATE TABLE "categories" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "expenses" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"amount_in_rupees" integer NOT NULL,
	"category_id" text,
	"payment_method" text,
	"description" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"fingerprint" text
);
--> statement-breakpoint
CREATE TABLE "files" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"file_type" text NOT NULL,
	"file_size" integer NOT NULL,
	"file_url" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"archived" boolean DEFAULT false NOT NULL
);
--> statement-breakpoint
CREATE TABLE "url" (
	"id" serial PRIMARY KEY NOT NULL,
	"slug" text NOT NULL,
	"url" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"archived" boolean DEFAULT false NOT NULL,
	"opened" integer DEFAULT 0 NOT NULL,
	"tags" text[] DEFAULT '{}' NOT NULL
);
--> statement-breakpoint
ALTER TABLE "expenses" ADD CONSTRAINT "expenses_category_id_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE no action ON UPDATE no action;