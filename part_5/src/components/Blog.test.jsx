import '@testing-library/jest-dom'
import { render } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'

let component

const blog = {
  title: 'Test Title',
  author: 'Test Author',
  url: 'http://test.com',
  likes: 1,
  user: {
    username: 'test.user@test.com',
    name: 'Test User',
  }
}

const user = {
  username: 'user@user.com',
  name: 'User',
}

const updateLikesMock = vi.fn()
const deleteBlogMock = vi.fn()

beforeEach(() => {
  component = render(<Blog blog={blog} updateLikes={updateLikesMock} user={user} deleteBlog={deleteBlogMock}/>)
})

test('should show title and author but not url and likes by default', () => {
  expect(component.container).toHaveTextContent(blog.title)
  expect(component.container).toHaveTextContent(blog.author)
  expect(component.container).not.toHaveTextContent(blog.url)
  expect(component.container).not.toHaveTextContent(blog.likes)
})

test('should show url, number of likes and user when view button is clicked', async () => {
  const user = userEvent.setup()
  const viewButton = component.getByText('view')
  await user.click(viewButton)
  expect(component.container).toHaveTextContent(blog.url)
  expect(component.container).toHaveTextContent(blog.likes)
  expect(component.container).toHaveTextContent(blog.user.name)
})

test('should call event handler twice when like button is double clicked', async () => {
  const user = userEvent.setup()
  const viewButton = component.getByText('view')
  await user.click(viewButton)
  const likeButton = component.getByText('like')
  await user.dblClick(likeButton)
  expect(updateLikesMock.mock.calls).toHaveLength(2)
})
