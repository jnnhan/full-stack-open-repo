import { useState, useEffect } from 'react'
import axios from 'axios'

import Countries from './components/Countries'

const App = () => {
  const [filter, setFilter] = useState('')
  const [countries, setCountries] = useState([])

  useEffect(() => {
    axios
      .get(`https://studies.cs.helsinki.fi/restcountries/api/all`)
      .then(response => {
        setCountries(response.data)
      })
  }, [])

  const handleFilter = (e) => {
    setFilter(e.target.value)
  }

  const countriesToShow = (filter.length === 0)
    ? []
    : countries.filter(value => value.name.common.toLowerCase().includes(filter.toLocaleLowerCase()))

  return (
    <div>
      find countries
      <input
        value={filter}
        onChange={handleFilter}
      />
      <Countries countries={countriesToShow}/>
    </div>
  )
}
export default App;
