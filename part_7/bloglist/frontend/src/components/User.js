import { useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'

const User = () => {
  const { id } = useParams()
  const user = useSelector((state) =>
    state.users.find((user) => user.id === id)
  )

  if (!user) {
    return null
  }

  return (
    <div>
      <h3>{user.name ? user.name : 'Anonymous user'}</h3>
      <h4>added blogs</h4>
      <ul>
        {user.blogs.map((blog) => (
          <li key={blog.id}>{blog.title}</li>
        ))}
      </ul>
    </div>
  )
}

export default User
