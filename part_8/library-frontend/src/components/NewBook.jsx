import { useState } from 'react'
import { CombinedGraphQLErrors } from "@apollo/client/errors";
import { useMutation } from '@apollo/client/react'
import { ALL_AUTHORS, ALL_BOOKS, ADD_BOOK } from '../queries'

const NewBook = ({ show, setError, favoriteGenre }) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [published, setPublished] = useState('')
  const [genre, setGenre] = useState('')
  const [genres, setGenres] = useState([])

  const [ addBook ] = useMutation(ADD_BOOK, {
    onError: (error) => {
      let errorMessage = 'Unknown error'
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

      // Update allAuthors cache if needed
      if (bookData?.author) {
        const allAuthors = cache.readQuery({ query: ALL_AUTHORS })

        if (allAuthors?.allAuthors) {
          let allAuthorsData = [...allAuthors.allAuthors]
          const authorExists = allAuthorsData.find(a => a.name === bookData.author.name)

          if (!authorExists) {
            const newAuthor = { ...bookData.author, bookCount: 1, born: null, id: null}
            allAuthorsData.push(newAuthor)
          } else {
            allAuthorsData = allAuthorsData.map(a => {
              if (a.name === bookData.author.name) {
                return { ...a, bookCount: a.bookCount + 1}
              }
              return a
            })
          }

          cache.writeQuery({
            query: ALL_AUTHORS,
            data: {
              allAuthors: allAuthorsData
            }
          })
        }

        // Update allBooks favorite genre cache if needed
        if (favoriteGenre && bookData?.genres.includes(favoriteGenre)) {
          const allFavoriteGenre = cache.readQuery({ query: ALL_BOOKS, variables: { genre: favoriteGenre } })

          if (allFavoriteGenre?.allBooks) {
            cache.writeQuery({
              query: ALL_BOOKS,
              variables: { genre: favoriteGenre },
              data: {
                allBooks: allFavoriteGenre.allBooks.concat(bookData)
              }
            })
          }
        }

        // Update allbooks selected genre cache if needed
        if (bookData?.genres) {
          const genres = [... bookData.genres, ""]
          genres.forEach(genre => {
            if (genre !== favoriteGenre) {
              const allBooks = cache.readQuery({ query: ALL_BOOKS, variables: { genre } })

              if (allBooks?.allBooks) {
                cache.writeQuery({
                  query: ALL_BOOKS,
                  variables: { genre },
                  data: {
                    allBooks: allBooks.allBooks.concat(bookData)
                  }
                })
              }
            }
          })
        }

        // Update allBooks cache for no genre filter
        const allBooks = cache.readQuery({ query: ALL_BOOKS })

        if (allBooks?.allBooks) {
          cache.writeQuery({
            query: ALL_BOOKS,
            data: {
              allBooks: allBooks.allBooks.concat(bookData)
            }
          })
        }
      }
    }
  })

  if (!show) {
    return null
  }

  const submit = async (event) => {
    event.preventDefault()

    addBook({ variables: { title, author, published: parseInt(published), genres }})

    setTitle('')
    setPublished('')
    setAuthor('')
    setGenres([])
    setGenre('')
  }

  const addGenre = () => {
    setGenres(genres.concat(genre.toLocaleLowerCase()))
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