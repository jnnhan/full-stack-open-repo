import { useState } from 'react'

const Button = (props) => (
  <button onClick={props.handleClick}>{props.text}</button>
)

const Anecdotes = (props) => {
  let result = ""
  if (props.votes === 1) {
    result = "has 1 vote"
  }
  else {
    result = "has " + props.votes + " votes"
  }
  return (
    <>
      <p>{props.anecdote}</p>
      <p>{result}</p>
    </>
  )
}

const Header = ({ text }) => (
  <h1>{text}</h1>
)

const App = () => {
  const anecdotes = [
    'If it hurts, do it more often.',
    'Adding manpower to a late software project makes it later!',
    'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
    'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
    'Premature optimization is the root of all evil.',
    'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.',
    'Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when dianosing patients.',
    'The only way to go fast, is to go well.'
  ]
   
  const [selected, setSelected] = useState(0)
  const [points, setPoints] = useState(new Uint8Array(8))
  const [mostVoted, setMostVoted] = useState(0)

  const random = () => {
    let x = selected

    while (x === selected) {
      x = Math.floor((Math.random() * (anecdotes.length - 1)))
    }
    
    setSelected(x)
  }

  const handleVote = place => {
    const copy = [...points]
    copy[place] += 1
    
    setPoints(copy)
    setMostVoted(copy.indexOf(Math.max( ...copy)))
  }

  return (
    <div>
      <Header text="Anecdote of the day" />
      <Anecdotes anecdote={anecdotes[selected]} votes={points[selected]} />
      <Button handleClick={() => handleVote(selected)} text="vote" />
      <Button handleClick={() => random()} text="next anecdote" />
      <Header text="Anecdote with most votes" />
      <Anecdotes anecdote={anecdotes[mostVoted]} votes={points[mostVoted]} />
    </div>
  )
}

export default App