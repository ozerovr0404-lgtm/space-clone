import './taskPage.css';
import { useState, useEffect } from 'react';
import TasksTable from './TasksTable/tasksTable.jsx';
import UserSelect from './Selectors/UserSelector/userSelect.jsx';
import UserMenu from '../../shared/icons/UserIconMenu/userMenu.jsx';
import TopPanel from '../../shared/ui/layout/TopPanel/topPanel.jsx';
import LeftPanel from '../../shared/ui/layout/LeftPanel/leftPanel.jsx';
import TaskBodyField from '../../shared/ui/forms/TaskBodyField/TaskBodyField.jsx';
import TitleTaskField from '../../shared/ui/forms/TitleField/TitleField.jsx';
import TaskTitle from '../../shared/ui/widgets/TaskTitle/taskTitle.jsx';
import BackgroundMain from '../../shared/ui/layout/backgroundMain/backgroundMain.jsx'
import FindField from '../../features/tasks/FindField/findField.jsx';
import DrawerAddTask from '../../features/tasks/DrawerAddTask/DrawerAddTask.jsx';
import TaskTableSorted from '../../features/tasks/TaskTableSorted/taskTableSorted.jsx';
import UserWindow from '../../features/user/UserWindow/userWindow.jsx'
import DrawerFilter from '../../features/tasks/DrawerFilter/DrawerFilter.jsx'



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
  const [filterAssigneeId, setFilterAssigneeId] = useState(null);

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
        const data = await res.json();
        setTasks(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('Ошибка загрузки задач', err);
      }
    };

    fetchTasks();
  }, []);

  
  const filteredTasks = Array.isArray(tasks)
    ? tasks.filter(task => filterStatus ? task.status === filterStatus : true) : [];
  
    
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
        <LeftPanel>
          <UserMenu onClick={() => setIsUserOpen(prev => !prev)} />
        </LeftPanel>

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
          <TasksTable 
            tasks={sortedTasks}  
            setTasks={setTasks}
            users={users}
          />
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
                      users={users}
                      assigneeId={filterAssigneeId}
                      setAssigneeId={setFilterAssigneeId}
                      >
                  </DrawerFilter>
      </div>
    </>
  );
}

export default TaskPage;