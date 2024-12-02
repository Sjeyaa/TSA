import React, { useState, useEffect } from 'react';
import UserNavBar from "../UserNavBar";
import axios from 'axios';

function MyProjects() {

    const [projects, setProjects] = useState([]);
    const [error, setError] = useState(null);

    const fetchUserProjects = async () => {
        try {
            const response = await axios.get('http://localhost:8000/api/user/user-projects', {
                withCredentials: true,
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });
            setProjects(response.data.projects);
            setError("");
        } catch (error) {
            setError(error.response?.data?.message || "Error fetching Projects");
        }
    };

    useEffect(() => {
        fetchUserProjects();
    }, []);

    return (
        <>
            <div className="container-fluid" style={{ display: 'flex', margin: '0', padding: '0', height: '100vh' }}>
                
                <UserNavBar />
                <div className="content" style={{ marginLeft: '30px', width: 'calc(100% - 250px)', overflowY: 'auto' }}>
                    <div className="container mt-3">
                        <div className="d-flex justify-content-between align-items-center mb-3">
                            <h2>My Project List</h2>
                        </div>

                        {error && <div className="alert alert-danger">{error}</div>}

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
                                        <th scope="col">Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {projects.length > 0 ? (
                                        projects.map((project, index) => (
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
                                                <td>{project.department.name || 'N/A'}</td>
                                                <td>{project.business_unit.name || 'N/A'}</td>
                                                <td>{project.project_type}</td>
                                                <td>
                                                    {project.assigned_users && project.assigned_users.length > 0
                                                        ? project.assigned_users.map(user => user.username).join(", ")
                                                        : "No Users Assigned"}
                                                </td>
                                                <td>{project.status}</td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="9" className="text-center">
                                                No projects found.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default MyProjects;
