describe('Smoke Text', () =>{
    beforeEach(()=>{
        cy.request('GET','/api/todos')
          .its('body')
          .each(todo => cy.request('DELETE',`/api/todos/${todo.id}`) )
    })
    context("With no todos",()=>{
        it("Save new todos", () => {
            let items = [
                {text:'Buy Milk',expectedLength:1},
                {text:'Buy Egg',expectedLength:2},
                {text:'Buy Bread',expectedLength:2}
            ]
            cy.visit('/')
            cy.server()
            cy.route('POST','/api/todos')
              .as('create')


            cy.wrap(items)
              .each(todo =>{

                cy.focused()
                .type(todo.text)
                .type('{enter}')

                cy.wait('@create')

                cy.get('.todo-list li')
                .should('have.length',todo.expectedLength)

              })            

        })
    })


    context("With active todos",()=>{


    })

})