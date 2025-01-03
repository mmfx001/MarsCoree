import React, { useState, useEffect } from "react";
import axios from "axios";
import Sidebar from "./Sidebar";
import { Group as GroupIcon } from 'lucide-react';

const Group = () => {
  const [teachers, setTeachers] = useState([]);
  const [students, setStudents] = useState([]); // State to store student data
  const [selectedDay, setSelectedDay] = useState("toq"); // Default: toq
  const [rooms, setRooms] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [groupDetails, setGroupDetails] = useState([]);
  const [isLoading, setIsLoading] = useState(true); // Loading state
  const [isModalOpen, setIsModalOpen] = useState(false); // Modal visibility state
  const [selectedGroup, setSelectedGroup] = useState(null); // Selected group for the modal
  const [groupStudents, setGroupStudents] = useState([]); // Students in the selected group

  // Fetch teachers and students data from API
  useEffect(() => {
    const fetchTeachersAndStudents = async () => {
      try {
        const [teachersResponse, studentsResponse] = await Promise.all([
          axios.get("https://shoopjson-2.onrender.com/api/teachers"),
          axios.get("https://shoopjson-2.onrender.com/api/students")
        ]);

        setTeachers(teachersResponse.data);
        setStudents(studentsResponse.data); // Set students data
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTeachersAndStudents();
  }, []);

  // Filter rooms based on the selected day
  useEffect(() => {
    if (teachers.length >1) {
      const filteredRooms = teachers.flatMap((teacher) =>
        teacher.groups.map((group) => group.rooms)
      );                       
      setRooms([...new Set(filteredRooms)]);
      console.log("Rooms:", filteredRooms); // Debugging log
    }
  }, [teachers]);

  // Filter group details based on selected room and day
  useEffect(() => {
    if (selectedRoom && teachers.length > 0) {
      const filteredGroups = teachers.flatMap((teacher) =>
        teacher.groups.filter(
          (group) => group.rooms === selectedRoom && group.havtaKun === selectedDay
        )
      );
      setGroupDetails(filteredGroups);
      console.log("Filtered Groups:", filteredGroups); // Debugging log
    }
  }, [selectedRoom, selectedDay, teachers]);

  // Open the modal and filter students based on the selected group
  const openModal = (group) => {
    setSelectedGroup(group);

    // Filter students based on the selected group's group number
    const studentsInGroup = students.filter(student =>
      student.group === group.groupNumber // Adjusting to match group property
    );

    setGroupStudents(studentsInGroup);
    setIsModalOpen(true);
  };

  // Close the modal
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedGroup(null);
    setGroupStudents([]);
  };

  return (
    <div className="w-full flex">
      <Sidebar />
      <div className="p-6 w-full  min-h-screen">
        <div className="bg-white w-full h-[93vh]">
          <div className="flex gap-3 items-center">
            <GroupIcon className="w-6 h-6 text-white" />
            <h2 className="font-semibold text-xl text-white">Groups</h2>
          </div>
          <hr className="mt-5" />
          <div className="max-w-7xl mx-auto">



            {/* Havta kunini tanlash */}
            <div className="flex justify-center mt-5 mb-6 gap-4">
              <button
                onClick={() => setSelectedDay("juft")}
                className={`px-6 py-3 mx-2 rounded-lg shadow-md font-medium transition-all duration-300 ${selectedDay === "juft"
                  ? "bg-gray-600 text-white"
                  : "bg-white text-gray-700 border border-gray-300 hover:bg-blue-100"
                  }`}
              >
                Juft kunlar
              </button>
              <button
                onClick={() => setSelectedDay("toq")}
                className={`px-6 py-3 mx-2 rounded-lg shadow-md font-medium transition-all duration-300 ${selectedDay === "toq"
                  ? "bg-gray-600 text-white"
                  : "bg-white text-gray-700 border border-gray-300 hover:bg-blue-100"
                  }`}
              >
                Toq kunlar
              </button>
            </div>

            {/* Tanlangan kun bo'yicha rooms */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Rooms</h2>
              <div className="flex flex-wrap gap-3 justify-center">
                {isLoading ? (
                  <div className="w-24 h-12 bg-gray-300 animate-pulse rounded-lg" />
                ) : (
                  rooms.map((room, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedRoom(room)}
                      className={`px-5 py-3 rounded-lg shadow-md font-medium transition-all duration-300 ${selectedRoom === room
                        ? "bg-gray-600 text-white"
                        : "bg-white text-gray-700 border border-gray-300 hover:bg-blue-100"
                        }`}
                    >
                      {room}
                    </button>
                  ))
                )}
              </div>
            </div>

            {/* Tanlangan room bo'yicha guruhlar */}
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({ length: 3 }).map((_, index) => (
                  <div
                    key={index}
                    className="bg-white shadow-lg rounded-lg p-6 border border-gray-200 animate-pulse"
                  >
                    <div className="h-6 bg-gray-300 mb-2 rounded-md" />
                    <div className="h-4 bg-gray-300 mb-2 rounded-md" />
                    <div className="h-4 bg-gray-300 mb-2 rounded-md" />
                    <div className="h-4 bg-gray-300 mb-2 rounded-md" />
                  </div>
                ))}
              </div>
            ) : selectedRoom && groupDetails.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {groupDetails.map((group, index) => (
                  <div
                    key={index}
                    className="bg-white shadow-lg rounded-lg p-6 border border-gray-200 hover:shadow-xl transition-shadow duration-300 relative group transform hover:-translate-y-2"
                  >
                    <h2 className="text-lg font-bold text-gray-600 mb-2">
                      Guruh raqami: {group.groupNumber}
                    </h2>
                    <p className="text-black">
                      <strong>O'qituvchi:</strong> {group.teacherName}
                    </p>
                    <p className="text-black">
                      <strong>Xona raqami:</strong> {group.rooms}
                    </p>
                    <p className="text-black">
                      <strong>Dars vaqti:</strong> {group.groupTime.start} - {group.groupTime.end}
                    </p>


                    {/* Hover qilinganda yozuv */}
                    <div
                      onClick={() => openModal(group)}
                      className="absolute top-2 right-2 bg-gray-700 text-white text-xs font-semibold px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 cursor-pointer"
                    >
                      View
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center">Hech qanday guruh topilmadi yoki to'liq malumot bermadingiz</p>
            )}
          </div>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Guruh o'quvchilari</h2>

            {/* Display the student data in a table-like layout */}
            <div className="overflow-x-auto">
              <table className="min-w-full table-auto">
                {/* Table Header */}
                <thead>
                  <tr className="bg-gray-100">
                    <th className="px-4 py-2 text-left font-semibold">Name</th>
                    <th className="px-4 py-2 text-left font-semibold">Coins</th>
                    <th className="px-4 py-2 text-left font-semibold">XP</th>
                  </tr>
                </thead>

                {/* Table Body */}
                <tbody>
                  {groupStudents.length > 0 ? (
                    groupStudents.map((student, index) => (
                      <tr key={index} className="border-t">
                        <td className="px-4 py-2">{student.name}</td>
                        <td className="px-4 py-2">{student.coins}</td>
                        <td className="px-4 py-2">{student.xp}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="3" className="text-center px-4 py-2 text-gray-500">No students in this group.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="mt-4 flex justify-end">
              <button onClick={closeModal} className="px-6 py-2 bg-gray-600 text-white rounded-lg">Close</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default Group;