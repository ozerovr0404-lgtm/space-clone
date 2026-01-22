import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login/login';
import TaskPage from './components/TaskPage/taskPage';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route path="/login" element={<Login />} />

        <Route
          path="/tasks"
          element={
            <ProtectedRoute>
              <TaskPage />
            </ProtectedRoute>
          }
        />

        <Route path="/" element={<Navigate to="/login" />} />

      </Routes>
    </BrowserRouter>
  )
}

export default App;