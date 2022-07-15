import io from 'socket.io-client';
import shortid from 'shortid';
import {useState, useEffect} from 'react';
// const socket = io('http://localhost:3001');
function App() {

  const [tasks, setTasks] = useState([]);
  const [socket, setSocket] = useState(io());
  const [name, setName] = useState('');
  const [id, setId] = useState(shortid.generate());
  const [request, setRequest] = useState(false);

  useEffect(() => {
    setSocket(io('http://localhost:3001'));
    console.log('socket: ' + socket);
    socket.on('updateData', data => setTasks(tasks => [...tasks, ...data]));
    socket.on('removeTask', id => removeTask(id));
    socket.on('addTask', task => addTask(task));

    return () => {
      socket.off('updateData');
      socket.off('removeTask');
      socket.off('addTask');
    };
  },[]);

  
  const addTask = (task) => {
    console.log(task);
    setTasks(tasks => [...tasks, task]);
  }

  const removeTask = id => {
    // console.log(id)
    setTasks(tasks => tasks.filter(task=> task.id !== id));
    if(!request) { 
      socket.emit('removeTask', id);
      setRequest(state => state=false);
    }
  }

  const submitTask = async (e) => {
    e.preventDefault();
    if(name.length === 0) return;
    addTask({id: id, name:name});
    const task = {id: id, name:name};
    socket.emit('addTask', task);
    setName('');
    setId(shortid.generate());
  }

  const removeAction = (e, id) => {
    e.preventDefault();
    setRequest(state => state=true);
    removeTask(id);
  };
  
   return( 
    <div className="App">
  
      <header>
        <h1>ToDoList.app</h1>
      </header>
  
      <section className="tasks-section" id="tasks-section">
        <h2>Tasks</h2>
  
        <ul className="tasks-section__list" id="tasks-list">
          {tasks && tasks.map(({id, name}) => {
            return(<li 
              className="task" 
              key={id}>{name}
              <button 
                className="btn btn--red" 
                onClick={e => removeAction(e, id)}>
                  Remove
              </button>
            </li>)}
          )}
        </ul>
  
        <form id="add-task-form" onSubmit={submitTask}>
          <input className="text-input"  value={name} onChange={e=> setName(e.target.value)} autoComplete="off" type="text" placeholder="Type your description" id="task-name" />
          <button className="btn" type="submit">Add</button>
        </form>
  
      </section>
    </div>
  );
}

export default App;
