describe('Footer', () =>{
     
    context('with a single todo',()=>{
        it('displays a singular todo in count',()=>{
            cy.seedAndVisit([{id:1,name:'Buy Milk',isComplete: false}])

            cy.get('.todo-count')
              .should('contain','1 todo left')

        })
    })

    context('with multiple todos',()=>{
        beforeEach(()=>{
            cy.seedAndVisit();
        })
        it('displays plural todos in count',()=>{
            
            cy.get('.todo-count')
              .should('contain','4 todos left')
        });

        it('Handle filter links',()=>{

            const filters = [
                {link:'Active',expectedLength:4},
                {link:'Completed',expectedLength:1},
                {link:'All',expectedLength:5}
            ]

            cy.wrap(filters)
            .each( filter => {

                cy.contains(filter.link)
                .click()

                cy.get('.todo-list li')
                .should('have.length', filter.expectedLength)

            })
        });


    })

})