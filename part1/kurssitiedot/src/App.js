const Header = (props) => {
  return (
    <h1>{props.name}</h1>
  )
}

const Part = (props) => {
  return (
    <div>
      <p>{props.parts.part} {props.parts.exercises}</p>
    </div>
  )
}

const Content = (props) => {
  return (
    <div>
      <Part parts={props.parts[0]}/>
      <Part parts={props.parts[1]} />
      <Part parts={props.parts[2]} />
    </div>
  )
} 

const Total = (props) => {
  return (
    <div>
      <p>Number of exercises {props.total}</p>
    </div>
  )
}

const App = () => {
  const course = {
      name: 'Half Stack application development',
      parts: [
      { part: 'Fundamentals of React', exercises: 10 },
      { part: 'Using props to pass data', exercises: 7 },
      { part: 'State of a component', exercises: 14 }
      ]
  }


  return (
    <div>
      <Header name={course.name} />
      <Content parts={course.parts} />
      <Total total={
        course.parts[0].exercises + course.parts[1].exercises + course.parts[2].exercises} />
    </div>
  )
}

export default App