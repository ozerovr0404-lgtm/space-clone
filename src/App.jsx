import './App.css';
import BackgroundMain from './components/backgroundMain/backgroundMain'
import RigthPanel from './components/RightPanel/rightPanel';
import TopPanel from './components/TopPanel/topPanel';
import FindField from './components/FindField/findField';
import TaskTitle from './components/TaskTitle/taskTitle';
import AddTask from './components/AddTask/addTask';
import TasksTable from './components/TasksTable/tasksTable';


function App() {
  return (
    <div className="app">
      <RigthPanel>
        
      </RigthPanel>

      <BackgroundMain>
        <TopPanel>
          <TaskTitle />
          <FindField></FindField>
          <AddTask text="+ Создать задачу"></AddTask>
        </TopPanel>

        <TasksTable></TasksTable>
      </BackgroundMain>
    </div>
  );
}

export default App;

// добавить бордер для поля поиска задач (такой же как для кнопки справа)