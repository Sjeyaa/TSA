import React, { useState, useEffect } from 'react';
import './AdminDashboard.css';
import NavBar from './NavBar';
import { useNavigate } from 'react-router-dom';
import { Bar } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import axios from 'axios';

// Register required components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function AdminDashboard() {
    //State Management
    const navigate = useNavigate();
    const [projects, setProjects] = useState([]);
    const [tasks, setTasks] = useState([]);
    const [loadingProjects, setLoadingProjects] = useState(true);
    const [loadingTasks, setLoadingTasks] = useState(true);
    const [taskCompletionData, setTaskCompletionData] = useState([]);

    const [totalTasks, setTotalTasks] = useState(0);
    const [completedTasks, setCompletedTasks] = useState(0);
    const [totalProjects, setTotalProjects] = useState(0);
    const [completedProjects, setCompletedProjects] = useState(0);

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const response = await axios.get('http://localhost:8000/api/admindash/projects', {
                    withCredentials: true,
                });
                setProjects(response.data);
                setLoadingProjects(false);
                calculateProjectData(response.data);
            } catch (error) {
                console.error('Error fetching projects:', error);
                setLoadingProjects(false);
            }
        };

        const fetchTasks = async () => {
            try {
                const response = await axios.get('http://localhost:8000/api/admindash/tasks', {
                    withCredentials: true,
                });
                setTasks(response.data);
                setLoadingTasks(false);
                calculateUserTaskCompletion(response.data);
                calculateTaskData(response.data);
            } catch (error) {
                setLoadingTasks(false);
            }
        };

        fetchProjects();
        fetchTasks();
    }, []);

    const calculateProjectData = (projects) => {
        const total = projects.length;
        const completed = projects.filter((project) => project.status === 'Completed').length;
        setTotalProjects(total);
        setCompletedProjects(completed);
    };

    const calculateTaskData = (tasks) => {
        const total = tasks.length;
        const completed = tasks.filter((task) => task.status === 'Completed').length;
        setTotalTasks(total);
        setCompletedTasks(completed);
    };

    const calculateUserTaskCompletion = (tasks) => {
        // To store task counts
        const userTaskCount = {};

        tasks.forEach((task) => {
            if (task.status === 'Completed') {
                const username = task.user.username; 
                userTaskCount[username] = (userTaskCount[username] || 0) + 1;
            }
        });

        //Data for bar chart
        const users = Object.keys(userTaskCount);
        const completedTasks = users.map((user) => userTaskCount[user]);

        setTaskCompletionData({ users, completedTasks });
    };

   //chart function
    const generateProjectChartData = () => {
        const labels = projects.map((project) => project.projectName);
        const plannedHours = projects.map((project) => project.plannedHours);
        const actualHours = projects.map((project) => project.actualHours);

        return {
            labels,
            datasets: [
                {
                    label: 'Planned Hours',
                    data: plannedHours,
                    backgroundColor: 'rgba(75, 192, 192, 0.6)',
                },
                {
                    label: 'Actual Hours',
                    data: actualHours,
                    backgroundColor: 'rgba(255, 99, 132, 0.6)',
                },
            ],
        };
    };

    //data for tasks
    const generateTaskChartData = () => {
        const statusCounts = {
            Pending: 0,
            'In Progress': 0,
            Completed: 0,
        };

        tasks.forEach((task) => {
            statusCounts[task.status] += 1;
        });

        return {
            labels: ['Pending', 'In Progress', 'Completed'],
            datasets: [
                {
                    label: 'Task Status',
                    data: [statusCounts.Pending, statusCounts['In Progress'], statusCounts.Completed],
                    backgroundColor: ['rgba(255, 206, 86, 0.6)', 'rgba(54, 162, 235, 0.6)', 'rgba(75, 192, 192, 0.6)'],
                },
            ],
        };
    };

    // chart for task completion
    const generateUserTaskCompletionChartData = () => {
        return {
            labels: taskCompletionData.users,
            datasets: [
                {
                    label: 'Completed Tasks',
                    data: taskCompletionData.completedTasks,
                    backgroundColor: 'rgba(153, 102, 255, 0.6)',
                },
            ],
        };
    };

    return (
        <>
            <div style={{ display: 'flex', height: '100vh', margin: '0' }}>
                <NavBar />

                <div className="main-content" style={{ flexGrow: '1', padding: '20px' }}>
                    <div className="container-fluid">
                       
                    <div className="row d-flex justify-content-around align-items-stretch">
    <div className="col-md-3">
        <div className="card text-center h-100" style={{ borderRadius: '15px' }}>
            <div className="card-body" style={{ backgroundColor: 'red', borderRadius: '5px', minHeight: '100px' }}>
                <h5 onClick={() => navigate('/project-hours')} className="card-title">
                    Planned Hours vs Actual Hours
                </h5>
                <p onClick={() => navigate('/project-hours')} className="card-text">
                    Click to view
                </p>
            </div>
        </div>
    </div>
    <div className="col-md-3">
        <div className="card text-center h-100" style={{ borderRadius: '15px' }}>
            <div className="card-body" style={{ backgroundColor: 'green', borderRadius: '5px', minHeight: '100px' }}>
                <h5 onClick={() => navigate('/task-status')} className="card-title">
                    Task Status of All Projects
                </h5>
                <p onClick={() => navigate('/task-status')} className="card-text">
                    Click to view
                </p>
            </div>
        </div>
    </div>
    <div className="col-md-3">
        <div className="card text-center h-100" style={{ borderRadius: '15px' }}>
            <div className="card-body" style={{ backgroundColor: 'yellow', borderRadius: '5px', minHeight: '100px' }}>
                <h5 onClick={() => navigate('/project-status')} className="card-title">
                    Project Status of Business Unit
                </h5>
                <p onClick={() => navigate('/project-status')} className="card-text">
                    Click to view
                </p>
            </div>
        </div>
    </div>
    <div className="col-md-3">
        <div className="card text-center h-100" style={{ borderRadius: '15px' }}>
            <div className="card-body" style={{ backgroundColor: 'orange', borderRadius: '5px', minHeight: '100px' }}>
                <h5 onClick={() => navigate('/employee-task')} className="card-title">
                    Employee Performance
                </h5>
                <p onClick={() => navigate('/employee-task')} className="card-text">
                    Click to view
                </p>
            </div>
        </div>
    </div>
</div>


        
                        <div className="row mt-5">
                            <div className="col-md-6">
                                <div className="card text-center">
                                    <div className="card-body">
                                        <h5 className="card-title">Task Summary</h5>
                                        <p>Total Tasks: {totalTasks}</p>
                                        <p>Completed Tasks: {completedTasks}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="col-md-6">
                                <div className="card text-center">
                                    <div className="card-body">
                                        <h5 className="card-title">Project Summary</h5>
                                        <p>Total Projects: {totalProjects}</p>
                                        <p>Completed Projects: {completedProjects}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="row mt-5">
                            
                            <div className="col-md-6 col-lg-4">
                                <div className="card">
                                    <div className="card-body">
                                        <h5 className="card-title text-center">Project Analysis Graph</h5>
                                        {loadingProjects ? (
                                            <p className="text-center">Loading graph...</p>
                                        ) : projects.length === 0 ? (
                                            <p className="text-center">No projects available for analysis.</p>
                                        ) : (
                                            <div style={{ width: '100%', height: '300px' }}>
                                                <Bar
                                                    data={generateProjectChartData()}
                                                    options={{
                                                        responsive: true,
                                                        plugins: {
                                                            title: {
                                                                display: true,
                                                                text: 'Planned vs Actual Hours',
                                                            },
                                                        },
                                                    }}
                                                />
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            
                            <div className="col-md-6 col-lg-4">
                                <div className="card">
                                    <div className="card-body">
                                        <h5 className="card-title text-center">Task Status Graph</h5>
                                        {loadingTasks ? (
                                            <p className="text-center">Loading graph...</p>
                                        ) : tasks.length === 0 ? (
                                            <p className="text-center">No tasks available for analysis.</p>
                                        ) : (
                                            <div style={{ width: '100%', height: '300px' }}>
                                                <Bar
                                                    data={generateTaskChartData()}
                                                    options={{
                                                        responsive: true,
                                                        plugins: {
                                                            title: {
                                                                display: true,
                                                                text: 'Task Status Distribution',
                                                            },
                                                        },
                                                    }}
                                                />
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                           
                            <div className="col-md-6 col-lg-4">
                                <div className="card">
                                    <div className="card-body">
                                        <h5 className="card-title text-center">User Task Completion</h5>
                                        {taskCompletionData.users?.length === 0 ? (
                                            <p className="text-center">No task completion data available.</p>
                                        ) : (
                                            <div style={{ width: '100%', height: '300px' }}>
                                                <Bar
                                                    data={generateUserTaskCompletionChartData()}
                                                    options={{
                                                        responsive: true,
                                                        plugins: {
                                                            title: {
                                                                display: true,
                                                                text: 'Task Completion by User',
                                                            },
                                                        },
                                                    }}
                                                />
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default AdminDashboard;
