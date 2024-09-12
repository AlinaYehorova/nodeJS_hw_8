import express from 'express'
import env from 'dotenv'
import sequelize from './config/db.js'
import Book from './models/book.js'

env.config()

const app = express()

const port = process.env.PORT || 3000

app.use(express.json())
app.use(express.urlencoded({extended: true}))

app.get('/books',async (req, res) => {
  try {
    const books = await Book.findAll();
    books.forEach(book => book.toJSON())
    res.status(200).json(books);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching books' });
  }
})
 
app.post('/books', async (req, res) => {
  try {
    const book = await Book.create(req.body);
    res.status(201).json(book);
  } catch (error) {
    console.error('Error creating new Book', error);
    res.status(500).json({ error: 'Error creating book' });
  }
})

app.put('/books/:id', async (req, res) => {
  try {
    const [updated] = await Book.update(req.body, { where: { id: req.params.id } });
    if (updated) {
      const updatedBook = await Book.findOne({ where: { id: req.params.id } });
      res.status(200).json(updatedBook);
    } else {
      res.status(404).json({ error: 'Book not found' });
    }
  } catch (error) {
    console.error('Error updating Book', error);
    res.status(500).json({ error: 'Error updating book' });
  }
})

app.delete('/books/:id', async (req, res) => {
  try {
    const deleted = await Book.destroy({ where: { id: req.params.id } });
    if (deleted) {
      res.status(200).json({ message: 'Book deleted' });
    } else {
      res.status(404).json({ error: 'Book not found' });
    }
  } catch (error) {
    console.error('Error deleting Book', error);
    res.status(500).json({ error: 'Error deleting book' });
  }
})

app.listen(port, async () => {
  try {
      await sequelize.authenticate()
      console.log('Connection to the database has been established successfully.');
      console.log(`Listening on port ${port}`);
  } catch (error) {
      console.error('Unable to connect to the database:', error)
  }
 
})