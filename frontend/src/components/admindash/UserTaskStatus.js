import React, { useState, useEffect } from 'react';
import NavBar from '../NavBar';
import axios from 'axios';

function UserTaskStatus() {
    const [users, setUsers] = useState([]);
    const [selectedUserId, setSelectedUserId] = useState('');
    const [tasks, setTasks] = useState([]);
    const [filteredTasks, setFilteredTasks] = useState([]);
    const [error, setError] = useState('');
    const [filterType, setFilterType] = useState('');
    const [filterParams, setFilterParams] = useState({});
    const [completedTaskCount, setCompletedTaskCount] = useState(0);

    // Fetch all users
    const fetchUsers = async () => {
        try {
            const response = await axios.get('http://localhost:8000/api/users', {
                withCredentials: true,
            });
            setUsers(response.data);
        } catch (error) {
            setError(error.response?.data?.message || 'Error fetching users');
        }
    };

    // Fetch tasks for a specific user
    const fetchTasksByUserId = async (userId) => {
        try {
            const response = await axios.get('http://localhost:8000/api/admindash/user-tasks', {
                withCredentials: true,
                params: { user: userId }
            });
            
            const userTasks = response.data;
            
            setTasks(userTasks);
            setFilteredTasks(userTasks);
            setCompletedTaskCount(userTasks.filter(task => task.status === 'Completed').length);
            setError('');
        } catch (error) {
            setError('Error fetching tasks for the selected user');
            setTasks([]);
            setFilteredTasks([]);
        }
    };

    const handleUserChange = (event) => {
        const userId = event.target.value;
        setSelectedUserId(userId);
        
        if (userId) {
            fetchTasksByUserId(userId);
        } else {
            setTasks([]);
            setFilteredTasks([]);
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
            setCompletedTaskCount(tasks.filter(task => task.status === 'Completed').length);
            return;
        }

        let filtered = [...tasks];

        switch (filterType) {
            case 'day': {
                const { selectedDate } = filterParams;
                if (selectedDate) {
                    filtered = filtered.filter(task =>
                        new Date(task.updated_at).toDateString() === new Date(selectedDate).toDateString()
                    );
                }
                break;
            }
            case 'week': {
                const { fromDate, toDate } = filterParams;
                if (fromDate && toDate) {
                    filtered = filtered.filter(task => {
                        const taskDate = new Date(task.updated_at);
                        return taskDate >= new Date(fromDate) && taskDate <= new Date(toDate);
                    });
                }
                break;
            }
            case 'month': {
                const { month, year } = filterParams;
                if (month && year) {
                    filtered = filtered.filter(task => {
                        const taskDate = new Date(task.updated_at);
                        return taskDate.getMonth() + 1 === parseInt(month) && 
                               taskDate.getFullYear() === parseInt(year);
                    });
                }
                break;
            }
            case 'year': {
                const { year } = filterParams;
                if (year) {
                    filtered = filtered.filter(task => 
                        new Date(task.updated_at).getFullYear() === parseInt(year)
                    );
                }
                break;
            }
        }

        setFilteredTasks(filtered);
        setCompletedTaskCount(filtered.filter(task => task.status === 'Completed').length);
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    useEffect(() => {
        if (filterParams && Object.keys(filterParams).length > 0) {
            applyFilters();
        }
    }, [filterParams]);

    return (
        <div className="container-fluid" style={{ display: 'flex', margin: '0', padding: '0', height: '100vh' }}>
            <NavBar />
            <div className="content" style={{ marginLeft: '30px', width: 'calc(100% - 250px)', overflowY: 'auto' }}>
                <div className="container mt-3">
                    <h2>User Task Status</h2>
                    <div className="d-flex justify-content-between align-items-center mb-3">
                        <select
                            className="form-select"
                            value={selectedUserId}
                            onChange={handleUserChange}
                        >
                            <option value="">Select a User</option>
                            {users.map((user) => (
                                <option key={user._id} value={user._id}>
                                    {user.username}
                                </option>
                            ))}
                        </select>
                    </div>

                    {selectedUserId && (
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
                                    <th scope="col">User</th>
                                    <th scope="col">Project</th>
                                    <th scope="col">Planned Hours</th>
                                    <th scope="col">Actual Hours</th>
                                    <th scope="col">Status</th>
                                    <th scope="col">Updated At</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredTasks.length > 0 ? (
                                    filteredTasks.map((task, index) => (
                                        <tr key={task._id}>
                                            <td>{index + 1}</td>
                                            <td>{task.name}</td>
                                            <td>{task.description}</td>
                                            <td>{task.user?.name}</td>
                                            <td>{task.project?.name} ({task.project?.business_unit?.name})</td>
                                            <td>{task.planned_hours}</td>
                                            <td>{task.actual_hours}</td>
                                            <td>{task.status}</td>
                                            <td>{new Date(task.updated_at).toLocaleDateString()}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="9" className="text-center">
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

export default UserTaskStatus;