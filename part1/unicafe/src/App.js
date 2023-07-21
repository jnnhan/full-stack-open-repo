
import { useState } from 'react'

const Header = ({text}) => (
  <div>
    <h1>{text}</h1>
  </div>
)

const Button = (props) => (
  <button onClick={props.handleClick}>{props.text}</button>
)

const StatisticLine = (props) => (
  <div>
    <table>
      <tbody>
        <tr>
          <td width="75" text-align="left">{props.text}</td>
          <td width="75" text-align="left">{props.value}</td>
        </tr> 
      </tbody>
    </table>
  </div>
)

const Statistics = ({ good, neutral, bad }) => {
  const all = good + neutral + bad
  
  if ( all === 0 ) {
    return <div>No feedback given</div>
  }
  const average = (good - bad)/all
  const positive = ((good/all)*100).toFixed(1) + '%'

  return (
    <>
      <StatisticLine text='good' value={good} />
      <StatisticLine text='neutral' value={neutral} />
      <StatisticLine text='bad' value={bad} />
      <StatisticLine text='all' value={all} />
      <StatisticLine text='average' value={average} />
      <StatisticLine text='positive' value={positive} />
    </>
  )
}

const App = () => {
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  return (
    <div>
      <Header text='give feedback' />
      <Button handleClick={() => setGood(good + 1)} text='good' />
      <Button handleClick={() => setNeutral(neutral + 1)} text='neutral' />
      <Button handleClick={() => setBad(bad + 1)} text='bad' />
      <Header text='statistics' />
      <Statistics good={good} neutral={neutral} bad={bad}/>
    </div>
  )
}

export default App
