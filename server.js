const express = require('express');
const socket = require('socket.io');

const tasks = [];

const app = express();

const server = app.listen(8000, () => {
  console.log('Server is running on port: 8000');
});

const io = socket(server);

io.on('connection', (socket) => {
  console.log('New client! Its id – ' + socket.id);
  socket.emit('updateData', tasks);
  socket.on('addTask', (task) => {
    console.log('Oh, I\'ve got something from ' + socket.id);
    tasks.push(task);
    socket.broadcast.emit('addTask', task);
  });
  socket.on('removeTask', () => {
    console.log('Oh, I\'ve got something from ' + socket.id);
    for(let task of tasks) {
      if(task.id == socket.id) {
        const index = tasks.indexOf(task);
        socket.broadcast.emit('removeTask', task);
        tasks.splice(index, 1);
      }
    }
  });
});

app.use((req, res) => {
  res.status(404).send({ message: "Not found..." });
});