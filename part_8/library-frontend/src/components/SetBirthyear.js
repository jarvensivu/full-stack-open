import { useState } from 'react'
import Select from 'react-select'
import { ApolloError, useMutation } from '@apollo/client'
import { ALL_AUTHORS, EDIT_AUTHOR } from '../queries';

const SetBirthyear = ({ allAuthors, setError }) => {
  const [selectedOption, setSelectedOption] = useState(null);
  const [born, setBorn] = useState('')

  const [ editAuthor ] = useMutation(EDIT_AUTHOR, {
    refetchQueries: [ { query: ALL_AUTHORS } ],
    onError: (error) => {
      let errorMessage = 'Unknown error'
      if (error instanceof ApolloError) {
        errorMessage = error.graphQLErrors[0].message
      }
      setError(errorMessage)
    }
  }) 

  const options = allAuthors.map((author) => {
    return {
      value: author.name,
      label: author.name,
    }
  })

  const handleSubmit = (event) => {
    event.preventDefault()
    editAuthor({ variables: { name: selectedOption.value, setBornTo: parseInt(born) }})
    setSelectedOption(null)
    setBorn('')
  }

  return (
    <>
      <h3>Set birthyear</h3>
      <form onSubmit={handleSubmit}>
        <Select
          value={selectedOption}
          onChange={setSelectedOption}
          options={options}
        />
        { selectedOption &&
          <>
            <div>
            born
            <input
              type="number"
              value={born}
              onChange={({ target }) => setBorn(target.value)}
            />
            </div>
            <button type="submit">Update author</button>
          </>
        }
      </form>
    </>
  )
}

export default SetBirthyear