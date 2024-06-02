import { useQuery } from "@apollo/client";
import { ALL_BOOKS } from '../queries';

const Recommend = ({ show, favoriteGenre }) => {
  const {loading, data} = useQuery(ALL_BOOKS, {
    skip: !favoriteGenre,
    variables: { genre: favoriteGenre }
  });

  if (!show) {
    return null;
  }

  if (loading) {
    return <div>loading...</div>;
  }

  if (!data) {
    return <div>Failed to load recommended books</div>;
  }

  if (favoriteGenre === '') {
    return <div>No recommendations to show. You do not have a favorite genre</div>;
  }

  return (
    <div>
      <h2>recommendations</h2>
      {data.allBooks.length === 0 && (
        <p>
          no books in your favorite genre <b>{favoriteGenre}</b>
        </p>
      )}
      {data.allBooks.length > 0 && (
        <>
          <p>
            books in your favorite genre <b>{favoriteGenre}</b>
          </p>
          <table>
            <tbody>
              <tr>
                <th></th>
                <th>author</th>
                <th>published</th>
              </tr>
              {data.allBooks.map((a) => (
                <tr key={a.id}>
                  <td>{a.title}</td>
                  <td>{a.author.name}</td>
                  <td>{a.published}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
}

export default Recommend;
