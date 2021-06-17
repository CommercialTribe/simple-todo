import { TODOS_TEST_DATA } from '../test-data';

let todos = TODOS_TEST_DATA;
let todosCreated = todos.length;

export default class TodoData {
  static create(todo) {
    return new Promise((resolve) => {
      todo.id = ++todosCreated;
      todo.complete = false;
      todo.deleted = 0;
      todos.push(todo);
      resolve(todo);
    });
  }

  static delete(id) {
    return new Promise((resolve, reject) => {
      const todoIndex = todos.findIndex(
        (todo) => todo.id.toString() === id.toString()
      );
      if (todoIndex < 0 || todoIndex >= todos.length) return reject();
      todos[todoIndex].deleted = 1;
      resolve();
    });
  }
  static findAll() {
    // Decided against sending unnecessary counts, but planned on giving a full
    // history to the user so they could see the how many they completed even after
    // they have deleted them.
    let countAllHistorical = 0;
    let countPending = 0;
    let countCompleteOnList = 0;
    let countCompleteHistorical = 0;

    let newTodos = todos.filter((todo) => {
      countAllHistorical++;
      todo.complete && countCompleteHistorical++;
      todo.complete && !todo.deleted && countCompleteOnList++;
      !todo.complete && !todo.deleted && countPending++;
      return !todo.deleted;
    });
    const responseObject = {
      todos: newTodos,
      counts: {
        countPending,
        countCompleteOnList,
      },
    };
    return new Promise((resolve) => resolve(responseObject));
  }

  static update(id, todo) {
    return new Promise((resolve, reject) => {
      const todoIndex = todos.findIndex(
        (todoItem) => todoItem.id.toString() === id.toString()
      );
      if (todoIndex < 0 || todoIndex >= todos.length) return reject();
      todos[todoIndex] = todo;
      resolve(todo);
    });
  }
}
