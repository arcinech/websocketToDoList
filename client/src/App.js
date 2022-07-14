import io from 'socket.io-client';
import shortid from 'shortid';
import {useState, useEffect} from 'react';

function App() {

  const [tasks, setTasks] = useState([]);
  const [task, setTask] = useState({
    id: '',
    name: '',
  });
  const [socket, setSocket] = useState(io("http://localhost:3001"));
  const [request, setRequest] = useState(false);

  useEffect(() => {
    setSocket(io("http://localhost:3001"));
  },[]);
  
  
  const addTask = (e) => { 
    e.preventDefault();
    setTask((task)=> task.id = shortid.generate());
    setTasks(tasks => [...tasks, task]);
    socket.emit('addTask', task);
    setTask({id: '', name: ''});
  };

  const removeTask = id => {
    setTasks(tasks => tasks.filter(task=> task.id !== id));
    if(request) { 
      socket.emit('removeTask', id);
      setRequest(false);
    }
  }

  const removeAction = (e, id) => {
    e.preventDefault();
    setRequest(true);
    removeTask(id);
  };

  socket.on('updateData', data => { 
    setTasks(data)});
  socket.on('removeTask', id => removeTask(id));
  socket.on('addTask', task => setTasks((tasks) => [...tasks, task]));
  
  return (
    <div className="App">
  
      <header>
        <h1>ToDoList.app</h1>
      </header>
  
      <section className="tasks-section" id="tasks-section">
        <h2>Tasks</h2>
  
        <ul className="tasks-section__list" id="tasks-list">
          {tasks && tasks.map(({id, name}) => 
            <li 
              className="task" 
              key={id}>{name}
              <button 
                className="btn btn--red" 
                onClick={e => removeAction(e, id)}>
                  Remove
              </button>
            </li>
          )}
        </ul>
  
        <form id="add-task-form" onSubmit={addTask}>
          <input className="text-input"  value={task.name}onChange={e=> setTask({name: e.target.value})} autoComplete="off" type="text" placeholder="Type your description" id="task-name" />
          <button className="btn" type="submit">Add</button>
        </form>
  
      </section>
    </div>
  );
}

export default App;
