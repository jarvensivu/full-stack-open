import axios from 'axios'

const getAnecdotes = async () => {
  const response = await axios.get('http://localhost:3001/anecdotes')
  return response.data
}

const createAnecdote = async (anecdote) => {
  const response = await axios.post('http://localhost:3001/anecdotes', anecdote)
  return response.data
}

const updateAnecdote = async (anecdote) => {
  const response = await axios.put(`http://localhost:3001/anecdotes/${anecdote.id}`, anecdote)
  return response.data
}

const anecdoteService = {
  getAnecdotes,
  createAnecdote,
  updateAnecdote,
}

export default anecdoteService