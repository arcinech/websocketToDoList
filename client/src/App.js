import io from 'socket.io-client';
import shortid from 'shortid';
import {useState, useEffect} from 'react';
const socket = io('http://localhost:8000');

function App() {

  const [tasks, setTasks] = useState([]);
  const [name, setName] = useState('');
  const [id, setId] = useState(shortid.generate());
  const [pending, setPending] = useState(true);

  useEffect(() => {
    socket.on('removeTask', (id) => removeTask(id));
    socket.on('addTask', task => addTask(task));
    socket.on('updataData', data => setTasks(task => [...task, ...data]));
    setPending(bool => bool=false);

    return () => {
      socket.off('updateData');
      socket.off('removeTask');
      socket.off('addTask');
    };
  },[]);

  //
  const addTask = (task) => setTasks(tasks => [...tasks, task]);
  const removeTask = (id) => setTasks(tasks => tasks.filter(task=> task.id !== id));

  const submitTask =  (e) => {
    e.preventDefault();
    //abort if task name is null or undefined, or empty;
    if(!name) return;

    socket.emit('addTask', {id: id, name:name});
    addTask({id: id, name:name});

    setName('');
    setId(shortid.generate());
  }

  const removeAction = (e, id) => {
    e.preventDefault();
    
    socket.emit('removeTask', id);
    removeTask(id, true);
  };
  
   if(!pending) return( 
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
