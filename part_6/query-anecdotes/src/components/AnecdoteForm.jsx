import { useMutation, useQueryClient } from 'react-query'
import anecdoteService from "../services/anecdotes"
import { useNotificationHandler } from "../context/NotificationsContext"

const AnecdoteForm = () => {
  const queryClient = useQueryClient()
  const notificationHandler = useNotificationHandler()

  const newAnecdoteMutation = useMutation(anecdoteService.createAnecdote, {
    onSuccess: (newAnecdote) => {
      const anecdotes = queryClient.getQueryData('anecdotes')
      queryClient.setQueryData('anecdotes', anecdotes.concat(newAnecdote))
      const id = Math.floor(Math.random() * 1000000)
      notificationHandler({ content: `you created '${newAnecdote.content}'`, id })
    },
    onError: (error) => {
      const id = Math.floor(Math.random() * 1000000)
      notificationHandler({ content: error.response.data.error, id })
    }
  })

  const onCreate = async (event) => {
    event.preventDefault()
    const content = event.target.anecdote.value
    event.target.anecdote.value = ''
    newAnecdoteMutation.mutate({ content, votes: 0 })
}

  return (
    <div>
      <h3>create new</h3>
      <form onSubmit={onCreate}>
        <input name='anecdote' />
        <button type="submit">create</button>
      </form>
    </div>
  )
}

export default AnecdoteForm
