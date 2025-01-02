import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';

const Mentorlar = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [teachers, setTeachers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredTeachers, setFilteredTeachers] = useState([]);
  const [selectedBranch, setSelectedBranch] = useState('All');

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  useEffect(() => {
    fetch('https://shoopjson-2.onrender.com/api/teachers')
      .then((response) => response.json())
      .then((data) => {
        setTeachers(data);
        setFilteredTeachers(data);
      })
      .catch((error) => console.error('Error fetching data:', error));
  }, []);

  useEffect(() => {
    const lowercasedQuery = searchQuery.toLowerCase();
    setFilteredTeachers(
      teachers.filter(
        (teacher) =>
          (teacher.teacher.toLowerCase().includes(lowercasedQuery) ||
            teacher.surname.toLowerCase().includes(lowercasedQuery)) &&
          (selectedBranch === 'All' || teacher.filial === selectedBranch)
      )
    );
  }, [searchQuery, teachers, selectedBranch]);

  const handleBranchSelect = (branch) => {
    setSelectedBranch(branch);
    setDropdownOpen(false); // Close the dropdown after selection
  };

  return (
    <div className="w-full flex">
         <Sidebar/>   
      <div className='w-full p-6'>
        <div className="flex items-center justify-between w-full p-4 ">
          <p className="text-black text-lg font-semibold mt-2 tracking-wide uppercase">
            Mentorlar/Tutorlar
          </p>
          <form className="flex items-center border border-gray-300 rounded-[8px] px-4 py-2 bg-gray-100 w-96 h-10" action="">
            <img className="w-4 h-4 mr-2" src="https://cdn-icons-png.flaticon.com/512/10629/10629681.png" alt="Search Icon" />
            <input
              type="text"
              placeholder="qidirish..."
              className="flex-1 border-none outline-none text-sm bg-transparent"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button type="button" className="text-blue-500 font-semibold hover:underline">
              Qidiruv
            </button>
          </form>
          <div className="relative">
            <button onClick={toggleDropdown} className="flex items-center border border-gray-300 rounded-[10px] px-4 py-2 bg-gray-100 w-52 justify-between">
              <span>{selectedBranch}</span>
              <svg className="w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {dropdownOpen && (
              <ul className="absolute bg-white border border-gray-300 rounded-md shadow-lg mt-2 w-full">
                <li
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                  onClick={() => handleBranchSelect('All')}
                >
                  All
                </li>
                <li
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                  onClick={() => handleBranchSelect('YUNUSABAD')}
                >
                  YUNSABAD
                </li>
                <li
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                  onClick={() => handleBranchSelect('TINCHLIK')}
                >
                  TINCHLIK
                </li>
                <li
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                  onClick={() => handleBranchSelect('CHILONZOR')}
                >
                  CHILONZOR
                </li>
                <li
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                  onClick={() => handleBranchSelect('SERGELI')}
                >
                  SERGELI
                </li>
                <li
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                  onClick={() => handleBranchSelect('GORKIY')}


                >
                  GORKIY
                </li>
              </ul>
            )}
          </div>
        </div>

        <table className="table-auto w-full border-collapse border border-gray-300 mt-4">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 px-4 py-2">Mentor</th>
              <th className="border border-gray-300 px-4 py-2">Position</th>
              <th className="border border-gray-300 px-4 py-2">Filial</th>
              <th className="border border-gray-300 px-4 py-2">Telefon Raqami</th>
            </tr>
          </thead>
          <tbody>
            {filteredTeachers.map((teacher, index) => (
              <tr key={teacher._id} className="hover:bg-gray-50">
                <td className="border flex justify-between border-gray-300 px-4 py-2">
                  {index + 1}. {teacher.teacher} {teacher.surname}{' '}
                  <p className="text-xs text-white w-10 h-4 mt-1 bg-blue-600 rounded-sm">
                    {teacher.rol}
                  </p>
                </td>
                <td className="border text-center border-gray-300 px-4 py-2">{teacher.position}</td>
                <td className="border text-center border-gray-300 px-4 py-2">{teacher.filial}</td>
                <td className="border text-center border-gray-300 px-4 py-2">{teacher.raqam}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Mentorlar;