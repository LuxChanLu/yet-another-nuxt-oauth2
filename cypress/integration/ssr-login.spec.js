context('Login on server side', () => {
  beforeEach(() => cy.visit('/logged'))
  it('should be logged', () => {
    cy.get('span[data-cy="token-sub"]').should('be.visible').should('contain', 'johndoe')
    cy.get('span[data-cy="token-scope"]').should('be.visible').should('contain', 'dummy')
  })
})
