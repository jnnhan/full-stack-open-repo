import { useState } from 'react'

const Filter = (props) => (
  <div>
    filter by name 
      <input
        value={props.filter}
        onChange={props.handleChange}
      />
  </div>
)

const PersonForm = (props) => (
  <form onSubmit={props.handleSubmit}>
    <div>
      name: <input
        value={props.name}
        onChange={props.nameChange} />
    </div>
    <div>
      number: <input
        value={props.number}
        onChange={props.numberChange} />
    </div>
    <div>
      <button type="submit">add</button>
    </div>
  </form>
)

const Person = ({ person}) => (
  <p>{person.name} {person.number}</p>
)

const Persons = ({ persons }) => (
  persons.map(person =>
    <Person key={person.name} person={person}/>
)
)

const App = () => {
  const [persons, setPersons] = useState([
    { name: '',
      number: '' }
  ]) 
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilter] = useState('')

  const addPerson = (e) => {
    e.preventDefault()

    if (persons.some((value) => value.name === newName)) {
      window.alert(`${newName} is already added to phonebook`)
    }
    else {
      const personObject = {
        name: newName,
        number: newNumber
      }
      setPersons(persons.concat(personObject))
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

      <Persons persons={numbersToShow} />
    </div>
  )

}

export default App