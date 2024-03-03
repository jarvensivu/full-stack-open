import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import {
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Typography,
} from '@mui/material'
import PageHeader from '../components/PageHeader'

const Users = () => {
  const users = useSelector((state) => state.users)
  const navigate = useNavigate()

  const navigateToUser = (id) => {
    navigate(`/users/${id}`)
  }

  return (
    <div className="users">
      <PageHeader pageName="Users" />
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <Typography variant="h6" component="h3" sx={{ pl: 2 }}>
                  name
                </Typography>
              </TableCell>
              <TableCell>
                <Typography variant="h6" component="h3">
                  blogs created
                </Typography>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <TableRow
                hover
                key={user.id}
                onClick={() => navigateToUser(user.id)}
              >
                <TableCell>
                  <Typography variant="body1" component="p" sx={{ pl: 2 }}>
                    {user.name ? user.name : 'Anonymous user'}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body1" component="p">
                    {user.blogs.length}
                  </Typography>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  )
}

export default Users
