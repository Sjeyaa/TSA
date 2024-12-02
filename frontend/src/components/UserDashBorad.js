import { useEffect, useState } from "react";
import UserNavBar from "./UserNavBar";
import axios from 'axios';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';


ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function UserDashBoard() {
    const [user, setUser] = useState({});
    const [projects, setProjects] = useState([]);
    const [tasks, setTasks] = useState([]);

    // Fetch user details
    const fetchUser = async () => {
        try {
            const response = await axios.get('http://localhost:8000/api/user', {
                withCredentials: true,
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });
            setUser(response.data);
        } catch (error) {
            alert("Error fetching user details");
        }
    };

    // Fetch user projects data
    const fetchUserProjects = async () => {
        try {
            const response = await axios.get('http://localhost:8000/api/user/user-projects', {
                withCredentials: true,
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });
            setProjects(response.data.projects);
            const allTasks = response.data.projects.flatMap(project => project.tasks);
            setTasks(allTasks);
        } catch (error) {
            alert("Error fetching projects data");
        }
    };

    // Fetch user tasks
    const fetchUserTasks = async () => {
        try {
            const response = await axios.get('http://localhost:8000/api/user/user-tasks', {
                withCredentials: true,
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });
            setTasks(response.data); 
        } catch (error) {
            alert("Error fetching tasks data");
        }
    };

    useEffect(() => {
        fetchUser();
        fetchUserProjects();
        fetchUserTasks();
    }, []);

    // Calculate counts
    const totalProjects = projects.length;
    const completedProjects = projects.filter(project => project.status === 'Completed').length;
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(task => task.status === 'Completed').length;

    // ddata for chart
    const chartData = {
        labels: tasks.map(task => task.name),  
        datasets: [
            {
                label: 'Planned Hours',
                data: tasks.map(task => task.planned_hours),  
                backgroundColor: 'rgba(75, 192, 192, 0.5)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1,
            },
            {
                label: 'Actual Hours',
                data: tasks.map(task => task.actual_hours),  
                backgroundColor: 'rgba(153, 102, 255, 0.5)',
                borderColor: 'rgba(153, 102, 255, 1)',
                borderWidth: 1,
            }
        ]
    };

    
    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        height: 300,
        scales: {
            y: {
                beginAtZero: true
            }
        }
    };

    return (
        <>
            <div style={{ display: 'flex', height: '100vh', margin: '0' }}>
                <UserNavBar />
                <div className="main-content" style={{ flexGrow: '1', padding: '20px' }}>
                    <div className="container-fluid">
                        <h5 style={{ textAlign: "center" }}>Welcome {user.username}</h5>
                        <div className="row">
                            <div className="col-md-3">
                                <div className="card text-center">
                                    <div className="card-body"  style={{ backgroundColor: 'red', borderRadius: '5px', minHeight: '100px' }}>
                                        <h5 className="card-title">Total Projects</h5>
                                        <p className="card-text">{totalProjects}</p>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="col-md-3">
                                <div className="card text-center">
                                    <div className="card-body"  style={{ backgroundColor: 'green', borderRadius: '5px', minHeight: '100px' }}>
                                        <h5 className="card-title">Completed Projects</h5>
                                        <p className="card-text">{completedProjects}</p>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="col-md-3">
                                <div className="card text-center">
                                    <div className="card-body"  style={{ backgroundColor: 'yellow', borderRadius: '5px', minHeight: '100px' }}>
                                        <h5 className="card-title">Total Tasks</h5>
                                        <p className="card-text">{totalTasks}</p>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="col-md-3">
                                <div className="card text-center">
                                    <div className="card-body"  style={{ backgroundColor: 'orange', borderRadius: '5px', minHeight: '100px' }}>
                                        <h5 className="card-title">Completed Tasks</h5>
                                        <p className="card-text">{completedTasks}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        
                        <div style={{ marginTop: '30px', height: '300px' }}>
                            <h5 style={{ textAlign: 'center' }}>Task Hours Comparison</h5>
                            <Bar 
                                data={chartData} 
                                options={chartOptions}
                                style={{ 
                                    maxWidth: '3000px', 
                                    margin: '0 auto' 
                                }} 
                            />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default UserDashBoard;