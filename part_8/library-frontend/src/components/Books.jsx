import { useQuery } from '@apollo/client/react'
import { ALL_BOOKS } from '../queries'

const Books = ({ show, selectedGenre, handleGenreChange }) => {
  const allBookResult = useQuery(ALL_BOOKS);
  const genreBookResult = useQuery(ALL_BOOKS, {
    variables: { genre: selectedGenre }
  });

  if (!show) {
    return null
  }

  if (allBookResult.loading || genreBookResult.loading) {
    return <div>loading...</div>
  }

  if (!allBookResult.data) {
    return <div>Failed to load books</div>
  }

  const genres = [...new Set(allBookResult.data.allBooks.flatMap(book => book.genres))].sort();
  const books = selectedGenre ? genreBookResult.data.allBooks : allBookResult.data.allBooks;

  if (books.length === 0) {
    return <div>No books to show</div>
  }


  return (
    <div>
      <h2>books</h2>

      {selectedGenre && <p>in genre <b>{selectedGenre}</b></p>}

      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {books.map((a) => (
            <tr key={a.id}>
              <td>{a.title}</td>
              <td>{a.author.name}</td>
              <td>{a.published}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <br />

      {genres.length > 0 && (
        <div>
          <label>
            Select genre:
            <select value={selectedGenre} onChange={handleGenreChange}>
              <option value={""}>all</option>
              {genres.map((genre) => (
                <option key={genre} value={genre}>
                  {genre}
                </option>
              ))}
            </select>
          </label>
        </div>
      )}
    </div>
  )
}

export default Books
