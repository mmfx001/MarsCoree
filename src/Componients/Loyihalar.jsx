import React, { useState, useEffect } from 'react';
import ChildSidebar from './childsaidbar';

const ProjectsPage = () => {
    const [projects, setProjects] = useState([]);
    const [selectedProject, setSelectedProject] = useState(null);
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const projectsPerPage = 7;

    useEffect(() => {
        fetch('https://shoopjson-2.onrender.com/api/projects')
            .then((response) => response.json())
            .then((data) => {
                setProjects(data);
                setLoading(false);
            })
            .catch((error) => {
                setError(error.message);
                setLoading(false);
            });
    }, []);

    useEffect(() => {
        if (selectedProject) {
            fetch(`https://shoopjson-2.onrender.com/api/students?group_id=${selectedProject.group_id}`)
                .then((response) => response.json())
                .then((data) => {
                    setStudents(data);
                })
                .catch((error) => {
                    setError(error.message);
                });
        }
    }, [selectedProject]);

    const handleProjectClick = (project) => {
        setSelectedProject(project);
    };

    const totalPages = Math.ceil(projects.length / projectsPerPage);

    const handleNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    const handlePreviousPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    const currentProjects = projects.slice(
        (currentPage - 1) * projectsPerPage,
        currentPage * projectsPerPage
    );

    if (loading) {
        return <div className="text-center">Loading...</div>;
    }

    if (error) {
        return <div className="text-red-500">{error}</div>;
    }

    return (
        <div className="flex h-screen">
            <ChildSidebar />
            <div className="w-1/5 ml-20 pt-20 bg-white p-6 border-r">
                <div className="flex items-center text-orange-500 text-xl font-semibold mb-6">
                    <span className="mr-2">⦿</span>
                    <h2 className="text-2xl">Guruhlar</h2>
                </div>

                <h2 className="text-lg font-bold mb-4">Loyihalar</h2>
                <ul className="space-y-3">
                    {currentProjects.map((project, index) => (
                        <li key={project.id}>
                            <button
                                className={`block w-full text-left p-3 rounded-lg transition duration-300 
                                    ${selectedProject === project ? 'bg-orange-500 text-white' : 'hover:bg-orange-100 text-gray-800'}
                                `}
                                onClick={() => handleProjectClick(project)}
                            >
                                {index + 1}. {project.name}
                            </button>
                        </li>
                    ))}
                </ul>

                {/* Pagination */}
                <div className="mt-20 text-center flex justify-center items-center space-x-4">
                    <button
                        onClick={handlePreviousPage}
                        className={`text-purple-500 ${currentPage === 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
                        disabled={currentPage === 1}
                    >
                        &lt;
                    </button>
                    <span className="text-orange-500">{currentPage} / {totalPages}</span>
                    <button
                        onClick={handleNextPage}
                        className={`text-purple-500 ${currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : ''}`}
                        disabled={currentPage === totalPages}
                    >
                        &gt;
                    </button>
                </div>
            </div>

            {/* Main content */}
            <div className="flex-1 mt-20 bg-gray-50 p-6 overflow-y-auto">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-semibold text-orange-500">
                        {selectedProject ? selectedProject.name : 'Loyihani tanlang'}
                    </h1>
                    <button className="bg-green-500 text-white py-2 px-4 rounded-md">
                        Yangilash
                    </button>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-lg">
                    <div className="flex justify-between">
                        <h2 className="text-xl font-semibold text-orange-500">Homework</h2>
                        
                    </div>
                    <div className="flex flex-col">
                        <h2 className="text-xl font-semibold text-orange-500 mt-4">Methodology</h2>
                        <div>
                            <ul className="menu menu-horizontal px-1">
                                <li>
                                    <details>
                                        <summary className="cursor-pointer">Methodology</summary>
                                        <ul className="bg-base-100 rounded-t-none p-2">
                                            <div>
                                                <div>
                                                    <p>Mavzu: Tanishuv</p>
                                                </div>
                                                <div>
                                                    <p>Tanishuv</p>
                                                    <p>Barcha o'quvchilar bilan yaqindan tanishish va ularning nimalarga qiziqishini sorash</p>
                                                    <p>15:30 - 15:55</p>
                                                </div>
                                                <div>
                                                    <p>Ism topish oyini</p>
                                                    <p>O'qituvchi har bitta o'quvchini ismini soragandan keyin.O'quvchilar bilan ism topish o'yini oynaladi ya'ni o'quvchilar bir birlari bilan tanishadi.
                                                        Masalan 1-o'quvchi ismini aytsa (Sherzod) 2-o'quvchi esa 1-o'quvchini ismini va o'zini ismini aytadi(Sherzod , Sanjar). 3-o'quvchi esa 2 ta o'quvchini ismini aytib davom ettiradi(Sherzod ,Sanjar,Mansur) va shunaqa ko'rinishda davom etadi.
                                                        O'yin oxirida bolalarga coin beriladi
                                                        QR code Generator tushuntirib bering</p>
                                                    <p>15:10 - 15:20</p>
                                                </div>
                                                <div>
                                                    <p>QR code</p>
                                                    <p>Ism topish o'yinidan so'ng Qr code ni tushuntirib bering
                                                        Vazifa hamma o'quvchilar o'zlarining QR code larini yaratishadi
                                                        O'qituvchi esa o'quvchilar qilgan Qr code doskada (proektorda) ko'rsatib skaner qiladi va o'quvchilar Qr code egasini topishi kerak bo'ladi
                                                        Tog'ri topgan o'quvchilarga coinlar bilan rag'batlantiriladi <a href="">Sayt linki</a></p>
                                                    <p>15:20 - 15:30</p>
                                                </div>
                                                <div>
                                                    <div>
                                                        <p>Coin sistemasi va Mars shop</p>
                                                        <p>Hamma o'quvchilar coin olib bo'lganidan song O'qituvchi Coin nimaligini va nimaga sarflashi mumkinligi va qanday coin ishlab topishni tushuntiradi</p>
                                                        <p>MARS SHOPDAN SOVG'A OLISH IMKONIYATI YETADIGAN DARAJADA COIN BERISHINGIZ KERAK kamida 25 coin berilishi kerak</p>
                                                    </div>
                                                    <p>15:55 - 16:00</p>
                                                </div>
                                                <div>
                                                    <div>
                                                        <p>Video</p>
                                                        <p>O'qituvchi Mars It School haqida qisqacha videoni o'quvchilarga ko'rsatadi</p>
                                                        <iframe width="400" height="300" src="https://www.youtube.com/embed/s07w3HXUvFM" title="Mars IT" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen></iframe>
                                                        <p>Video tugagandan so'ng keyingi dars marsda o'qib daromad qilayotgan o'quvchilar bilan tanishamiz deyishingiz kerak</p>
                                                    </div>
                                                    <p>16:00 - 16:10</p>
                                                </div>
                                            </div>
                                        </ul>
                                    </details>
                                </li>
                            </ul>
                        </div>
                    </div>
                    {/* Table for students */}
                    <table className="min-w-full mt-4 bg-white border-collapse">
                        <thead className="bg-gray-200 text-left">
                            <tr>
                                <th className="py-3 px-4 text-gray-600">O'quvchi ismi</th>
                                <th className="py-3 px-4 text-gray-600">O'quvchi familiyasi</th>
                                <th className="py-3 px-4 text-gray-600">Shaxsiy ID</th>
                                <th className="py-3 px-4 text-gray-600">Coin</th>
                            </tr>
                        </thead>
                        <tbody>
                            {students.map((student) => (
                                <tr key={student.id} className="hover:bg-gray-100 transition duration-300">
                                    <td className="py-3 px-4 border-b">{student.name}</td>
                                    <td className="py-3 px-4 border-b">{student.surname}</td>
                                    <td className="py-3 px-4 border-b">{student.id}</td>
                                    <td className="py-3 px-4 border-b">{student.coin}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default ProjectsPage;
