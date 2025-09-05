import { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Registrar los componentes necesarios de Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const ProductivityChart = ({ userId, startDate, endDate }) => {
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProductivityData = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `http://localhost:3000/api/v1/analytics/productivity?${new URLSearchParams(
            {
              userId: userId || "",
              startDate: startDate || "",
              endDate: endDate || "",
            }
          )}`
        );

        if (!response.ok) {
          throw new Error("Error al cargar los datos de productividad");
        }

        const data = await response.json();

        // Procesar datos para el gráfico
        const labels = data.data.map((item) => item.date);
        const completedTasks = data.data.map((item) => item.completedTasks);
        const totalTime = data.data.map((item) => item.totalTimeSpent);

        setChartData({
          labels,
          datasets: [
            {
              label: "Tareas Completadas",
              data: completedTasks,
              borderColor: "rgb(75, 192, 192)",
              backgroundColor: "rgba(75, 192, 192, 0.5)",
              tension: 0.4,
            },
            {
              label: "Tiempo Total (horas)",
              data: totalTime,
              borderColor: "rgb(255, 99, 132)",
              backgroundColor: "rgba(255, 99, 132, 0.5)",
              tension: 0.4,
              yAxisID: "y1",
            },
          ],
        });

        setError(null);
      } catch (err) {
        setError(err.message);
        console.error("Error al cargar datos de productividad:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProductivityData();
  }, [userId, startDate, endDate]);

  const options = {
    responsive: true,
    interaction: {
      mode: "index",
      intersect: false,
    },
    stacked: false,
    plugins: {
      title: {
        display: true,
        text: "Métricas de Productividad",
      },
    },
    scales: {
      y: {
        type: "linear",
        display: true,
        position: "left",
        title: {
          display: true,
          text: "Tareas Completadas",
        },
      },
      y1: {
        type: "linear",
        display: true,
        position: "right",
        title: {
          display: true,
          text: "Tiempo Total (horas)",
        },
        grid: {
          drawOnChartArea: false,
        },
      },
    },
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-100 text-red-700 rounded-lg">
        Error: {error}
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <Line options={options} data={chartData} />
    </div>
  );
};

export default ProductivityChart;
