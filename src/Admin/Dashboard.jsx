import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaSearch, FaMoneyBillWave } from "react-icons/fa"; // Import icons
import FilialCards from "./FilialCard";
import MonthlyPaymentsChart from "./Chart";
import Sidebar from "./Sidebar";

const Dashboard = () => {
    const [students, setStudents] = useState([]);
    const [admin, setAdmin] = useState(null); // Admin ma'lumotlari
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedStudent, setSelectedStudent] = useState(null); // Tanlangan talaba
    const [payment, setPayment] = useState({
        date: "",
        filial: "",
        price: "",
    });
    const [loading, setLoading] = useState(true); // Loading holati

    useEffect(() => {
        const fetchStudents = async () => {
            try {
                const response = await axios.get("https://shoopjson-2.onrender.com/api/students");
                setStudents(response.data);
                setLoading(false); // Ma'lumotlar yuklandi, loadingni o'chirish
            } catch (error) {
                console.error("Talabalarni yuklashda xatolik:", error);
            }
        };

        const fetchAdmin = async () => {
            try {
                const response = await axios.get("https://shoopjson-2.onrender.com/api/admin");
                const defaultAdmin = response.data.find((admin) => admin.id === "1");
                setAdmin(defaultAdmin);
            } catch (error) {
                console.error("Admin ma'lumotlarini yuklashda xatolik:", error);
            }
        };

        fetchStudents();
        fetchAdmin();
    }, []);

    const handleSearch = (e) => {
        setSearchTerm(e.target.value.toLowerCase());
    };

    const handlePaymentClick = (student) => {
        setSelectedStudent(student);

        // Hozirgi vaqtni olish va formatlash
        const now = new Date();
        const formattedDate = `${String(now.getDate()).padStart(2, "0")}-${String(
            now.getMonth() + 1
        ).padStart(2, "0")}-${now.getFullYear()} ${String(
            now.getHours()
        ).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;

        setPayment((prev) => ({
            ...prev,
            date: formattedDate,
            filial: admin?.filial || "", // Adminning filial ma'lumotini o'rnatish
        }));
    };

    const handlePaymentSubmit = async () => {
        try {
            const paymentData = {
                id: new Date().getTime().toString(), // Unique ID
                user_id: selectedStudent.id,
                date: payment.date,
                filial: payment.filial,
                price: payment.price,
            };

            // To'lovni serverga yuborish
            await axios.post("https://shoopjson-2.onrender.com/api/tolov", paymentData);

            // Studentni yangilangan `tolov` qiymati bilan serverga yuborish
            const updatedStudent = {
                ...selectedStudent,
                tolov: (
                    parseFloat(selectedStudent.tolov || 0) + parseFloat(payment.price || 0)
                ).toFixed(2),
            };

            // Studentning yangilangan ma'lumotini serverga yuborish
            await axios.put(
                `https://shoopjson-2.onrender.com/api/students/${selectedStudent.id}`,
                updatedStudent
            );

            // Students ma'lumotlarini holatda yangilash
            setStudents((prevStudents) =>
                prevStudents.map((student) =>
                    student.id === selectedStudent.id
                        ? updatedStudent // Yangilangan student ma'lumotlari
                        : student
                )
            );

            setSelectedStudent(null); // Formani yopish
            setPayment({ date: "", filial: "", price: "" }); // Formani tozalash
        } catch (error) {
            console.error("To'lovda xatolik yuz berdi:", error);
        }
    };

    // Inputdagi miqdorni formatlash uchun funksiya
    const formatPrice = (value) => {
        let formattedValue = value.replace(/\D/g, "").slice(0, 8); // Maksimal uzunlik 8 ta raqam
        formattedValue = formattedValue.replace(/\B(?=(\d{3})+(?!\d))/g, "."); // Har 3 raqamdan keyin nuqta qo'yish
        return formattedValue;
    };

    const handlePriceChange = (e) => {
        setPayment((prev) => ({
            ...prev,
            price: formatPrice(e.target.value),
        }));
    };

    const filteredStudents = students.filter((student) =>
        student.name?.toLowerCase().includes(searchTerm)
    );
    

    return (
        <div className="w-full flex bg-gray-100">
            <Sidebar />
            <div className="p-6 w-full h-screen flex gap-6 overflow-hidden">
                <div className="flex flex-col items-center w-3/5">
                    <MonthlyPaymentsChart />
                    <FilialCards />
                </div>

                <div className="w-2/5 bg-white rounded-lg shadow-lg p-6 overflow-scroll">
                    <h1 className="text-3xl font-semibold text-blue-600 mb-6">Talabalar Ro'yxati</h1>

                    {/* Search qismi */}
                    <div className="flex items-center mb-6 border-2 border-gray-300 rounded-full px-3">
                        <FaSearch className="text-blue-500" />
                        <input
                            type="text"
                            placeholder="Talabani qidirish..."
                            value={searchTerm}
                            onChange={handleSearch}
                            className="flex-1 p-2 outline-none rounded-full bg-white"
                        />
                    </div>

                    {/* Talabalar ro'yxatini ko'rsatish */}
                    {loading ? (
                        <div className="space-y-4">
                            <div className="skeleton w-full h-8 bg-gray-300 rounded"></div>
                            <div className="skeleton w-full h-8 bg-gray-300 rounded"></div>
                            <div className="skeleton w-full h-8 bg-gray-300 rounded"></div>
                        </div>
                    ) : (
                        <table className="w-full  mb-6">
                            <thead className="bg-blue-100">
                                <tr>
                                    <th className="border px-4 py-3 text-left text-lg">ID</th>
                                    <th className="border px-4 py-3 text-left text-lg">Ism</th>
                                    <th className="border px-4 py-3 text-left text-lg">To'lov</th>
                                    <th className="border px-4 py-3 text-left text-lg">Guruh</th>
                                    <th className="border px-4 py-3 text-left text-lg">Amallar</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredStudents.map((student) => (
                                    <tr key={student.id} className="hover:bg-blue-50 transition duration-300 ease-in-out">
                                        <td className="border px-4 py-3">{student.id}</td>
                                        <td className="border px-4 py-3">{student.name}</td>
                                        <td className="border px-4 py-3">{student.tolov}</td>
                                        <td className="border px-4 py-3">{student.group}</td>
                                        <td className="border px-4 py-3">
                                            <button
                                                onClick={() => handlePaymentClick(student)}
                                                className="text-green-500 hover:text-green-700 px-5"
                                            >
                                                <FaMoneyBillWave className="inline" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}

                    {/* To'lov formasi */}
                    {selectedStudent && (
                        <div className="mt-8 p-6 border border-gray-300 rounded-lg bg-gray-50">
                            <h2 className="text-xl font-semibold text-blue-600 mb-4">{selectedStudent.name} uchun to'lov</h2>

                            <label className="block mb-2 text-gray-700">To'lov miqdori:</label>
                            <input
                                type="text"
                                placeholder="Miqdori"
                                value={payment.price}
                                onChange={handlePriceChange}
                                className="block w-full p-3 border-2 border-gray-300 rounded-lg mb-4"
                            />
                            <div className="flex gap-4">
                                <button
                                    onClick={handlePaymentSubmit}
                                    className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-all"
                                >
                                    To'lovni amalga oshir
                                </button>
                                <button
                                    onClick={() => setSelectedStudent(null)}
                                    className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-all"
                                >
                                    Bekor qilish
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
