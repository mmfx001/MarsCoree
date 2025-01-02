import React, { useState, useEffect } from "react";

const Skeleton = () => {
  return (
    <div className="animate-pulse space-y-4">
      <div className="h-6 bg-gray-300 rounded w-1/4"></div>
      {[...Array(5)].map((_, index) => (
        <div key={index} className="flex gap-4 mb-4">
          <div className="h-8 bg-gray-300 rounded w-1/12"></div>
          <div className="h-8 bg-gray-300 rounded w-1/3"></div>
          <div className="h-8 bg-gray-300 rounded w-1/6"></div>
          <div className="h-8 bg-gray-300 rounded w-1/4"></div>
        </div>
      ))}
    </div>
  );
};

const StudentTable = () => {
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [inputValues, setInputValues] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [notification, setNotification] = useState("");

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await fetch(
          "https://shoopjson-2.onrender.com/api/students"
        );
        const data = await response.json();

        const initialInputs = {};
        data.forEach((student) => {
          initialInputs[student.id] = ""; 
        });

        setStudents(data);
        setFilteredStudents(data);
        setInputValues(initialInputs);
        setIsLoading(false);
      } catch (error) {
        console.error("Xatolik:", error);
      }
    };

    fetchStudents();
  }, []);

  const handleSearch = (term) => {
    setSearchTerm(term);
    const filtered = students.filter((student) =>
      student.name.toLowerCase().includes(term.toLowerCase())
    );
    setFilteredStudents(filtered);
  };

  const handleInputChange = (id, value) => {
    setInputValues({ ...inputValues, [id]: value });
  };

  const showNotification = (message) => {
    setNotification(message);
    setTimeout(() => setNotification(""), 3000);
  };

  const addCoins = async (id) => {
    const value = parseInt(inputValues[id] || 0, 10);

    if (value <= 0) {
      showNotification("Iltimos, to'g'ri coin kiriting!");
      return;
    }

    try {
      const student = students.find((s) => s.id === id);
      if (!student) {
        showNotification("Student topilmadi!");
        return;
      }

      const newCoins = student.coins + value;
      const newBalance = student.balance + value;

      const response = await fetch(
        `https://shoopjson-2.onrender.com/api/students/${id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            coins: newCoins,
            balance: newBalance, // Balanceni yangilash
          }),
        }
      );

      if (response.ok) {
        const updatedStudent = await response.json();

        setStudents((prev) =>
          prev.map((s) =>
            s.id === id
              ? { ...s, coins: updatedStudent.coins, balance: updatedStudent.balance }
              : s
          )
        );

        setFilteredStudents((prev) =>
          prev.map((s) =>
            s.id === id
              ? { ...s, coins: updatedStudent.coins, balance: updatedStudent.balance }
              : s
          )
        );

        setInputValues({ ...inputValues, [id]: "" });

        showNotification("Coins muvaffaqiyatli qo'shildi!");
      } else {
        showNotification("Xatolik yuz berdi!");
      }
    } catch (error) {
      console.error("Xatolik:", error);
      showNotification("Xatolik yuz berdi!");
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen w-full max-w-full">
     <div className="flex items-center justify-center">
     <h1 className="text-3xl sm:text-5xl font-bold text-center text-blue-600 mb-6">
        Student Coins 
      </h1>
      
     </div>
      {notification && (
        <div className="bg-green-500 text-white text-center py-2 rounded mb-4">
          {notification}
        </div>
      )}

      <div className="flex justify-between items-center mb-4 relative w-full max-w-full">
        <input
          type="text"
          placeholder="O'quvchini qidirish..."
          className="border border-gray-300 rounded px-6 py-2 w-full sm:w-96 md:w-80 lg:w-96 shadow focus:outline-none pr-10"
          value={searchTerm}
          onChange={(e) => handleSearch(e.target.value)}
        />
        {searchTerm && (
          <button
            className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            onClick={() => {
              setSearchTerm("");
              setFilteredStudents(students); 
            }}
          >
            ❌
          </button>
        )}
      </div>

      {isLoading ? (
        <Skeleton />
      ) : (
        <div className="overflow-x-auto w-full max-w-full">
          <table className="table-auto w-full bg-white rounded-lg shadow-lg text-left">
            <thead>
              <tr className="bg-gray-200 text-gray-800">
                <th className="border px-4 sm:px-6 py-3">#</th>
                <th className="border px-4 sm:px-6 py-3">O'quvchi</th>
                <th className="border px-4 sm:px-6 py-3">Coins</th>
                <th className="border px-4 sm:px-6 py-3">Balance</th>
                <th className="border px-4 sm:px-6 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.map((student, index) => (
                <tr
                  key={student.id}
                  className={`hover:bg-${index % 2 === 0 ? "gray-100" : "white"} ${
                    index % 2 === 0 ? "bg-gray-100" : "bg-white"
                  }`}
                >
                  <td className="border px-4 sm:px-6 py-3">{index + 1}</td>
                  <td className="border px-4 sm:px-6 py-3">{student.name}</td>
                  <td className="border px-4 sm:px-6 py-3">{student.coins}</td>
                  <td className="border px-4 sm:px-6 py-3">{student.balance}</td>
                  <td className="border px-4 sm:px-6 py-3">
                    <div className="flex items-center gap-4">
                      <input
                        type="number"
                        className="border rounded px-4 py-2 w-24 sm:w-32 md:w-40 lg:w-48 shadow focus:outline-none"
                        value={inputValues[student.id] || ""}
                        onChange={(e) => {
                          const newValue = e.target.value;
                          if (newValue >= 0 && newValue <= 500) {
                            handleInputChange(student.id, newValue);
                          }
                        }}
                        placeholder="Coin"
                      />
                      <button
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                        onClick={() => addCoins(student.id)}
                      >
                        Qo'shish
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default StudentTable;
