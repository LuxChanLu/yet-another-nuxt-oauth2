context('Actions', () => {
  beforeEach(() => cy.visit('/'))

  it('cy.scrollTo() - scroll the window or element to a position', () => {
    cy.scrollTo('bottom')
  })
})
