import React, { useState, useEffect } from 'react';
import NavBar from '../NavBar';
import axios from 'axios';

function TaskStatus() {
    const [projects, setProjects] = useState([]);
    const [selectedProjectId, setSelectedProjectId] = useState('');
    const [tasks, setTasks] = useState([]);
    const [filteredTasks, setFilteredTasks] = useState([]);
    const [error, setError] = useState('');
    const [filterType, setFilterType] = useState('');
    const [filterParams, setFilterParams] = useState({});
    const [completedTaskCount, setCompletedTaskCount] = useState(0);

    // Fetch all projects
    const fetchProjects = async () => {
        try {
            const response = await axios.get('http://localhost:8000/api/admindash/all-projects', {
                withCredentials: true,
            });
            setProjects(response.data);
            setTasks(response.data.flatMap(project => project.tasks || [])); // Display all tasks initially
        } catch (error) {
            setError(error.response?.data?.message || 'Error fetching projects');
        }
    };

    const fetchTasksByProjectId = async (projectId) => {
        try {
            const project = projects.find((proj) => proj._id === projectId);
            const projectTasks = project?.tasks || [];
            setTasks(projectTasks);
            setFilteredTasks(projectTasks);
            setError('');
        } catch (error) {
            setError('Error fetching tasks for the selected project');
        }
    };

    const handleProjectChange = (event) => {
        const projectId = event.target.value;
        setSelectedProjectId(projectId);
        if (projectId) {
            fetchTasksByProjectId(projectId);
        } else {
            setTasks(projects.flatMap(project => project.tasks || []));
            setFilteredTasks(projects.flatMap(project => project.tasks || []));
        }
        setFilterType('');
        setFilterParams({});
    };

    const handleFilterChange = (event) => {
        setFilterType(event.target.value);
        setFilterParams({});
    };

    const applyFilters = () => {
        if (!filterType) {
            setFilteredTasks(tasks);
            return;
        }

        const today = new Date();
        let filtered = [];

        switch (filterType) {
            case 'day': {
                const { selectedDate } = filterParams;
                if (selectedDate) {
                    filtered = tasks.filter(task =>
                        new Date(task.updated_at).toDateString() === new Date(selectedDate).toDateString()
                    );
                }
                break;
            }
            case 'week': {
                const { fromDate, toDate } = filterParams;
                filtered = tasks.filter(task => {
                    const taskDate = new Date(task.updated_at);
                    return taskDate >= new Date(fromDate) && taskDate <= new Date(toDate);
                });
                break;
            }
            case 'month': {
                const { month, year } = filterParams;
                filtered = tasks.filter(task => {
                    const taskDate = new Date(task.updated_at);
                    return taskDate.getMonth() + 1 === parseInt(month) && taskDate.getFullYear() === parseInt(year);
                });
                break;
            }
            case 'year': {
                const { year } = filterParams;
                filtered = tasks.filter(task => new Date(task.updated_at).getFullYear() === parseInt(year));
                break;
            }
            default:
                filtered = tasks;
        }

        setFilteredTasks(filtered);
        setCompletedTaskCount(filtered.filter(task => task.status === 'Completed').length); // Count completed tasks
    };

    useEffect(() => {
        fetchProjects();
    }, []);

    useEffect(() => {
        applyFilters();
    }, [filterParams]);

    return (
        <div className="container-fluid" style={{ display: 'flex', margin: '0', padding: '0', height: '100vh' }}>
            <NavBar />
            <div className="content" style={{ marginLeft: '30px', width: 'calc(100% - 250px)', overflowY: 'auto' }}>
                <div className="container mt-3">
                <h2>Task Status</h2>
                    <div className="d-flex justify-content-between align-items-center mb-3">
                        
                        <select
                            className="form-select"
                            value={selectedProjectId}
                            onChange={handleProjectChange}
                        >
                            <option value="">Select a Project</option>
                            {projects.map((project) => (
                                <option key={project._id} value={project._id}>
                                    {project.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    {selectedProjectId && (
                        <div className="mb-3">
                            <select
                                className="form-select"
                                value={filterType}
                                onChange={handleFilterChange}
                            >
                                <option value="">Filter Tasks</option>
                                <option value="day">View Tasks by Day</option>
                                <option value="week">View Tasks by Week</option>
                                <option value="month">View Tasks by Month</option>
                                <option value="year">View Tasks by Year</option>
                            </select>
                            {filterType === 'day' && (
                                <div className="mt-2">
                                    <input
                                        type="date"
                                        className="form-control"
                                        onChange={(e) =>
                                            setFilterParams({ selectedDate: e.target.value })
                                        }
                                    />
                                </div>
                            )}
                            {filterType === 'week' && (
                                <div className="d-flex mt-2">
                                    <input
                                        type="date"
                                        className="form-control me-2"
                                        onChange={(e) =>
                                            setFilterParams((prev) => ({ ...prev, fromDate: e.target.value }))
                                        }
                                    />
                                    <input
                                        type="date"
                                        className="form-control"
                                        onChange={(e) =>
                                            setFilterParams((prev) => ({ ...prev, toDate: e.target.value }))
                                        }
                                    />
                                </div>
                            )}

                            {filterType === 'month' && (
                                <div className="d-flex mt-2">
                                    <select
                                        className="form-select me-2"
                                        onChange={(e) =>
                                            setFilterParams((prev) => ({ ...prev, month: e.target.value }))
                                        }
                                    >
                                        <option value="">Select Month</option>
                                        {Array.from({ length: 12 }, (_, i) => (
                                            <option key={i + 1} value={i + 1}>{`Month ${i + 1}`}</option>
                                        ))}
                                    </select>
                                    <input
                                        type="number"
                                        className="form-control"
                                        placeholder="Year"
                                        onChange={(e) =>
                                            setFilterParams((prev) => ({ ...prev, year: e.target.value }))
                                        }
                                    />
                                </div>
                            )}

                            {filterType === 'year' && (
                                <div className="mt-2">
                                    <input
                                        type="number"
                                        className="form-control"
                                        placeholder="Year"
                                        onChange={(e) =>
                                            setFilterParams({ year: e.target.value })
                                        }
                                    />
                                </div>
                            )}
                        </div>
                    )}

                    {error && <div className="alert alert-danger">{error}</div>}

                    <div className="mb-3">
                        <h5>Completed Tasks: {completedTaskCount}</h5>
                    </div>


                    <div className="table-responsive" style={{ maxHeight: '80vh', overflowY: 'auto' }}>
                        <table className="table table-bordered table-striped">
                            <thead className="table-dark">
                                <tr>
                                    <th scope="col">S.No</th>
                                    <th scope="col">Task Name</th>
                                    <th scope="col">Description</th>
                                    <th scope="col">Planned Hours</th>
                                    <th scope="col">Actual Hours</th>
                                    <th scope="col">Date</th>
                                    <th scope="col">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredTasks.length > 0 ? (
                                    filteredTasks.map((task, index) => (
                                        <tr key={task._id}>
                                            <td>{index + 1}</td>
                                            <td>{task.name}</td>
                                            <td>{task.description}</td>
                                            <td>{task.planned_hours}</td>
                                            <td>{task.actual_hours}</td>
                                            <td>{task.updated_at.substring(0, 10)}</td>
                                            <td>{task.status}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="7" className="text-center">
                                            No tasks found for the selected criteria.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default TaskStatus;