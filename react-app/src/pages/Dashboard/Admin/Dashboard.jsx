import { useEffect, useState } from 'react';
import axios from 'axios';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Filler,
    Legend,
    ArcElement
} from 'chart.js';
import { Line, Doughnut } from 'react-chartjs-2';
import {
    FaVideo,
    FaUsers,
    FaComments,
    FaEye,
    FaArrowUp,
    FaArrowDown,
    FaUserCircle,
    FaExternalLinkSquareAlt
} from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { imageUrl } from '../../../helper';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Filler,
    Legend,
    ArcElement
);

const Dashboard = () => {
    const [stats, setStats] = useState({
        users: { total: 0, change: 0 },
        views: { total: 0, change: 0 },
        comments: { total: 0, change: 0 },
        videos: { total: 0, new: 0 },
        monthlyEngagement: [],
        categories: [],
        interactionRates: {},
        recentActivity: []
    });

    const fetchStats = async () => {
        try {
            const response = await axios.get("Dashboard/Admin/getStats");
            setStats(response.data);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchStats();
    }, []);

    const StatCard = ({ title, value, change, icon: Icon }) => (
        <div className="bg-white rounded-xl p-6 shadow hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start">
                <div>
                    <p className="text-gray-600 text-sm mb-1">{title}</p>
                    <h3 className="text-2xl font-bold text-gray-900">
                        {value?.toLocaleString()}
                    </h3>
                    {change !== undefined ? (
                        <div className={`flex items-center mt-2 ${change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                            {change >= 0 ? <FaArrowUp className="mr-1" /> : <FaArrowDown className="mr-1" />}
                            <span className="text-sm">{Math.abs(change)}% vs last month</span>
                        </div>
                    ) : (
                        <Link to={'/Admin/Videos'} className='flex items-center gap-2 mt-2 text-sm text-primary font-medium'>
                            Manage Videos
                            <FaExternalLinkSquareAlt className='text-base' />
                        </Link>
                    )}
                </div>
                <div className="p-3 bg-red-50 rounded-lg">
                    <Icon size={24} className="text-red-500" />
                </div>
            </div>
        </div>
    );

    const engagementChartData = {
        labels: stats.monthlyEngagement?.map(item => item.month) || [],
        datasets: [
            {
                label: 'Views',
                data: stats.monthlyEngagement?.map(item => item.views) || [],
                borderColor: 'rgb(53, 162, 235)',
                backgroundColor: 'rgba(53, 162, 235, 0.5)',
                fill: true,
                tension: 0.4
            },
            {
                label: 'Likes',
                data: stats.monthlyEngagement?.map(item => item.likes) || [],
                borderColor: 'rgb(75, 192, 192)',
                backgroundColor: 'rgba(75, 192, 192, 0.5)',
                fill: true,
                tension: 0.4
            },
            {
                label: 'Comments',
                data: stats.monthlyEngagement?.map(item => item.comments) || [],
                borderColor: 'rgb(255, 99, 132)',
                backgroundColor: 'rgba(255, 99, 132, 0.5)',
                fill: true,
                tension: 0.4
            }
        ]
    };

    const categoryChartData = {
        labels: stats.categories?.map(cat => cat.name) || [],
        datasets: [{
            data: stats.categories?.map(cat => cat.percentage) || [],
            backgroundColor: [
                'rgba(255, 99, 132, 0.8)',
                'rgba(54, 162, 235, 0.8)',
                'rgba(255, 206, 86, 0.8)',
                'rgba(75, 192, 192, 0.8)',
                'rgba(153, 102, 255, 0.8)',
            ],
            borderWidth: 1,
            borderColor: 'white'
        }]
    };

    const chartOptions = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top'
            }
        },
        scales: {
            y: {
                beginAtZero: true
            }
        }
    };

    const doughnutOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'right',
                labels: {
                    padding: 20
                }
            }
        }
    };

    return (
        <>
            <div className="flex justify-between items-center gap-10 rounded-lg mb-6 pb-6 border-b border-gray-100">
                <h1 className="text-4xl font-medium flex items-center gap-3 text-gray-600">
                    <FaUserCircle className="text-primary" />
                    Dashboard
                </h1>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <StatCard
                    title="Total Videos"
                    value={stats.videos?.total}
                    icon={FaVideo}
                />
                <StatCard
                    title="Total Users"
                    value={stats.users?.total}
                    change={stats.users?.change}
                    icon={FaUsers}
                />
                <StatCard
                    title="Comments"
                    value={stats.comments?.total}
                    change={stats.comments?.change}
                    icon={FaComments}
                />
                <StatCard
                    title="Total Views"
                    value={stats.views?.total}
                    change={stats.views?.change}
                    icon={FaEye}
                />
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                <div className="bg-white p-6 rounded-xl shadow">
                    <h3 className="text-lg font-semibold mb-4">Engagement Overview</h3>
                    <Line
                        data={engagementChartData}
                        options={chartOptions}
                    />
                </div>

                <div className="bg-white p-6 rounded-xl shadow">
                    <h3 className="text-lg font-semibold mb-4">Category Distribution</h3>
                    <div className="w-full h-[300px] flex justify-center">
                        <Doughnut
                            data={categoryChartData}
                            options={doughnutOptions}
                        />
                    </div>
                </div>
            </div>

            {/* Interaction Rates */}
            <div className="bg-white rounded-xl shadow p-6 mb-8">
                <h3 className="text-lg font-semibold mb-4">Interaction Rates</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {Object.entries(stats.interactionRates || {}).map(([key, value]) => (
                        <div key={key} className="bg-blue-50 rounded-lg p-4">
                            <h4 className="text-gray-600 capitalize">{key}</h4>
                            <div className="text-2xl font-bold text-blue-600">{value}%</div>
                            <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                                <div
                                    className="bg-blue-600 rounded-full h-2 max-w-full"
                                    style={{ width: `${value}%` }}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-xl shadow p-6">
                <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
                <div className="space-y-4">
                    {stats.recentActivity?.map((activity, index) => (
                        <div key={index} className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-lg">
                            <div className="flex items-center space-x-4">
                                {activity.user.avatar ? (
                                    <picture>
                                        <source media="(max-width: 767px)" srcSet={imageUrl(activity.user?.avatar?.mobile)} />
                                        <source media="(max-width: 1023px)" srcSet={imageUrl(activity.user?.avatar?.tablet)} />
                                        <img
                                            src={imageUrl(activity.user?.avatar?.default)}
                                            className="w-10 h-10 rounded-full"
                                            alt={activity.user?.name}
                                        />
                                    </picture>
                                ) : (
                                    <FaUserCircle size={40} className="text-gray-400" />
                                )}
                                <div>
                                    <p className="font-medium">{activity.user.name}</p>
                                    <p className="text-sm text-gray-500">
                                        Commented on {activity.video_title}
                                    </p>
                                </div>
                            </div>
                            <span className="text-sm text-gray-500">
                                {activity.created_at}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
};

export default Dashboard;