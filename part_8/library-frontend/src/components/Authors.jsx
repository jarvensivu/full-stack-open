import { useQuery } from '@apollo/client'
import { ALL_AUTHORS } from '../queries'
import SetBirthyear from './SetBirthyear'

const Authors = ({ show, setError }) => {
  const { loading, data } = useQuery(ALL_AUTHORS)

  if (!show) {
    return null
  }

  if (loading) {
    return <div>loading...</div>
  }

  if (!data) {
    return <div>Failed to load authors</div>
  }

  if (data.allAuthors.length === 0) {
    return <div>No authors to show</div>
  }

  return (
    <div>
      <h2>authors</h2>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>born</th>
            <th>books</th>
          </tr>
          {data.allAuthors.map((a) => (
            <tr key={a.name}>
              <td>{a.name}</td>
              <td>{a.born}</td>
              <td>{a.bookCount}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <SetBirthyear allAuthors={data.allAuthors} setError={setError}/>
    </div>
  )
}

export default Authors
