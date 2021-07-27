import React from 'react';
import io from 'socket.io-client';


class App extends React.Component {
  state = {
    tasks: [],
    taskName: '',
  }
  componentDidMount() {
    this.socket = io("http://localhost:8000/");
    this.socket.on('updateTasks', (tasks) => {this.updateTasks(tasks)});
    this.socket.on('addTask', (task) => { this.addTask(task)});
    this.socket.on('removeTask', (id) => {this.removeTask(id)});
  }
  addTask(task) {
    this.setState({tasks: [...this.state.tasks, task]})
  }
  updateTasks = (tasks) => {
    this.setState({ tasks: [...tasks] })
  }
  removeTask(id) {
    for(let task of this.state.tasks) {
      if(task.id === id) {
        const array = [...this.state.tasks];
        const index = array.indexOf(task);
        if(index !== -1) {
          array.splice(index, 1);
          this.setState({tasks: array});
          this.socket.emit('removeTask', id)
        }
      }
    }
  }
  submitForm(e) {
    e.preventDefault();
    this.addTask(this.state.taskName);
    this.socket.emit('addTask', this.state.taskName)
  }
  render() {
    const {tasks} = this.state;
    const {removeTask, submitForm} = this;
    return (
      <div className="App">
    
        <header>
          <h1>ToDoList.app</h1>
        </header>
    
        <section className="tasks-section" id="tasks-section">
          <h2>Tasks</h2>
    
          <ul className="tasks-section__list" id="tasks-list">
            {tasks.map(task => (
              <li 
                key= {task.id} 
                class="task">
                  {task.name}
                <button 
                  class="btn btn--red" 
                  onClick={() => removeTask(task.id)}>
                    Remove
                </button>
              </li>
            ))}
          </ul>
    
          <form id="add-task-form" onSubmit={(e) => submitForm(e)}>
            <input 
              className="text-input" 
              autocomplete="off" 
              type="text" 
              placeholder="Type your description" 
              id="task-name" 
              value={this.state.taskName} 
              onChange={(e) => this.setState({taskName: e.currentTarget.value})}
            />
            <button className="btn" type="submit">Add</button>
          </form>
    
        </section>
      </div>
    );
  };

};

export default App;