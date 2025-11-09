import { useState } from 'react'
import { CombinedGraphQLErrors } from "@apollo/client/errors";
import { useMutation } from '@apollo/client/react'
import { ADD_BOOK } from '../queries'
import { updateBooks, updateAuthors } from '../cache';
import { NEWBOOKERROR } from '../const';

const NewBook = ({ show, setError }) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [published, setPublished] = useState('')
  const [genre, setGenre] = useState('')
  const [genres, setGenres] = useState([])

  const [ addBook ] = useMutation(ADD_BOOK, {
    onError: (error) => {
      let errorMessage = NEWBOOKERROR
      if (error instanceof CombinedGraphQLErrors) {
        errorMessage = error.errors.map(e => e.message).join(', ')
      }
      setError(errorMessage)
    },
    update: (cache, response) => {
      const bookData = response?.data?.addBook

      if (!bookData) {
        return
      }

      updateBooks(cache, bookData)
      updateAuthors(cache, bookData)
    }
  })

  if (!show) {
    return null
  }

  const submit = async (event) => {
    event.preventDefault()

    addBook({ variables: { title: title.trim(), author: author.trim(), published: parseInt(published), genres } })

    setTitle('')
    setPublished('')
    setAuthor('')
    setGenres([])
    setGenre('')
  }

  const addGenre = () => {
    if (genre.trim() !== '') {
      setGenres(genres.concat(genre.toLocaleLowerCase()))
    }
    setGenre('')
  }

  return (
    <div>
      <form onSubmit={submit}>
        <div>
          title
          <input
            value={title}
            onChange={({ target }) => setTitle(target.value)}
          />
        </div>
        <div>
          author
          <input
            value={author}
            onChange={({ target }) => setAuthor(target.value)}
          />
        </div>
        <div>
          published
          <input
            type="number"
            value={published}
            onChange={({ target }) => setPublished(target.value)}
          />
        </div>
        <div>
          <input
            value={genre}
            onChange={({ target }) => setGenre(target.value)}
          />
          <button onClick={addGenre} type="button">
            add genre
          </button>
        </div>
        <div>genres: {genres.join(' ')}</div>
        <button type="submit">create book</button>
      </form>
    </div>
  )
}

export default NewBook