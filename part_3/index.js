require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')
const app = express()

app.use(cors())
app.use(express.static('frontend'))
app.use(express.json())
app.use(
  morgan(':method :url :status :res[content-length] - :response-time ms :post')
)
morgan.token('post', (req) => {
  return req.method === 'POST' ? JSON.stringify(req.body) : ' '
})

// eslint-disable-next-line no-unused-vars
const errorHandler = (error, request, response, next) => {
  console.error('error.name:', error.name)
  console.error('error.message:', error.message)

  if (error.name === 'CastError') {
    return response.status(400).json({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }

  return response.status(500).json({ error: 'Internal server error' })
}

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.get('/api/persons', (request, response) => {
  Person.find({}).then((persons) => {
    response.json(persons)
  })
})

app.post('/api/persons', (request, response, next) => {
  const { name, number } = request.body

  if (!name && !number) {
    return response.status(400).json({
      error: 'name and number missing',
    })
  }

  if (!name) {
    return response.status(400).json({
      error: 'name missing',
    })
  }

  if (!number) {
    return response.status(400).json({
      error: 'number missing',
    })
  }

  const person = new Person({
    name,
    number,
  })
  person
    .save()
    .then((savedPerson) => {
      response.json(savedPerson)
    })
    .catch((error) => {
      next(error)
    })
})

app.get('/api/persons/:id', (request, response, next) => {
  Person.findById(request.params.id)
    .then((person) => {
      if (person) {
        response.json(person)
      } else {
        response.status(404).end()
      }
    })
    .catch((error) => next(error))
})

app.put('/api/persons/:id', (request, response, next) => {
  const { name, number } = request.body

  const person = {
    name,
    number,
  }

  Person.findByIdAndUpdate(request.params.id, person, {
    new: true,
    runValidators: true,
    context: 'query',
  })
    .then((updatedPerson) => {
      if (!updatedPerson) {
        return response.status(404).end()
      }
      response.json(updatedPerson)
    })
    .catch((error) => {
      next(error)
    })
})

app.delete('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndDelete(request.params.id)
    .then(() => {
      response.status(204).end()
    })
    .catch((error) => next(error))
})

app.get('/info', (request, response) => {
  Person.find({}).then((persons) => {
    response.send(
      `<p>Phonebook has info for ${persons.length} people</p>
      <p>${new Date()}</p>`
    )
  })
})

app.use(unknownEndpoint)
app.use(errorHandler)

const PORT = process.env.PORT || 3001

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
