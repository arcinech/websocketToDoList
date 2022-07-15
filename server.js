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
    // methods: ["GET", "POST", "DELETE"],
  }
});
// app.use(express.static(path.join(__dirname, '/client/build')));



io.on('connection', (socket) => {
  console.log('a user connected with id: ' + socket.id);
  console.log(db.tasks)
  io.to(socket.id).emit('updataData', (db.tasks));

  socket.on('addTask', task => {
    db.tasks.push(task)
    console.log('task emited:' + socket.id);
    socket.broadcast.emit('addTask', task);
  });

  socket.on('removeTask', id => { 
    console.log(db.tasks);
    db.tasks = db.tasks.filter((task) => task.id !== id);
    socket.broadcast.emit('removeTask', id);
  });

  app.get('*', (req,res) => { 
  res.status(404).json({message: 'Not found...' })
  });
})