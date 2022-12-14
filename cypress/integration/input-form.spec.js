

describe('Input form', () =>{

    beforeEach(()=>{
        cy.seedAndVisit([])
        //cy.visit('/')
    })

    it('focus input on load', () =>{
        cy.focused()
          .should('have.class','new-todo')
    });

    it('accepts input', () =>{
        const typeText = 'Buy Milk'
        cy.get('.new-todo')
        .type(typeText)
        .should('have.value',typeText)
    })

    context('Form Submissions',() =>{

        beforeEach(()=>{
            cy.server();
        })


        it('Add a new todo on submit',()=>{
            const itemText = 'Buy eggs';            
            cy.route('POST','/api/todos', {
                name: itemText,
                id: 1,
                isComplete:false
            })

            cy.get('.new-todo')
            .type(itemText)
            .type('{enter}')
            .should('have.value','') 

            cy.get('.todo-list li')
            .should('have.length',1)
            .and('contain',itemText)
        })


        it('Show an error message on a failed submission',()=>{
            cy.route({
                url: '/api/todos',
                method:'POST',
                status:500,
                response:{}
            })

            cy.get('.new-todo')
            .type('test{enter}')


            cy.get('.todo-list li')
            .should('not.exist')

            cy.get('.error')
              .should('be.visible')

        })

    })
})