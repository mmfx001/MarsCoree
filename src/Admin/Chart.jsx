import React, { useEffect, useState } from "react";
import axios from "axios";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const MonthlyPaymentsChart = () => {
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [],
  });
  const [isLoading, setIsLoading] = useState(true);
  const year = 2024; // Yilni belgilash

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("https://shoopjson-2.onrender.com/api/tolov");
        const data = response.data;

        // Faqat berilgan yilga tegishli to'lovlarni filtrlaymiz
        const filteredData = data.filter((item) =>
          item.date.includes(year.toString())
        );

        // Har bir oy bo'yicha jami to'lovlarni hisoblash
        const monthlyTotals = Array(12).fill(0); // 12 oylik massiv
        filteredData.forEach((item) => {
          const month = parseInt(item.date.split("-")[1], 10) - 1; // Oy indeksini olish
          monthlyTotals[month] += parseFloat(item.price);
        });

        // Yil bo'yicha jami to'lovlarni hisoblash
        const totalPayments = monthlyTotals.reduce((acc, value) => acc + value, 0);

        // Har bir oy bo'yicha foizlarni hisoblash
        const monthlyPercentages = monthlyTotals.map(
          (value) => ((value / totalPayments) * 100).toFixed(2)
        );

        // Chart.js uchun ma'lumotlarni tayyorlash
        setChartData({
          labels: [
            "Yanvar",
            "Fevral",
            "Mart",
            "Aprel",
            "May",
            "Iyun",
            "Iyul",
            "Avgust",
            "Sentabr",
            "Oktabr",
            "Noyabr",
            "Dekabr",
          ],
          datasets: [
            {
              label: "Oylik to'lov foizi",
              data: monthlyPercentages,
              backgroundColor: "rgba(54, 162, 235, 0.6)",
              borderColor: "rgba(54, 162, 250, 1)",
              borderWidth: 2,
              hoverBackgroundColor: "rgba(255, 159, 64, 0.8)",
              hoverBorderWidth: 2,
              hoverBorderColor: "rgba(255, 159, 64, 1)",
            },
          ],
        });
        setIsLoading(false);
      } catch (error) {
        console.error("Ma'lumotni olishda xatolik yuz berdi:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="w-full mx-auto p-6 bg-white shadow-2xl rounded-lg border-t-8 border-blue-500">
      {isLoading ? (
        <div className="text-center text-lg text-gray-500 animate-pulse">
          <div className="w-full h-[400px] bg-gray-300 rounded-lg animate-pulse"></div>
        </div>
      ) : (
        <div className="relative w-full mx-auto">
          <Bar
            data={chartData}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: {
                  position: "top",
                  labels: {
                    font: {
                      size: 14,
                      weight: "bold",
                    },
                    color: "#1D4ED8", // Ko'k rang
                  },
                },
                tooltip: {
                  backgroundColor: "rgba(0, 0, 0, 0.7)",
                  titleColor: "#fff",
                  bodyColor: "#fff",
                  borderColor: "#fff",
                  borderWidth: 1,
                  displayColors: false,
                },
              },
              scales: {
                x: {
                  grid: {
                    display: false,
                  },
                  ticks: {
                    color: "#1D4ED8", // Ko'k rang
                    font: {
                      size: 13,
                      weight: "bold",
                    },
                  },
                },
                y: {
                  grid: {
                    color: "rgba(255, 159, 64, 0.2)", // Sariq-yashil grid
                  },
                  ticks: {
                    color: "#1D4ED8", // Ko'k rang
                    font: {
                      size: 13,
                      weight: "bold",
                    },
                  },
                },
              },
            }}
            height={400}
          />
        </div>
      )}
    </div>
  );
};

export default MonthlyPaymentsChart;
