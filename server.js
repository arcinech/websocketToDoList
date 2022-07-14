const express = require('express');
const path = require('path');

const app = express();
const server = app.listen(8000, ()=> {
  console.log('Server is listening on port 8000');
});

app.get('*', (req,res) => { 
  res.status(404).json({message: 'Not found...' })
});