import BackgroundMain from '../backgroundMain/backgroundMain.jsx'
import RigthPanel from '../RightPanel/rightPanel.jsx';
import TopPanel from '../TopPanel/topPanel.jsx';
import FindField from '../FindField/findField.jsx';
import TaskTitle from '../TaskTitle/taskTitle.jsx';
import TasksTable from '../TasksTable/tasksTable.jsx';
import { useState, useEffect } from 'react';
import DrawerAddTask from '../DrawerAddTask/DrawerAddTask.jsx';
import Creator from '../CreatorForm/Creator.jsx';
import TitleTaskField from '../TitleField/TitleField.jsx';
import TaskBodyField from '../TaskBodyField/TaskBodyField.jsx';
import TaskTableSorted from '../TaskTableSorted/taskTableSorted.jsx';
import './taskPage.css';
import UserMenu from '../UserMenu/userMenu.jsx';
import UserWindow from '../UserWindow/userWindow.jsx'
import DrawerFilter from '../DrawerFilter/DrawerFilter.jsx'
import UserSelect from '../UserSelect/userSelect.jsx';


function TaskPage() {
  
  const [open, setOpen] = useState(false);
  const [data, setData] = useState(null);
  const [assigneeId, setAssigneeId] = useState(null);
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [errors, setErrors] = useState({
    assignee: false,
    title: false,
    body: false
  });
  const [tasks, setTasks] = useState([]);
  const [sortOrder, setSortOrder] = useState('desc');
  const [status, setStatus] = useState('in_plans');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState(null);
  const [users, setUsers] = useState([]);
  const token = localStorage.getItem('token');

  useEffect(() => {
    fetch('http://localhost:5000/')
    .then(res => res.json())
    .then(json => setData(json))
    .catch(err => console.error(err));
  }, []);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch('http://localhost:5000/users', {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          }
        });
        const data = await res.json();
        console.log('USERS:', data);
        setUsers(data);
      } catch (err) {
        console.error('Ошибка при получении пользователей', err);
      }
    };

    fetchUsers();
  }, [token]);


  const clearAddTaskField = () => {
    setAssigneeId(null);
    setTitle('');
    setBody('');
    setStatus('in_plans');
  };


  const handleSubmit = async (event) => {
    event.preventDefault();

    const newErrors = {
      assignee: !assigneeId,
      title: !title.trim(),
      body: !body.trim(),
      status: !status.trim()
    };
    setErrors(newErrors);

    if (newErrors.assignee || newErrors.title || newErrors.body) {
      return;
    }

    const token = localStorage.getItem('token');
      if (!token) {
        console.error('Нет токена, необходимо авторизоваться');
        return;
      }

    try {
      const response = await fetch('http://localhost:5000/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          title, 
          body, 
          status, 
          assignee_id: assigneeId
        })
      });


      const result = await response.json();
      console.log('Ответ сервера', result);

      if (response.ok && result.task) {
        setTasks(prev => [result.task, ...prev]);
        clearAddTaskField();
        setOpen(false)
      } else {
        console.error('Ошибка при создании задачи:', result.error || 'Неизвестная ошибка');
      }
    } catch (err) {
      console.error('Ошибка при добавлении задачи', err);
    }    
  };


  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch('http://localhost:5000/tasks', {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          }
        });
        const tasks = await res.json();
        setTasks(tasks);
      } catch (err) {
        console.error('Ошибка загрузки задач', err);
      }
    };

    fetchTasks();
  }, [token]);

  
  const filteredTasks = tasks.filter(task => {
    if (filterStatus && task.status !== filterStatus) {
      return false;
    }
    return true;
  });

  const sortedTasks = [...filteredTasks].sort((a, b) => {
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
              <button onClick={() => setIsFilterOpen(true)} className="tasks-filter">
                Фильтр
              </button>
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
                  <DrawerAddTask open={open} onClose={() => setOpen(false)}>
                    <form onSubmit={handleSubmit} className='form-in-drawer'>
                      <div className='form-fields'>
                        <UserSelect
                          users={users}
                          value={assigneeId}
                          onChange={setAssigneeId} 
                          hasError={errors.assignee}/>

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
                        
                        
                        

                        <div className='down-grey-line'> 

                          <div className='clear-but'>
                            <button type='button' className='clear-add-task-fields' onClick={clearAddTaskField}>Очистить</button>
                          </div>

                          <button type="submit" className="save-new-task">Создать</button>
                        </div>
                      </div>
                    </form>
                  </DrawerAddTask>              
                    <DrawerFilter 
                      open={isFilterOpen} 
                      onClose={() => setIsFilterOpen(false)}
                      onApply={({ status }) => {
                        setFilterStatus(status);
                      }}
                      >
                  </DrawerFilter>
      </div>
    </>
  );
}

export default TaskPage;