import { useQuery } from '@apollo/client'
import { ALL_BOOKS, ALL_GENRES } from '../queries'

const Books = ({ show, selectedGenre, handleGenreChange }) => {
  const bookResult = useQuery(ALL_BOOKS, {
    variables: { genre: selectedGenre }
  });
  const genreResult = useQuery(ALL_GENRES);

  if (!show) {
    return null
  }

  if (bookResult.loading || genreResult.loading) {
    return <div>loading...</div>
  }

  if (!bookResult.data) {
    return <div>Failed to load books</div>
  }

  if (bookResult.data.allBooks.length === 0 ) {
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
          {bookResult.data.allBooks.map((a) => (
            <tr key={a.id}>
              <td>{a.title}</td>
              <td>{a.author.name}</td>
              <td>{a.published}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <br />

      {genreResult.data.allGenres.length > 0 && (
        <div>
          <label>
            Select genre:
            <select value={selectedGenre} onChange={handleGenreChange}>
              <option value={""}>all</option>
              {genreResult.data.allGenres.map((genre) => (
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
