import React, { useState, useEffect } from 'react';
import NavBar from "../NavBar";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function ListProjects() {
    const [projects, setProjects] = useState([]);
    const [filteredProjects, setFilteredProjects] = useState([]);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [departments, setDepartments] = useState([]);
    const [businessUnits, setBusinessUnits] = useState([]);
    const [selectedDepartment, setSelectedDepartment] = useState('');
    const [selectedBusinessUnit, setSelectedBusinessUnit] = useState('');
    const navigate = useNavigate();

    const fetchProjects = async () => {
        try {
            const response = await axios.get('http://localhost:8000/api/project', {
                withCredentials: true
            });
            setProjects(response.data);
            setFilteredProjects(response.data);
            setError("");
        } catch (error) {
            setError(error.response?.data?.message || "Error fetching Projects");
        }
    };

    const fetchFilters = async () => {
        try {
            const departmentsResponse = await axios.get('http://localhost:8000/api/department', {
                withCredentials: true
            });
            const businessUnitsResponse = await axios.get('http://localhost:8000/api/unit', {
                withCredentials: true
            });
            setDepartments(departmentsResponse.data);
            setBusinessUnits(businessUnitsResponse.data);
        } catch (error) {
            console.error("Error fetching filters:", error);
        }
    };

    useEffect(() => {
        fetchProjects();
        fetchFilters();
    }, []);

    const handleSearch = (e) => {
        setSearchQuery(e.target.value);
    };

    const handleDepartmentFilter = (e) => {
        setSelectedDepartment(e.target.value);
    };

    const handleBusinessUnitFilter = (e) => {
        setSelectedBusinessUnit(e.target.value);
    };

    useEffect(() => {
        let tempProjects = [...projects];

        if (searchQuery) {
            tempProjects = tempProjects.filter(project =>
                project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                project.client_name.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        if (selectedDepartment) {
            tempProjects = tempProjects.filter(project =>
                project.department?.name === selectedDepartment
            );
        }

        if (selectedBusinessUnit) {
            tempProjects = tempProjects.filter(project =>
                project.business_unit?.name === selectedBusinessUnit
            );
        }

        setFilteredProjects(tempProjects);
    }, [searchQuery, selectedDepartment, selectedBusinessUnit, projects]);

    return (
        <>
            <div className="container-fluid" style={{ display: 'flex', height: '100vh', margin: '0' }}>
                
                <div className="col-2 p-0" style={{ position: 'fixed', left: 0, top: 0, bottom: 0 }}>
                    <NavBar />
                </div>
                
                <div className="col-10" style={{ marginLeft: '250px' }}>
                    <div className="container mt-3">
                        <div className="d-flex justify-content-between align-items-center mb-3">
                            <h2>Project List</h2>
                            <button className="btn btn-success" onClick={() => navigate('/create-project')}>Create Project</button>
                        </div>

                        {error && <div className="alert alert-danger">{error}</div>}

                        {/* Search and Filters */}
                        <div className="mb-3">
                            <input
                                type="text"
                                className="form-control mb-2"
                                placeholder="Search by project name or client name"
                                value={searchQuery}
                                onChange={handleSearch}
                            />
                            <div className="d-flex gap-3">
                                <select
                                    className="form-select"
                                    value={selectedDepartment}
                                    onChange={handleDepartmentFilter}
                                >
                                    <option value="">Filter by Department</option>
                                    {departments.map(department => (
                                        <option key={department._id} value={department.name}>
                                            {department.name}
                                        </option>
                                    ))}
                                </select>
                                <select
                                    className="form-select"
                                    value={selectedBusinessUnit}
                                    onChange={handleBusinessUnitFilter}
                                >
                                    <option value="">Filter by Business Unit</option>
                                    {businessUnits.map(unit => (
                                        <option key={unit._id} value={unit.name}>
                                            {unit.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="table-responsive" style={{ maxHeight: '80vh', overflowY: 'auto' }}>
                            <table className="table table-bordered table-striped">
                                <thead className="table-dark">
                                    <tr>
                                        <th scope="col">S.No</th>
                                        <th scope="col">Project Name</th>
                                        <th scope="col">Client Name</th>
                                        <th scope="col">Address</th>
                                        <th scope="col">Department</th>
                                        <th scope="col">Business Unit</th>
                                        <th scope="col">Project Type</th>
                                        <th scope="col">Assigned Users</th>
                                        <th scope="col">Operation</th>
                                        <th scope="col">Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        filteredProjects.length > 0 ? (
                                            filteredProjects.map((project, index) => 
                                                <tr key={project._id}>
                                                    <td>{index + 1}</td>
                                                    <td>{project.name}</td>
                                                    <td>{project.client_name}</td>
                                                    <td>
                                                        {project.address && (
                                                            <ul>
                                                                <li>City: {project.address.city}</li>
                                                                <li>State: {project.address.state}</li>
                                                                <li>Country: {project.address.country}</li>
                                                                <li>Zip: {project.address.zip_code}</li>
                                                            </ul>
                                                        )}
                                                    </td>
                                                    <td>{project.department?.name || 'N/A'}</td>
                                                    <td>{project.business_unit?.name || 'N/A'}</td>
                                                    <td>{project.project_type}</td>
                                                    <td>
                                                        {project.assigned_users && project.assigned_users.length > 0
                                                            ? project.assigned_users.map(user => user.username).join(", ")
                                                            : "No Users Assigned"}
                                                    </td>
                                                    <td>
                                                        <button className="btn btn-primary" onClick={() => navigate(`/assign-users/${project._id}`)}>Assign Users</button>
                                                        <button className="btn btn-success mt-3" onClick={() => navigate(`/edit-project/${project._id}`)}>Edit Project</button>
                                                    </td>
                                                    <td>{project.status}</td>
                                                </tr>
                                            )
                                        ) : (
                                            <tr>
                                                <td colSpan="9" className="text-center">
                                                    No projects found.
                                                </td>
                                            </tr>
                                        )
                                    }
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default ListProjects;
