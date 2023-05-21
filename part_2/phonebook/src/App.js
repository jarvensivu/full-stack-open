import { useState, useEffect } from "react";
import Filter from "./components/Filter";
import Persons from "./components/Persons";
import PersonForm from "./components/PersonForm";
import Notification from "./components/Notification";
import personService from "./services/persons";

const App = () => {
  const [allPersons, setAllPersons] = useState([]);
  const [filterStr, setFilterStr] = useState("");
  const [newPerson, setNewPerson] = useState({ name: "", number: "" });
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    personService.getAll().then((persons) => {
      setAllPersons(persons);
    });
  }, []);

  const handleSubmit = (event) => {
    event.preventDefault();
    var result = allPersons.find(
      (person) => person.name === newPerson.name.trim()
    );
    if (result === undefined) {
      personService
        .create(newPerson)
        .then((person) => {
          setAllPersons(allPersons.concat(person));
          setNewPerson({ name: "", number: "" });
          displayNotification(
            "success",
            `${person.name} was successfully added`
          );
        })
        .catch((error) => {
          displayNotification("error", `${error.response.data.error}`);
        });
    } else {
      if (
        window.confirm(
          `${newPerson.name} is already added to phonebook, replace the old number with a new one?`
        )
      ) {
        personService
          .update(result.id, newPerson)
          .then((updatedPerson) => {
            setAllPersons(
              allPersons.map((person) =>
                person.id !== updatedPerson.id ? person : updatedPerson
              )
            );
            setNewPerson({ name: "", number: "" });
            displayNotification(
              "success",
              `${newPerson.name} was successfully updated`
            );
          })
          .catch((error) => {
            if(error.status === 404){
              setAllPersons(
                allPersons.filter((person) => person.id !== result.id)
              );
              displayNotification(
                "error",
                `Information of ${newPerson.name} has already removed from server`
              );
            }
            else {
              const errorMessage = error.response.data.error ?? 'unknown error'
              displayNotification("error", errorMessage);
            }
          });
      }
    }
  };

  const handleFormChange = (event) => {
    const { name, value } = event.target;
    setNewPerson((newPerson) => ({
      ...newPerson,
      [name]: value,
    }));
  };

  const handleChangeFilter = (event) => {
    setFilterStr(event.target.value);
  };

  const handleRemove = (id, name) => {
    if (window.confirm(`Delete ${name}?`)) {
      personService.remove(id).then(() => {
        setAllPersons(allPersons.filter((person) => person.id !== id));
        displayNotification("success", `${name} was successfully deleted`);
      });
    }
  };

  const displayNotification = (type, text) => {
    setNotification({ type, text });
    setTimeout(() => {
      setNotification(null);
    }, 4000);
  };

  return (
    <>
      <h2>Phonebook</h2>
      <Notification notification={notification} />
      <Filter filterStr={filterStr} handleChangeFilter={handleChangeFilter} />
      <h3>add a new</h3>
      <PersonForm
        newPerson={newPerson}
        handleSubmit={handleSubmit}
        handleFormChange={handleFormChange}
      />
      <h3>Numbers</h3>
      <Persons
        filterStr={filterStr}
        allPersons={allPersons}
        handleRemove={handleRemove}
      />
    </>
  );
};

export default App;
