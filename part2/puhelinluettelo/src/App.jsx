import { useState, useEffect } from 'react'

import PersonForm from './components/PersonForm'
import Persons from './components/Persons'
import Filter from './components/Filter'
import personService from './services/persons'

const App = () => {
  const [persons, setPersons] = useState([]) 
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilter] = useState('')

  useEffect(() => {
    personService
      .getAll()
      .then(initialPersons => {
        setPersons(initialPersons)
      })
  }, [])

  const deletePerson = (person) => {
    if (window.confirm(`Delete ${person.name}?`))
      personService
        .erase(person.id)

      setPersons(persons.filter(persons => 
        persons.id !== person.id))
  }

  const addPerson = (e) => {
    e.preventDefault()

    if (persons.some((person) => person.name === newName)) {
      if (window.confirm(`${newName} is already added to phonebook, replace
      the old number with a new one?`)) {
        const personObject = {
          name: newName,
          number: newNumber
        }
        
        const person = persons.find(p => p.name === newName)

        personService
          .update(person.id, personObject)
          .then(returnedPerson => {
            setPersons(persons.map(p =>
              p.id !== person.id ? p : returnedPerson))
        })
      }
    }
    else {
      const personObject = {
        name: newName,
        number: newNumber
      }

        personService
          .create(personObject)
          .then(returnedPerson => {
            setPersons(persons.concat(returnedPerson))
        })
    }
    setNewName('')
    setNewNumber('')
  }

  const handleNameChange = (e) => {
    setNewName(e.target.value)
  }

  const handleNumberChange = (e) => {
    setNewNumber(e.target.value)
  }

  const handleFilter = (e) => {
    setFilter(e.target.value)
  }

  const numbersToShow = (filter.length === 0)
    ? persons
    : persons.filter(value => value.name.toLowerCase().includes(filter.toLowerCase()))

  return (
    <div>
      <h2>Phonebook</h2>
        
      <Filter handleChange={handleFilter} filter={filter} />

      <h3>Add a new number</h3>

      <PersonForm handleSubmit={addPerson}
        nameChange={handleNameChange} name={newName}
        numberChange={handleNumberChange} number={newNumber}
      />
      
      <h3>Numbers</h3>

      <Persons persons={numbersToShow} handleDelete={deletePerson} />
    </div>
  )

}

export default App