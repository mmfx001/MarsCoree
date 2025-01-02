import { Route, Routes } from 'react-router-dom';
import TeacherCard from './Componients/teachercard';
import StudentList from './Componients/StudentList';
import Login from './Componients/login';
import Header from './Componients/Header';
import Salary from './Componients/Salary';
import Exam from './Componients/exam';
import Davomat from './Componients/Davomat';
import ProjectsPage from './Componients/Loyihalar';
import Sidebar from './Admin/Sidebar';
import Dashboard from './Admin/Dashboard';
import Group from './Admin/Groups';
import Mentorlar from './Admin/Mentorlar';
import StudentTable from './Admin/Students';
import Magazin from './Admin/Magazin';
import StudentCreate from './Admin/StudentCreate';
import PrivateRoute from './PriwateRouter';
const App = () => {
  // Get the role from localStorage
  const role = localStorage.getItem('role');
  console.log(role);

  return (
    <div className='flex w-full'>
      { role == 'teacher' ? <Header /> : null}

      <Routes>
        <Route path="/" element={<Login />} />
        
        {/* Wrap routes that need authentication in PrivateRoute */}
        <Route element={<PrivateRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/teacher" element={<TeacherCard />} />
          <Route path="/salary" element={<Salary />} />
          <Route path="/shop" element={<Magazin />} />
          <Route path="/students" element={<StudentCreate />} />
          <Route path="/coins" element={<StudentTable />} />
          <Route path="/groups" element={<Group />} />
          <Route path="/mentors" element={<Mentorlar />} />
          <Route path="/talim" element={<ProjectsPage />} />
          <Route path="/exam" element={<Exam />} />
          <Route path="/davomat" element={<Davomat />} />
          <Route path="/list" element={<StudentList />} />
        </Route>
      </Routes>
    </div>
  );
};

export default App;
