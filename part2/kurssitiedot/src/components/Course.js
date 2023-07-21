const Header = (props) => <h1>{props.name}</h1>

const Part = (props) => <p>{props.part.name} {props.part.exercises}</p>

const Content = ({ parts }) => {
    return (
        <div>
            {parts.map(part =>
                <Part key={part.id} part={part}/>
            )}
    </div>
    )
}

const Total = ({ parts }) => {
    const sum = parts.reduce((accumulator, part) => accumulator + part.exercises, 0)
    
    
    return (
        <div>
            <p><b>total of {sum} exercises</b></p>
        </div>
    )
}

const Course = ({ courses }) => {
    return (
        courses.map(course =>
            <div>
                <Header name={course.name} />
                <Content parts={course.parts} />
                <Total parts={course.parts} />
            </div>
        )
    )
}

export default Course