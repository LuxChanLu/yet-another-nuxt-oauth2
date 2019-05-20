context('Auth flow', () => {
  beforeEach(() => cy.visit('/'))
  it('should login', () => {
    cy.get('a[data-cy="login"]').click()
    cy.get('span[data-cy="token-sub"]').should('be.visible').should('contain', 'johndoe')
    cy.get('span[data-cy="token-scope"]').should('be.visible').should('contain', 'dummy')
  })

  it('should login, wait expire notice and logout', () => {
    let stub = cy.stub()
    cy.on('window:alert', stub)

    cy.clock((new Date()).getTime())

    cy.get('a[data-cy="login"]').click()
    cy.get('span[data-cy="token-sub"]').should('be.visible').should('contain', 'johndoe')
    cy.get('span[data-cy="token-scope"]').should('be.visible').should('contain', 'dummy')

    // eslint-disable-next-line jest/valid-expect
    cy.tick(3000 * 1000).tick(598 * 1000).wait(1000).then(() => expect(stub.getCall(0)).to.be.calledWith('Token gonna expire !'))


    cy.reload()
    stub = cy.stub()
    cy.on('window:alert', stub)

    // eslint-disable-next-line jest/valid-expect
    cy.tick(50 * 1000).wait(1000).then(() => expect(stub.getCall(0)).to.be.calledWith('Token gonna expire !'))

    cy.get('button[data-cy="logout"]').click().tick(1000)

    cy.get('span[data-cy="is-logout"]').should('be.visible')
  })

  it('should login, wait expire notice and refresh', () => {
    const stub = cy.stub()
    cy.on('window:alert', stub)

    cy.clock((new Date()).getTime())

    cy.get('a[data-cy="login"]').click()
    cy.get('span[data-cy="token-sub"]').should('be.visible').should('contain', 'johndoe')
    cy.get('span[data-cy="token-scope"]').should('be.visible').should('contain', 'dummy')

    cy.tick(3000 * 1000).tick(598 * 1000).wait(1000)

    cy.get('button[data-cy="token-refresh"]').should('be.visible').click().tick(500).wait(500)
    cy.get('button[data-cy="token-refresh"]').should('not.be.visible')

    // eslint-disable-next-line jest/valid-expect
    cy.tick(500).wait(500).then(() => expect(stub.getCall(0)).to.be.calledWith('Token gonna expire !'))

  })
})
