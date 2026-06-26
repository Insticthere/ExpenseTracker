// import { Hono } from 'hono'
// import { db } from "../db/db-init" 
// import { todo } from '../db/schema';
// import { eq, not, desc } from 'drizzle-orm';

// const expensesRouter = new Hono()

// // GET: Fetch all active expenses with pagination
// expensesRouter.get('/', async (c) => {
//   try {
//     const offset = parseInt(c.req.query('offset') || '0', 10);
//     const limit = parseInt(c.req.query('limit') || '20', 10);
//     const showcompleted = c.req.query('completed') === 'true';

//     const query = db.select().from(todo);
    
//     if (!showcompleted) {
//       query.where(eq(todo.completed, false));
//     }

//     const expensesList = await query
//       .orderBy(desc(todo.createdAt))
//       .limit(limit)
//       .offset(offset);

//     return c.json({ success: true, data: expensesList });

//   } catch (error) {

//     return c.json({ success: false, error: error }, 500);
//   }
// })

// // POST: Create a new todo
// expensesRouter.post('/', async (c) => {
//   try {
//     const { name, amount, category, paymentMethod, description } = await c.req.json();

//     const [newExpense] = await db.insert(expenses).values({
//       name,
//       amountInRupees: Math.round(amount), 
//       category: category || [],
//       paymentMethod,
//       description
//     }).returning();

//     return c.json({ success: true, data: newExpense });
//   } catch (error) {
//     return c.json({ success: false, error: 'Failed to create expense' }, 500);
//   }
// })

// // PATCH: Edit an existing expense
// expensesRouter.patch('/:id', async (c) => {
//   try {
//     const id = Number(c.req.param('id'));
//     const { name, amount, category, paymentMethod, description } = await c.req.json();

//     const [updatedExpense] = await db.update(expenses)
//       .set({
//         name,
//         amountInRupees: amount ? Math.round(amount) : undefined, 
//         category,
//         paymentMethod,
//         description
//       })
//       .where(eq(expenses.id, id))
//       .returning(); 

//     if (!updatedExpense) return c.json({ success: false, error: 'Expense not found' }, 404);

//     return c.json({ success: true, data: updatedExpense });
//   } catch (error) {
//     return c.json({ success: false, error: 'Failed to update expense' }, 500);
//   }
// })

// // DELETE: Toggle archive status (RESTful soft-delete)
// expensesRouter.delete('/:id', async (c) => {
//   try {
//     const id = Number(c.req.param('id'));

//     const [archivedExpense] = await db.update(expenses)
//       .set({ archived: not(expenses.archived) })
//       .where(eq(expenses.id, id))
//       .returning();

//     if (!archivedExpense) return c.json({ success: false, error: 'Expense not found' }, 404);

//     return c.json({ success: true, data: archivedExpense });
//   } catch (error) {
//     return c.json({ success: false, error: 'Failed to archive expense' }, 500);
//   }
// })

// export default expensesRouter
