const Country = ({country}) => (
    <div>
        <h1><b>{country.name.common}</b></h1>
        <p>capital: {country.capital}</p>
        <p>area: {country.area}</p>
        <p><b>languages:</b></p>
        <ul>
            {Object.keys(country.languages).map(language =>
                <li key={language}>{country.languages[language]}</li>)}
        </ul>
        <img src={country.flags.svg} alt={`flag of ${country.name.common}`} width="200"/>
    </div>
)

const Countries = ({countries}) => {
    if (countries.length > 10) {
        return <div>Too many matches, specify another filter</div>
    }
    else if (countries.length === 1) {
        return <Country country={countries[0]} />
    }

    return (
        <div>
            {countries.map(country => 
                <p>{country.name.common}</p>
            )}
        </div>
    )
}

export default Countries