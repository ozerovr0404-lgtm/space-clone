import './App.css';
import BackgroundMain from './components/backgroundMain/backgroundMain'
import RigthPanel from './components/RightPanel/rightPanel';
import TopPanel from './components/TopPanel/topPanel';
import FindField from './components/FindField/findField';
import TaskTitle from './components/TaskTitle/taskTitle';
import TasksTable from './components/TasksTable/tasksTable';
import { useState, useEffect } from 'react';
import Drawer from './components/DrawerAddTask/DrawerAddTask';
import Creator from './components/CreatorForm/Creator';
import TitleTaskField from './components/TitleField/TitleField';
import TaskBodyField from './components/TaskBodyField/TaskBodyField';
import TaskTableSorted from './components/TaskTableSorted/taskTableSorted.jsx';




function App() {
  
  const [open, setOpen] = useState(false);
  const [data, setData] = useState(null);
  const [creator, setCreator] = useState('');
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [errors, setErrors] = useState({
    creator: false,
    title: false,
    body: false
  });
  const [tasks, setTasks] = useState([]);
  const [sortOrder, setSortOrder] = useState('desc');


  useEffect(() => {
    fetch('http://localhost:5000/')
    .then(res => res.json())
    .then(json => setData(json))
    .catch(err => console.error(err));
  }, []);


  const handleSubmit = async (event) => {
    event.preventDefault();

    const newErrors = {
      creator: !creator.trim(),
      title: !title.trim(),
      body: !body.trim()
    };
    setErrors(newErrors);

    if (newErrors.creator || newErrors.title || newErrors.body) {
      return;
    }


    const newTask = { creator, title, body }

    try {
      const response = await fetch('http://localhost:5000/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newTask)
      });


      const result = await response.json();
      console.log('Ответ сервера', result);

      setTasks(prevTasks => [result.task, ...prevTasks]);
      setCreator('');
      setTitle('');
      setBody('');
      setErrors({ creator: false, title: false, body: false });
      setOpen(false);

    } catch (err) {
      console.error('Ошибка при добавлении задачи', err);
    }    
  };


  useEffect(() => {
    fetch('http://localhost:5000/tasks')
    .then(res => res.json())
    .then(tasks => setTasks(tasks))
    .catch(err => console.error(err));
  }, [])
  

  const sortedTasks = [...tasks].sort((a, b) => {
    if (sortOrder === 'asc') {
      return a.id - b.id;
    } else {
      return b.id - a.id;
    }
  });

  return (
    <>
      {/* <h1>React + Backend Test</h1>
      {data ? <pre>{JSON.stringify(data, null, 2)}</pre> : 'Loading...'}  Добавлялось для теста бекенда*/}
    

      <div className="app">
        <RigthPanel />

        <BackgroundMain>
          <TopPanel>
            <div className="top-panel-left">
              <TaskTitle />
              <FindField />
            </div>

            <div className="top-panel-right">
              <button onClick={() => setOpen(true)} className="add-tasks">
                Создать задачу
              </button>
            </div>
            
          </TopPanel>
          
            <TaskTableSorted 
              sortOrder={sortOrder}
              setSortOrder={setSortOrder}
            />  
        

        <TasksTable tasks={sortedTasks} />

        </BackgroundMain>
                  <Drawer open={open} onClose={() => setOpen(false)}>
                    <form onSubmit={handleSubmit}>
                      <div className='form-fields'>
                        <Creator 
                          value={creator} 
                          onChange={(val) => {
                          setCreator(val);
                          setErrors(prev => ({ ...prev, creator: false }));
                        }} 
                          hasError={errors.creator}/>

                        <TitleTaskField 
                          value={title} 
                            onChange={(val) => {
                              setTitle(val);
                              setErrors(prev => ({ ...prev, title: false }));
                            }} 
                            hasError={errors.title}/>
                        <TaskBodyField
                          value={body} 
                          onChange={(val) => {
                            setBody(val);
                            setErrors(prev => ({ ...prev, body: false }))
                          }} 
                          hasError={errors.body}/>
                        <button type="submit" className="save-new-task">Создать</button>
                      </div>
                    </form>
                  </Drawer>

      </div>
    </>
  );
}

export default App;

