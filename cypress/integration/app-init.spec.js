describe('App Initiaization', () =>{
    it('Loads todo on page load', () =>{

        cy.seedAndVisit()

        cy.get('.todo-list li')
            .should('have.length',5)

    })

    it('Display an error on failure',()=>{
        cy.server();

        cy.route({
            url: '/api/todos',
            method:'GET',
            status:500,
            response:{}
        })

        cy.visit('/')


        cy.get('.todo-list li')
        .should('not.exist')

        cy.get('.error')
          .should('be.visible')

    })

})