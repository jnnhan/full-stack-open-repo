const Notification = ({ message, error }) => {
  if (message === null) {
    return null
  }

  let className = 'notification'
  if (error === 'error') {
    className = 'error'
  }

  return (
    <div className={className}>
      {message}
    </div>
  )
}

export default Notification