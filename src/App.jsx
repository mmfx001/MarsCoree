import { Route, Routes } from 'react-router-dom';
import TeacherCard from './Componients/teachercard';
import StudentList from './Componients/StudentList';
import Login from './Componients/login';
import Header from './Componients/Header';
import Salary from './Componients/Salary';



const App = () => {
  return (
    <>
      <Header /> {/* Place Header here to show on all routes */}
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/teacher" element={<TeacherCard />} />
        <Route path="/salary" element={<Salary />} />
        <Route path="/teacher/:teacherId/group/:groupId" element={<StudentList />} /> {/* Separate route for student list */}
      </Routes>
    </>
  );
};


export default App;
