import { useEffect, useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";
import NoDataFound from "./NoDataFound";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend
);

export default function LineChart({ 
  data, 
  title = "Chart", 
  label = "Data", 
  color = "#3b82f6",
  loading = false,
  error = ""
}) {
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: []
  });

  useEffect(() => {
    if (!data || data.length === 0) {
      setChartData({
        labels: [],
        datasets: []
      });
      return;
    }

    const labels = data.map(item => item.date);
    const values = data.map(item => item.count);

    setChartData({
      labels: labels,
      datasets: [
        {
          label: label,
          data: values,
          borderColor: color,
          backgroundColor: color.replace(')', ', 0.2)').replace('rgb', 'rgba').replace('#', 'rgba('),
          pointBackgroundColor: color,
          pointBorderColor: "#fff",
          pointHoverRadius: 6,
          tension: 0.4,
          fill: true,
        },
      ],
    });
  }, [data, label, color]);

  return (
    <>
      {loading ? (
        <div className="flex flex-col w-full justify-center items-center bg-gray-300">  
          <div className="w-5/6">
            <NoDataFound message="Loading Chart..."/>
          </div>
        </div>
      ) : error ? (
        <div className="bg-red-100 text-red-700 p-2 rounded mb-3">
          {error}
          <button onClick={() => {}} className="ml-3 font-bold">✕</button>
        </div>
      ) : data && data.length > 0 ? (
        <div className="flex flex-col w-full sm:w-80 xl:w-96 h-80 justify-center items-center rounded-2xl bg-white shadow-xl p-8">
          <div className="flex w-full justify-between items-center mb-4 gap-6">
            <h2 className="text-xl font-bold">{title}</h2>
          </div>
          <Line
            data={chartData}
            options={{
              responsive: true,
              plugins: {
                legend: { display: false },
              },
              scales: {
                x: {
                  labels: chartData.labels,
                  grid: {
                    display: false,
                  },
                },
                y: {
                  beginAtZero: true,
                  grid: {
                    color: "rgba(0,0,0,0.05)",
                  },
                },
              },
            }}
          />
        </div>
      ) : (
        <div className="flex flex-col w-full justify-center items-center bg-gray-300">  
          <div className="w-5/6">
            <NoDataFound message="No Data Available"/>
          </div>
        </div>
      )}
    </>
  );
}
