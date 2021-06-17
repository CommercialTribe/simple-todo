import React from 'react';
import FetchApi from '../fetch-api';

const ENTER_KEY_CODE = 13;

export default class TodoApp extends React.Component {
  state = { counts: [], todos: [], newText: '' };

  constructor(props) {
    super(props);
    this.getTodos();
  }

  getTodos = () => {
    return FetchApi.get('/todo')
      .then((todoInformation) => {
        const todos = todoInformation.todos;
        const counts = todoInformation.counts;
        this.setState({ todos });
        this.setState({ counts });
      })
      .catch(() => alert('There was an error getting todos'));
  };

  createTodo = () => {
    FetchApi.post('/todo', { text: this.state.newText })
      .then((newTodo) => {
        const newTodos = Array.from(this.state.todos);
        newTodo.complete = 0;
        newTodos.push(newTodo);
        this.setState({ todos: newTodos, newText: '' });
        this.updateCounts('newTodo');
      })
      .catch(() => alert('There was an error creating the todo'));
  };

  deleteTodo = (id) => {
    FetchApi.delete(`/todo/${id}`)
      .then(() => {
        const newTodos = Array.from(this.state.todos);
        const todoIndex = newTodos.findIndex(
          (todo) => todo.id.toString() === id.toString()
        );

        const eventType = newTodos[todoIndex].complete
          ? 'deleteCompleteTodo'
          : 'deleteIncompleteTodo';
        newTodos.splice(todoIndex, 1);
        this.setState({ todos: newTodos });
        this.updateCounts(eventType);
      })
      .catch(() => alert('Error removing todo'));
  };

  handleCheckBoxChange = (e) => {
    let newTodosState = this.state.todos;
    const idx = e.target.name;
    const checked = e.target.checked;
    const eventType = checked ? 'checkedTodo' : 'uncheckedTodo';

    newTodosState[idx].complete = checked;
    this.updateTodo(newTodosState[idx]);
    this.setState({ todos: newTodosState });
    this.updateCounts(eventType);
  };

  handleKeyDown = (e) => {
    if (e.keyCode !== ENTER_KEY_CODE) return;
    this.createTodo();
  };

  handleNewTextChange = (e) => {
    this.setState({ newText: e.target.value });
  };

  updateCounts = (eventType) => {
    let newCountsState = this.state.counts;

    // Switch vs if vs elseif here. I went with simplest.
    if (eventType === 'newTodo') {
      newCountsState.countPending++;
    }
    if (eventType === 'checkedTodo') {
      newCountsState.countCompleteOnList++;
      newCountsState.countPending--;
    }
    if (eventType === 'uncheckedTodo') {
      newCountsState.countCompleteOnList--;
      newCountsState.countPending++;
    }
    if (eventType === 'deleteCompleteTodo') {
      newCountsState.countCompleteOnList--;
    }
    if (eventType === 'deleteIncompleteTodo') {
      newCountsState.countPending--;
    }
    this.setState({ counts: newCountsState });
  };

  updateTodo = (todo) => {
    FetchApi.put(`/todo/${todo.id}`, todo)
      .then(() => {})
      .catch((e) => alert(`There was an error updating the todo`));
  };

  render() {
    return (
      <div>
        <h1>Things to get done before we make an offer to Elijah</h1>
        <div>Pending: {this.state.counts.countPending}</div>
        <div>Complete: {this.state.counts.countCompleteOnList}</div>
        <input
          autoFocus
          onChange={this.handleNewTextChange}
          onKeyDown={this.handleKeyDown}
          placeholder="What needs to be done?"
          value={this.state.newText}
        />
        <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
          {this.state.todos.map((todo, idx) => (
            <li key={todo.id}>
              <div className="view">
                <input
                  type="checkbox"
                  name={idx}
                  defaultChecked={todo.complete}
                  onChange={this.handleCheckBoxChange}
                />
                <label>{todo.text}</label>
                <button onClick={() => this.deleteTodo(todo.id)}>x</button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    );
  }
}
