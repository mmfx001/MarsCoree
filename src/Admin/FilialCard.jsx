import React, { useEffect, useState } from "react";
import axios from "axios";

const FilialCards = () => {
  const [filials, setFilials] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchFilials = async () => {
      try {
        const response = await axios.get("http://localhost:5001/api/filials");
        setFilials(response.data);
        setIsLoading(false);
      } catch (error) {
        console.error("Filial ma'lumotlarini olishda xatolik yuz berdi:", error);
      }
    };

    fetchFilials();
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-between w-full gap-4">
        {Array(3)
          .fill(0)
          .map((_, index) => (
            <div
              key={index}
              className="bg-gray-300 rounded-lg shadow-lg p-3 w-[30%] h-32 animate-pulse"
            ></div>
          ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 w-full mt-4 gap-4">
      {filials.map((filial) => (
        <div key={filial.id} className="flex justify-between w-full gap-4">
          <div className="bg-blue-500 text-white rounded-lg shadow-lg p-3 hover:scale-105 transform transition duration-300 w-[30%] h-32">
            <strong>Groups </strong>
            <p className="text-3xl font-bold">{filial.groups}</p>
          </div>
          <div className="bg-blue-500 text-white rounded-lg shadow-lg p-3 hover:scale-105 transform transition duration-300 w-[30%] h-32">
            <strong>Teachers: </strong>
            <p className="text-3xl font-bold">{filial.teachers}</p>
          </div>
          <div className="bg-blue-500 text-white rounded-lg shadow-lg p-3 hover:scale-105 transform transition duration-300 w-[30%] h-32">
            <strong>Students: </strong>
            <p className="text-3xl font-bold">{filial.students}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default FilialCards;
