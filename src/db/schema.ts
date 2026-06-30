  import {pgTable, serial, text, timestamp, boolean, pgEnum, integer, unique} from "drizzle-orm/pg-core";


  export const categories = pgTable("categories", { 

    id: serial("id").primaryKey(),
    
    name: text("name").notNull().unique(),

  });

  export const expenses = pgTable('expenses', { 

    id: serial('id').primaryKey(),
    
    name: text('name').notNull(),
    
    amountInRupees: integer('amount_in_rupees').notNull(),
    
    categoryId: text("category_id")
      .references(() => categories.id),
    
    paymentMethod: text('payment_method'),

    description: text('description'),
    
    createdAt: timestamp('created_at', { withTimezone: true, mode: 'date' }).defaultNow().notNull(),

    fingerprint : text('fingerprint')

  });

export const monthlyCategoryAllocation = pgTable(
  "monthlyAllocation",
  {
    id: serial("id").primaryKey(),

    budgetInPercent: integer("percent").notNull(),

    categoryId: integer("category_id")
      .references(() => categories.id)
      .notNull(),

    budgetYear: integer("budgetYear").notNull(),

    budgetMonth: integer("budgetMonth").notNull(),
  },
  (table) => [
    unique().on(
      table.categoryId,
      table.budgetYear,
      table.budgetMonth
    ),
  ]
);

  export const budget = pgTable('budget', { // each month has its own budget

    id : serial('id').primaryKey(),

    budget : integer('budget'),

    month: integer('month').notNull(),

    year: integer('year').notNull(),

  },   (table) => [
      unique().on(table.month, table.year),
    ]);


  export const url = pgTable('url', {

    id: serial('id').primaryKey(),

    slug: text('slug').notNull(),

    url: text('url').notNull(),

    createdAt: timestamp('created_at', { withTimezone: true, mode: 'date' }).defaultNow().notNull(),

    archived: boolean('archived').default(false).notNull(),

    opened : integer('opened').default(0).notNull(),

    tags: text('tags').array().default([]).notNull(),

  });

  export const files = pgTable('files', {

    id: text('id').primaryKey(),

    name: text('name').notNull(),

    fileType: text('file_type').notNull(),
    
    fileSize: integer('file_size').notNull(),

    fileurl : text('file_url').notNull(),

    createdAt: timestamp('created_at', { withTimezone: true, mode: 'date' }).defaultNow().notNull(),

    archived: boolean('archived').default(false).notNull(),
    
  });