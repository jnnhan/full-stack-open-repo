import React from 'react'
import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import blogService from '../services/blogs'
import Blog from './Blog'
import Togglable from './Togglable'

describe('<Togglable />', () => {
  let container

  beforeEach(() => {
    const blog = {
      title: 'A Brilliant Test Blog',
      author: 'Master Tester',
      url: 'https://www.dummyblog',
      likes: 0
    }

    container = render(
      <div>
        {blog.title} - {blog.author}
        <Togglable buttonLabel="view" buttonHide="hide">
          <div>
            <p>{blog.url}</p>
            <p>likes: {blog.likes}</p>
            {blog.user && <p>added by {blog.user.name}</p>}
          </div>
        </Togglable>
      </div>
    ).container
  })

  test('renders title and author', () => {
    const element = screen.getByText('A Brilliant Test Blog', {exact: false})
    screen.debug(element)

    expect(element).toBeDefined()
  })

  test('url, likes and user info is not shown at the start', () => {
    const div = container.querySelector('.togglableContent')
    expect(div).toHaveStyle('display: none')
  })

  test('url, likes and user info is shown after clicking view button', async () => {
    const user = userEvent.setup()
    const button = screen.getByText('view')
    await user.click(button)

    const div = container.querySelector('.togglableContent')
    expect(div).not.toHaveStyle('display: none')
  })
})

