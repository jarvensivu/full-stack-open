const Persons = ({ filterStr, allPersons, handleRemove }) => {
  const filteredPersons = () => {
    return allPersons.filter((person) =>
      person.name.toLowerCase().includes(filterStr.toLowerCase().trim())
    );
  };

  const persons =
    filterStr.trim().length === 0 ? allPersons : filteredPersons();

  return (
    <div>
      {persons.map((person) => (
        <p key={person.id}>
          {person.name} {person.number}
          <button onClick={() => handleRemove(person.id, person.name)}>
            delete
          </button>
        </p>
      ))}
    </div>
  );
};

export default Persons;
