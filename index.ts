import { Hono } from 'hono'
import expensesRouter from './src/routes/expense'
import urlRouter from './src/routes/url'
import filesRouter from './src/routes/files'

const app = new Hono()

app.use('*', async (c, next) => {
  console.log(c.req.path)

  if (c.req.path === '/') {
    return await next()
  }

  const apiKey = c.req.header('API-Key')

  const expectedKey = process.env.API_KEY
  
  if (!apiKey || apiKey !== expectedKey) {

    return c.json({ error: 'Unauthorized: Invalid or missing API key' }, 401)
    
  }

  await next()
})

app.get('/', (c) => {
  return c.text('Ecosystem API Core is Alive!')
})

app.route('/expenses', expensesRouter)

app.route('/url', urlRouter)

app.route('/files', filesRouter)

// app.route('/ai', aiRouter)

app.onError((err, c) => {
 console.log(err)
  return c.json({ error: err.message }, 500)

})

export default {
  port: 5000,
  fetch: app.fetch,
}