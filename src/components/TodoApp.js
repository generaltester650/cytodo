import React, {Component} from 'react'
import {BrowserRouter as Router, Route} from 'react-router-dom'
import TodoForm from './TodoForm'
import TodoList from './TodoList'
import Footer from './Footer'
import {saveTodo,loadTodos,destroyTodo,updateTodo} from '../lib/service'
import {filterTodos} from '../lib/utils'

export default class TodoApp extends Component {
  constructor(props) {
    super(props)

    this.state = {
      currentTodo:'',
      todos: []
    }

    this.handleNewTodoChange  = this.handleNewTodoChange.bind(this);
    this.handleTodoSubmit     = this.handleTodoSubmit.bind(this)
    this.handleDelete         = this.handleDelete.bind(this)
    this.handleToggle         = this.handleToggle.bind(this)
  }

  handleNewTodoChange (evt) {
    this.setState({currentTodo:evt.target.value})
  }

  handleTodoSubmit (evt) {
    evt.preventDefault();
    setTimeout(() => {
      const newTodo = {name : this.state.currentTodo , isComplete : false};
      saveTodo(newTodo)
        .then(({data})=> this.setState({
          todos:this.state.todos.concat(data),
          currentTodo:''
        }))
        .catch(()=>this.setState({error:true}))
    }, 10);
    
  }

  handleDelete(id){
    destroyTodo(id)
    .then(({data})=> this.setState({
      todos  :this.state.todos.filter(t => t.id != id)
    }))
  }

  handleToggle(id){
    let targetTodo = this.state.todos.find(t => t.id === id);
    const updated  = {
      ...targetTodo,
      isComplete:!targetTodo.isComplete
    }

  updateTodo(updated)
    .then(({data})=>{
      //debugger
      const targetIndex = this.state.todos.findIndex(t=>t.id = data.id)
      const todos = [
        ...this.state.todos.slice(0,targetIndex),
        data,
        ...this.state.todos.slice(targetIndex+1)
      ]
      this.setState({todos:todos})
    })
  }

  componentDidMount (){
    loadTodos()
    .then(({data})=>this.setState({todos:data}))
    .catch(()=>this.setState({error:true}))
  }

  render () {
    const remaining = this.state.todos.filter(t=>!t.isComplete).length;
    return (
      <Router>
        <div>
          <header className="header">
            <h1>todos</h1>
            {this.state.error? <span className="error">Oh no!</span> : null}
            <TodoForm 
            
            handleTodoSubmit={this.handleTodoSubmit}
            handleNewTodoChange={this.handleNewTodoChange}
            currentTodo={this.state.currentTodo} />
          </header>
          <section className="main">
            <Route path="/:filter?" render={({match})=>
            <TodoList 
            handleDelete={this.handleDelete}
            handleToggle={this.handleToggle}
            todos={filterTodos(match.params.filter, this.state.todos) } />
           } />

            {/* <TodoList 
            handleDelete={this.handleDelete}
            handleToggle={this.handleToggle}
            todos={this.state.todos } /> */}
            
          </section>
          <Footer remaining={remaining} />
        </div>
      </Router>
    )
  }
}
