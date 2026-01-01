import './App.css';
import BackgroundMain from './components/backgroundMain/backgroundMain'
import RigthPanel from './components/RightPanel/rightPanel';
import TopPanel from './components/TopPanel/topPanel';
import FindField from './components/FindField/findField';
import TaskTitle from './components/TaskTitle/taskTitle';
import TasksTable from './components/TasksTable/tasksTable';
import { useState } from 'react';
import Drawer from './components/DrawerAddTask/DrawerAddTask';




function App() {

  

  const [open, setOpen] = useState(false);

  

  return (
    <div className="app">
      <RigthPanel>
        
      </RigthPanel>

      <BackgroundMain>
        <TopPanel>
          <TaskTitle />
            <FindField />
              <button onClick={() => setOpen(true)} className="add-tasks">
                Создать задачу
              </button>

              <Drawer open={open} onClose={() => setOpen(false)}>
                {/* добавить форму для заполнения и создания*/}
                <input placeholder="Название" />   {/* Создать отдельные компоненты, которые будут улетать в Drawer или новый компонент Form-Submit*/}
                <textarea placeholder="Описание" />
                <button>Сохранить</button>
              </Drawer>
        </TopPanel>


          {<TasksTable></TasksTable>}
          
      </BackgroundMain>
    </div>
  );
}

export default App;

