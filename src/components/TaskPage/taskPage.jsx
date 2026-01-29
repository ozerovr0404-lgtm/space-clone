import app from '../../App.css'
import BackgroundMain from '../backgroundMain/backgroundMain.jsx'
import RigthPanel from '../RightPanel/rightPanel.jsx';
import TopPanel from '../TopPanel/topPanel.jsx';
import FindField from '../FindField/findField.jsx';
import TaskTitle from '../TaskTitle/taskTitle.jsx';
import TasksTable from '../TasksTable/tasksTable.jsx';
import { useState, useEffect } from 'react';
import Drawer from '../DrawerAddTask/DrawerAddTask.jsx';
import Creator from '../CreatorForm/Creator.jsx';
import TitleTaskField from '../TitleField/TitleField.jsx';
import TaskBodyField from '../TaskBodyField/TaskBodyField.jsx';
import TaskTableSorted from '../TaskTableSorted/taskTableSorted.jsx';
import './taskPage.css';
import UserMenu from '../UserMenu/userMenu.jsx';
import UserWindow from '../UserWindow/userWindow.jsx'
import { TASK_STATUSES } from '../../constants/taskStatus.jsx';



function TaskPage() {
  
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
  const [status, setStatus] = useState('in_plans');



  useEffect(() => {
    fetch('http://localhost:5000/')
    .then(res => res.json())
    .then(json => setData(json))
    .catch(err => console.error(err));
  }, []);


  const clearAddTaskField = () => {
    setCreator('');
    setTitle('');
    setBody('');
    setStatus('in_plans');
  };


  const handleSubmit = async (event) => {
    event.preventDefault();

    const newErrors = {
      creator: !creator.trim(),
      title: !title.trim(),
      body: !body.trim(),
      status: !status.trim()
    };
    setErrors(newErrors);

    if (newErrors.creator || newErrors.title || newErrors.body) {
      return;
    }

    const newTask = { 
      creator, 
      title, 
      body, 
      status 
    }

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
    const dateA = new Date(a.created_at);
    const dateB = new Date(b.created_at);

    if (sortOrder === 'asc') {
      return dateA - dateB;
    } else {
      return dateB - dateA;
    }
  });

  const [isUserOpen, setIsUserOpen] = useState(false);

  return (
    <>
    

      <div className="app">
        <RigthPanel>
          <UserMenu onClick={() => setIsUserOpen(prev => !prev)} />
        </RigthPanel>

        <UserWindow
          open={isUserOpen}
          onClose={() => setIsUserOpen(false)}
        />

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
        
        <div className="task-table">
          <TasksTable tasks={sortedTasks} setTasks={setTasks}/>
        </div>
        
        </BackgroundMain>
                  <Drawer open={open} onClose={() => setOpen(false)}>
                    <form onSubmit={handleSubmit} className='form-in-drawer'>
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
                        <select
                          value={status}
                          onChange={(e) => setStatus(e.target.value)}
                          className="task-status-select"
                        >
                          {TASK_STATUSES.map((s) => (
                            <option key={s.value} value={s.value}>
                              {s.label}
                            </option>
                          ))}
                        </select>
                        
                        <div className='down-grey-line'> 

                          <div className='clear-but'>
                            <button type='button' className='clear-add-task-fields' onClick={clearAddTaskField}>Очистить</button>
                          </div>

                          <button type="submit" className="save-new-task">Создать</button>
                        </div>
                      </div>
                    </form>
                  </Drawer>              

      </div>
    </>
  );
}

export default TaskPage;

