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




function App() {
  
  const [open, setOpen] = useState(false);
  const [data, setData] = useState(null);
  const [creator, setCreator] = useState('');
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');

  useEffect(() => {
    fetch('http://localhost:5000/')
    .then(res => res.json())
    .then(json => setData(json))
    .catch(err => console.error(err));
  }, []);

  const handleSubmit = (event) => {
    event.preventDefault();

    console.log({
      creator,
      title,
      body
    });
  };
  

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
          
        <TasksTable />

        </BackgroundMain>
                  <Drawer open={open} onClose={() => setOpen(false)}>
                    <form onSubmit={handleSubmit}>
                      <div className='form-fields'>
                        <Creator value={creator} onChange={setCreator} />
                        <TitleTaskField value={title} onChange={setTitle} />
                        <TaskBodyField value={body} onChange={setBody} />
                        <button type="submit" className="save-new-task">Создать</button>
                      </div>
                    </form>
                  </Drawer>

      </div>
    </>
  );
}

export default App;

