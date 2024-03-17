import '@testing-library/jest-dom'
import { render } from '@testing-library/react'
import BlogForm from './BlogForm'
import userEvent from '@testing-library/user-event'

test('should call event handler with right details when new blog is created', async () => {
  const addBlogMock = vi.fn()
  const component = render(<BlogForm addBlog={addBlogMock} />)

  const newBlog = {
    title: 'Test Title',
    author: 'Test Author',
    url: 'http://test.com'
  }

  const user = userEvent.setup()
  const titleInput = component.container.querySelector('#title')
  const authorInput = component.container.querySelector('#author')
  const urlInput = component.container.querySelector('#url')
  const createButton = component.getByText('create')

  await user.type(titleInput, newBlog.title)
  await user.type(authorInput, newBlog.author)
  await user.type(urlInput, newBlog.url)
  await user.click(createButton)

  expect(addBlogMock.mock.calls).toHaveLength(1)
  expect(addBlogMock.mock.calls[0][0]).toEqual(newBlog)
})
