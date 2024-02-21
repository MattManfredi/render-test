require('dotenv').config()
const express = require('express')
const cors = require('cors')
const app = express()
const Note = require('./models/note')


app.use(express.json())
app.use(express.static('dist'))
app.use(cors())

let notes = [
    {
      id: 1,
      content: "HTML is easy",
      important: true
    },
    {
      id: 2,
      content: "Browser can execute only JavaScript",
      important: false
    },
    {
      id: 3,
      content: "GET and POST are the most important methods of HTTP protocol",
      important: true
    }
  ]

// Devuelve todas las notas
app.get('/api/notes' ,( req,res )=>{
    Note.find({}).then(notes => {
      res.json(notes)
    })
})

// Busca por ID
app.get('/api/notes/:id', (req,res)=>{
    Note.findById(req.params.id).then(note=>{
      res.json(note)
    })
})

// Borra nota por ID
app.delete('/api/notes/:id',(request,response)=>{
    const id = Number(request.params.id)
    notes = notes.filter(note=> note.id !== id)
    response.status(204).end()
})

// Crea nueva nota
const generateId = () => {
    const maxId = notes.length > 0
      ? Math.max(...notes.map(n => n.id))
      : 0
    return maxId + 1
  }
app.post('/api/notes', (request,response)=>{
    const body = request.body
    if (!body.content) {
        return response.status(400).json({ 
          error: 'content missing' 
        })
      }
    
    const note = new Note({
      content: body.content,
      important: body.important || false,
    })

    note.save().then(savedNote => {
      response.json(savedNote)
    })
})

const PORT = process.env.PORT
app.listen(PORT, ()=>{
    console.log(`Server runing on port ${PORT}`);
})