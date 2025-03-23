import axios from "axios";
import { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Filler, Legend } from "chart.js";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Filler, Legend);

const options = {
    responsive: true,
    scales: {
        x: {
            title: {
                display: true,
                text: "Date",
            },
        },
        y: {
            beginAtZero: true,
            title: {
                display: true,
                text: "Views",
            },
        },
    },
};

const Graph = ({ videoId }) => {
    const [chartData, setChartData] = useState({ labels: [], datasets: [] });
    const [period, setPeriod] = useState("thisWeek");
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (videoId) {
            fetchData();
        } else {
            setIsLoading(false);
        }
    }, [videoId, period]);

    const fetchData = async () => {
        if (!videoId) return;

        setIsLoading(true);
        setError(null);
        try {
            const response = await axios.get(`/Dashboard/VideoViews/${videoId}`, {
                params: { period },
            });

            const { labels, data } = response.data;

            setChartData({
                labels,
                datasets: [
                    {
                        fill: true,
                        label: "Views",
                        data,
                        borderColor: "rgb(53, 162, 235)",
                        backgroundColor: "rgba(53, 162, 235, 0.5)",
                    },
                ],
            });
        } catch (error) {
            console.error("Error fetching data:", error);
            setError("Failed to load data. Please try again later.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleSelectChange = (event) => {
        setPeriod(event.target.value);
    };

    if (!videoId) return <div>Waiting for video information...</div>;
    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div className="border rounded-2xl p-6">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-black">Video Views</h3>
                <select onChange={handleSelectChange} value={period} className="text-[#0A2A8D] bg-[#F6F6F6] py-3 px-4 rounded-lg border outline-none font-bold text-[14px]">
                    <option value="thisWeek">This week</option>
                    <option value="lastWeek">Last week</option>
                    <option value="thisMonth">This Month</option>
                    <option value="lastMonth">Last Month</option>
                    <option value="last3Months">Last 3 Months</option>
                    <option value="last6Months">Last 6 Months</option>
                </select>
            </div>
            {chartData.labels.length > 0 ? <Line options={options} data={chartData} /> : <div>No data available for the selected period.</div>}
        </div>
    );
};

export default Graph;
