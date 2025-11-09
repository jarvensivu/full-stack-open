const Notify = ({ message, color }) => {
  if ( !message ) {
    return null
  }

  return (
    <div style={{color: color}}>
      {message}
    </div>
  )
}

export default Notify
