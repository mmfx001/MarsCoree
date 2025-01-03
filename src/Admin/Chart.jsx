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
  const [year, setYear] = useState(2024); // Default year is 2024

  const handleYearChange = (event) => {
    setYear(parseInt(event.target.value)); // Update year when changed
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("https://shoopjson-2.onrender.com/api/tolov");
        const data = response.data;

        // Filter data based on the selected year
        const filteredData = data.filter((item) =>
          item.date.includes(year.toString())
        );

        // Calculate total payments for each month
        const monthlyTotals = Array(12).fill(0); // Array for 12 months
        filteredData.forEach((item) => {
          const month = parseInt(item.date.split("-")[1], 10) - 1;
          monthlyTotals[month] += parseFloat(item.price);
        });

        // Calculate the total payments for the year
        const totalPayments = monthlyTotals.reduce((acc, value) => acc + value, 0);

        // Calculate percentages for each month
        const monthlyPercentages = monthlyTotals.map(
          (value) => ((value / totalPayments) * 100).toFixed(2)
        );

        // Set data for the chart
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
              label: `Oylik to'lov foizi (${year})`,
              data: monthlyPercentages,
              backgroundColor: "rgba(54, 162, 235, 0.6)",
              borderColor: "rgba(54, 162, 250, 1)",
              borderWidth: 2,
              hoverBackgroundColor: "rgba(54, 162, 250, 1)",
              hoverBorderWidth: 2,
              hoverBorderColor: "rgba(54, 162, 250, 2)",
            },
          ],
        });
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [year]); // Re-fetch data when the year changes

  return (
    <div className="w-full mx-auto p-6 bg-white shadow-2xl rounded-lg border-t-8 border-blue-500">
      <div className="mb-4">
        <label htmlFor="year" className="text-lg font-bold text-blue-500">
          Yilni tanlang:
        </label>
        <select
          id="year"
          value={year}
          onChange={handleYearChange}
          className="ml-4 p-2 border rounded-md"
        >
          <option value={2021}>2021</option>
          <option value={2022}>2022</option>
          <option value={2023}>2023</option>
          <option value={2024}>2024</option>
          <option value={2025}>2025</option>
        </select>
      </div>

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
                    color: "#1D4ED8",
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
                    color: "#1D4ED8",
                    font: {
                      size: 13,
                      weight: "bold",
                    },
                  },
                },
                y: {
                  grid: {
                    color: "rgba(255, 159, 64, 0.2)",
                  },
                  ticks: {
                    color: "#1D4ED8",
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
