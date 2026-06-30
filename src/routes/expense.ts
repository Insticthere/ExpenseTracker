import { Hono } from "hono";
import { db } from "../db/db-init" 
import { expenses, budget , categories , monthlyCategoryAllocation } from '../db/schema';
import { desc, and , eq } from "drizzle-orm";

const expensesRouter = new Hono()

expensesRouter.post('/', async (c) => {

    try {

    const { name, amount, categoryId, paymentMethod, description } = await c.req.json();

    const [newExpense] = await db.insert(expenses).values({
      name,
      amountInRupees: Math.round(amount), 
      categoryId,
      paymentMethod,
      description
    }).returning(); 

    return c.json({ success: true, data: newExpense });

  } catch (error) {

    return c.json({ success: false, error: error }, 500);
    
  }
});

expensesRouter.get('/', async (c) => {
    const offset = parseInt(c.req.query('offset') || '0', 10);
    const limit = parseInt(c.req.query('limit') || '20', 10);

    const query = db.select().from(expenses);


    const expensesList = await query
        .orderBy(desc(expenses.createdAt))
        .limit(limit)
        .offset(offset);

    return c.json({ success : true, data : expensesList})
    
} );

// budget

expensesRouter.post('/budget/:year/:month', async (c) => {
    const year = Number(c.req.param('year'));
    const month = Number(c.req.param('month'));
    const { budgetInRupee } = await c.req.json();

    const [result] = await db
    .insert(budget)
    .values({
      year,
      month,
      budget: budgetInRupee,
    })
    .onConflictDoUpdate({
      target: [budget.year, budget.month],
      set: {
        budget: budgetInRupee,
      },
    })
    .returning();

      return c.json({
        success: true,
        data: result,
  });

});

expensesRouter.get('/budget/:year/:month', async (c) => {
    const year = Number(c.req.param('year'));
    const month = Number(c.req.param('month'));

    const budgetdata = await db.select().from(budget).where(
          and(
            eq(budget.month, month),
            eq(budget.year, year)
          )
    )

    const categoryData = await db.select().from(monthlyCategoryAllocation).where(
          and(
            eq(monthlyCategoryAllocation.budgetMonth, month),
            eq(monthlyCategoryAllocation.budgetYear, year)
          )
    )

    return c.json({success : true, data: {budget : budgetdata, categoryWise : categoryData}})

})

expensesRouter.get('/budget/:year', async (c) => {
    const year = Number(c.req.param('year'));

    const budgetdata = await db.select().from(budget).where(
          and(
            eq(budget.year, year)
          )
    )

    const categoryData = await db.select().from(monthlyCategoryAllocation).where(
          and(
            eq(monthlyCategoryAllocation.budgetYear, year)
          )
    )

    return c.json({success : true, data: {budget : budgetdata, categoryWise : categoryData}})

})

// categories

expensesRouter.post('/category', async (c) => {
    const { name } = await c.req.json();

    const [result] = await db
      .insert(categories)
      .values({
          name : name
      })
      .returning();
    
    return c.json({ 
        success: true,
        data: result,
  });

});

expensesRouter.get('/category', async (c) => {
    const catList = await db.select().from(categories)

    return c.json({success : true , data : catList})
});

// monthlyCategoryAllocation upload

expensesRouter.post('/budget/category/:year/:month', async (c) => {
    const year = Number(c.req.param('year'));
    const month = Number(c.req.param('month'));

    const { budgetInPercent, categoryId  } = await c.req.json();
    
    const [result] = await db
        .insert(monthlyCategoryAllocation)
        .values({
          budgetInPercent : budgetInPercent,
          categoryId: categoryId,
          budgetYear : year,
          budgetMonth : month
          })
        .onConflictDoUpdate({
                target: [
                          monthlyCategoryAllocation.categoryId,
                          monthlyCategoryAllocation.budgetYear,
                          monthlyCategoryAllocation.budgetMonth,
                        ],
                set: {
                  budgetInPercent : budgetInPercent,
                }
        })
        .returning();

        return c.json({
          success : true,
          data : result
        });
});

export default expensesRouter;