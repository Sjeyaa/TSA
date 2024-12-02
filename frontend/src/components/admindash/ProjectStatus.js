import React, { useState, useEffect } from 'react';
import NavBar from '../NavBar';
import axios from 'axios';

function ProjectStatus() {
    const [businessUnits, setBusinessUnits] = useState([]);
    const [selectedBusinessUnitId, setSelectedBusinessUnitId] = useState('');
    const [projects, setProjects] = useState([]);
    const [filteredProjects, setFilteredProjects] = useState([]);
    const [error, setError] = useState('');
    const [filterType, setFilterType] = useState('');
    const [filterParams, setFilterParams] = useState({});
    const [completedProjectCount, setCompletedProjectCount] = useState(0);

    // Fetch all business units
    const fetchBusinessUnits = async () => {
        try {
            const response = await axios.get('http://localhost:8000/api/unit', {
                withCredentials: true,
            });
            setBusinessUnits(response.data);
        } catch (error) {
            setError(error.response?.data?.message || 'Error fetching business units');
        }
    };

    // Fetch projects for a specific business unit
    const fetchProjectsByBusinessUnitId = async (businessUnitId) => {
        try {
            const response = await axios.get('http://localhost:8000/api/admindash/business-unit-project', {
                withCredentials: true,
                params: { business_unit: businessUnitId }
            });
            
            const unitProjects = response.data.filter(
                project => project.business_unit._id === businessUnitId
            );
            
            setProjects(unitProjects);
            setFilteredProjects(unitProjects);
            setCompletedProjectCount(unitProjects.filter(project => project.status === 'Completed').length);
            setError('');
        } catch (error) {
            setError('Error fetching projects for the selected business unit');
            setProjects([]);
            setFilteredProjects([]);
        }
    };

    const handleBusinessUnitChange = (event) => {
        const unitId = event.target.value;
        setSelectedBusinessUnitId(unitId);
        
        if (unitId) {
            fetchProjectsByBusinessUnitId(unitId);
        } else {
            setProjects([]);
            setFilteredProjects([]);
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
            setFilteredProjects(projects);
            setCompletedProjectCount(projects.filter(project => project.status === 'Completed').length);
            return;
        }

        let filtered = [...projects];

        switch (filterType) {
            case 'day': {
                const { selectedDate } = filterParams;
                if (selectedDate) {
                    filtered = filtered.filter(project =>
                        new Date(project.updated_at).toDateString() === new Date(selectedDate).toDateString()
                    );
                }
                break;
            }
            case 'week': {
                const { fromDate, toDate } = filterParams;
                if (fromDate && toDate) {
                    filtered = filtered.filter(project => {
                        const projectDate = new Date(project.updated_at);
                        return projectDate >= new Date(fromDate) && projectDate <= new Date(toDate);
                    });
                }
                break;
            }
            case 'month': {
                const { month, year } = filterParams;
                if (month && year) {
                    filtered = filtered.filter(project => {
                        const projectDate = new Date(project.updated_at);
                        return projectDate.getMonth() + 1 === parseInt(month) && 
                               projectDate.getFullYear() === parseInt(year);
                    });
                }
                break;
            }
            case 'year': {
                const { year } = filterParams;
                if (year) {
                    filtered = filtered.filter(project => 
                        new Date(project.updated_at).getFullYear() === parseInt(year)
                    );
                }
                break;
            }
        }

        setFilteredProjects(filtered);
        setCompletedProjectCount(filtered.filter(project => project.status === 'Completed').length);
    };

    useEffect(() => {
        fetchBusinessUnits();
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
                    <h2>Business Unit Project Status</h2>
                    <div className="d-flex justify-content-between align-items-center mb-3">
                        <select
                            className="form-select"
                            value={selectedBusinessUnitId}
                            onChange={handleBusinessUnitChange}
                        >
                            <option value="">Select a Business Unit</option>
                            {businessUnits.map((unit) => (
                                <option key={unit._id} value={unit._id}>
                                    {unit.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    {selectedBusinessUnitId && (
                        <div className="mb-3">
                            <select
                                className="form-select"
                                value={filterType}
                                onChange={handleFilterChange}
                            >
                                <option value="">Filter Projects</option>
                                <option value="day">View Projects by Day</option>
                                <option value="week">View Projects by Week</option>
                                <option value="month">View Projects by Month</option>
                                <option value="year">View Projects by Year</option>
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
                        <h5>Completed Projects: {completedProjectCount}</h5>
                    </div>

                    <div className="table-responsive" style={{ maxHeight: '80vh', overflowY: 'auto' }}>
                        <table className="table table-bordered table-striped">
                            <thead className="table-dark">
                                <tr>
                                    <th scope="col">S.No</th>
                                    <th scope="col">Project Name</th>
                                    <th scope="col">Client Name</th>
                                    <th scope="col">Department</th>
                                    <th scope="col">Business Unit</th>
                                    <th scope="col">Updated At</th>
                                    <th scope="col">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredProjects.length > 0 ? (
                                    filteredProjects.map((project, index) => (
                                        <tr key={project._id}>
                                            <td>{index + 1}</td>
                                            <td>{project.name}</td>
                                            <td>{project.client_name}</td>
                                            <td>{project.department.name}</td>
                                            <td>{project.business_unit.name}</td>
                                            <td>{new Date(project.updated_at).toLocaleDateString()}</td>
                                            <td>{project.status}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="7" className="text-center">
                                            No projects found for the selected criteria.
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

export default ProjectStatus;