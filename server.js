const express = require('express');
const path = require('path');
const socket = require('socket.io');
const db = require('./db.js');

const app = express();
const server = app.listen(3001, ()=> {
  console.log('Server is listening on port 8000');
});
const io = socket(server, {
  cors: {
    origin: ["http://localhost:3000"],
    methods: ["GET", "POST", "DELETE"],
  }
});

let data = db.tasks;
// app.use(express.static(path.join(__dirname, '/client/build')));

app.get('*', (req,res) => { 
  res.status(404).json({message: 'Not found...' })
});

io.on('connection', (socket) => {
  console.log(data)
  socket.emit('updateData', data);

  socket.on('updateData ', () => { 
    socket.to(socket.id).emit('updateData', data);
  });

  socket.on('addTask', task => {
    console.log(task);
    data.push(task);
    socket.broadcast.emit('addTask', task);
  });

  socket.on('removeTask', task => { 
    data = data.filter(({id}) => id !== task.id);
    socket.broadcast.emit('removeTask', task);
  });
})