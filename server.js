const express = require('express');
const path = require('path');
const socket = require('socket.io');
const db = require('./db.js');

const app = express();
const server = app.listen(8000, ()=> {
  console.log('Server is listening on port 8000');
});

const io = socket(server, {
  cors: {
    origin: ["http://localhost:3000"],
  }
});

io.on('connection', (socket) => {
  io.to(socket.id).emit('updataData', (db.tasks));
  console.log('Emitedd list of task to user:' + socket.id);

  socket.on('addTask', task => {
    db.tasks = [...db.tasks, task]
    console.log('Add task:' + task);
    socket.broadcast.emit('addTask', task);
  });

  socket.on('removeTask', id => { 
    console.log('Remove task with id:' + id);
    db.tasks = db.tasks.filter((task) => task.id !== id);
    socket.broadcast.emit('removeTask', id);
  });

  app.use((req, res) => {
    res.status(404).json({message: 'Not found...' });
  });
})