const Notification = ({ message, error }) => {
    if (message === null) {
        return null
    }
    console.log(message, error)

    let className = "notification"
    if (error) {
        className = "error"
    }

    return (
        <div className={className}>
            {message}
        </div>
    )
}

export default Notification