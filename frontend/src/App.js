import AdminDashboard from './components/AdminDashboard';
import './App.css';
import { Route , Routes ,Navigate } from 'react-router-dom';
import UsersList from './components/UsersList';
import UserForm from './components/UserForm';
import Login from './components/Login';
import UserDashBoard from './components/UserDashBorad';
import BusinessUnitList from './components/BusinessUnitList';
import DepartmentsList from './components/DepartmentsList';
import DepartmentForm from './components/DepartmentForm';
import ListProjects from './components/projects/ListProjects';
import CreateProject from './components/projects/CreateProject';
import AssignUsers from './components/projects/AssignUsers';
import EditProject from './components/projects/EditProject';
import ProjectLists from './components/tasks/ProjectLists';
import TaskAssign from './components/tasks/TaskAssign';
import ViewTasks from './components/tasks/ViewTasks';
import EditTask from './components/tasks/EditTask';
import Profile from './components/users/Profile';
import MyProjects from './components/users/MyProjects';
import MyTasks from './components/users/MyTasks';
import LogForm from './components/users/LogForm';
import MyLogs from './components/users/MyLogs';
import EditMyLog from './components/users/EditMyLog';
import AllUserLogs from './components/users/AllUserLogs';
import TaskStatus from './components/admindash/TaskStatus';
import ProjectStatus from './components/admindash/ProjectStatus';
import UserTaskStatus from './components/admindash/UserTaskStatus';
import ProjectHours from './components/admindash/ProjectHours';

const getUserRole = () => {
  return localStorage.getItem('role');
};

function App() {

  const role = getUserRole();
  return (
    <>
      <Routes>
          <Route path='/' element={<Login />} />
          { role === 'Admin' && (<>
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/api/users" element={<UsersList />} />
            <Route path='/add-user' element={<UserForm heading={"Add User"}/>} />
            <Route path='/edit-user/:id' element={<UserForm heading={"Edit User"}/>} />
            <Route path='/business-unit' element={<BusinessUnitList />} />
            <Route path='/departments-list' element={<DepartmentsList />} />
            <Route path='/add-department' element={<DepartmentForm />} />
            <Route path='/projects-list' element={<ListProjects />} />
            <Route path='/create-project' element={<CreateProject/>} />
            <Route path='/assign-users/:id' element={<AssignUsers />} />
            <Route path='/edit-project/:id' element={<EditProject />} />
            <Route path='/tasks-list' element={<ProjectLists />} />
            <Route path='/assign-task/:id' element={<TaskAssign />} />
            <Route path='/view-tasks/:id' element={<ViewTasks />} />
            <Route path='/edit-task/:taskId/:projectId' element={<EditTask />} />
            <Route path='/all-user-logs' element={<AllUserLogs />} />
            <Route path='/task-status' element={<TaskStatus />} />
            <Route path='/project-status' element={<ProjectStatus/>} />
            <Route path='/employee-task' element={<UserTaskStatus/>} />
            <Route path='/project-hours' element={<ProjectHours />} />
          </>   )}
          { role==='User' && (<>
            <Route path='/user-dashboard' element={<UserDashBoard />} />
            <Route path='/user-profile' element={<Profile />} />
            <Route path='/user-projects' element={<MyProjects />} />
            <Route path='/user-tasks' element={<MyTasks />} />
            <Route path='/user-postlog/:id' element={<LogForm/>} />
            <Route path='/user-logs' element={<MyLogs />} />
            <Route path='/user-tasks' element={<MyTasks />} />
            <Route path='/edit-log/:id' element={<EditMyLog />} />
          </> )}
          {!role && <Route path="*" element={<Navigate to="/" />} />}
      </Routes>      
    </>
  );
}

export default App;
