describe('Blog app', function() {
  beforeEach(function() {
    cy.request('POST', `http://localhost:3003/api/testing/reset`)

    const user = {
      name: 'Cybil Cypress',
      username: 'cypressian',
      password: 'secret'
    }

    const secondUser = {
      name: 'Maija Blogger',
      username: 'maijuli',
      password: 'strong'
    }
    cy.request('POST', `http://localhost:3003/api/users`, user)
    cy.request('POST', `http://localhost:3003/api/users`, secondUser)
    cy.visit('http://localhost:5173')
  })

  it('Login form is shown', function() {
    cy.contains('username:')
    cy.contains('password:')
    cy.contains('log in')
  })

  describe('Login', function() {
    it('succeeds with correct credentials', function() {
      cy.get('#username').type('cypressian')
      cy.get('#password').type('secret')
      cy.get('#login-button').click()

      cy.contains('user cypressian logged in')
    })

    it('fails with wrong credentials', function() {
      cy.get('#username').type('cypressian')
      cy.get('#password').type('wrong')
      cy.get('#login-button').click()

      cy.contains('wrong credentials')
    })
  })

  describe('When logged in', function() {
    beforeEach(function() {
      cy.login({ username: 'cypressian', password: 'secret' })

      cy.createBlog({
        title: 'The first blog',
        author: 'Test user',
        url: 'www.testblog'
      })
    })

    it('A blog can be created', function() {
      cy.contains('new blog').click()
      cy.get('#title').type('A blog about cypress')
      cy.get('#author').type('Cybil Cypress')
      cy.get('#url').type('www.cypressblog')
      cy.get('#submit-button').click()
      cy.contains('A blog about cypress - Cybil Cypress')
    })

    it('A blog can be liked', function() {
      cy.contains('The first blog')
        .contains('view')
        .click()

      cy.contains('The first blog')  
        .contains('like')
        .click()
    })

    it('A blog added by the user can be deleted', function() {
      cy.contains('The first blog')
        .contains('view')
        .click()

      cy.contains('The first blog')
        .contains('remove')
        .click()
    })

    it('Only the creator of the blog can see the remove button', function() {
      cy.contains('logout').click()
      cy.login({ username: 'maijuli', password: 'strong' })

      cy.contains('The first blog')
        .contains('view')
        .click()

      cy.contains('The first blog')
        .get('#remove-button').should('not.exist')
    })
  })
})