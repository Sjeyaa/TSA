import React , { useState , useEffect} from 'react';
import NavBar from "../NavBar";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function ProjectLists(){

    const [projects, setProjects] = useState([]);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    //Fetch User Assigned Projects
    const fetchUserAssignedProjects = async () =>{
        try {
            const response = await axios.get('http://localhost:8000/api/task/user-assigned-projects',{
                withCredentials : true
            })
            setProjects(response.data);
            setError("");
        } catch (error) {
            setError(error.response?.data?.message || "Error fetching Projects")
        }
    }

    useEffect( () =>{
        fetchUserAssignedProjects();
    },[])

    return(
        <>
            <div className="container-fluid" style={{ display: 'flex', height: '100vh', margin: '0' }}>
                <div className="col-2 p-0" style={{ position: 'fixed', left: 0, top: 0, bottom: 0 }}>
                    <NavBar />
                </div>
                <div className="col-10" style={{ marginLeft: '250px' }}>
                    <div className="container mt-3">
                        <div className="d-flex justify-content-between align-items-center mb-3">
                            <h2>Assigned Users Project List</h2>
                        </div>

                        {error && <div className="alert alert-danger">{error}</div>}
                        
                        <div className="table-responsive" style={{ maxHeight: '80vh', overflowY: 'auto' }}>
                            <table className="table table-bordered table-striped">
                                <thead className="table-dark">
                                    <tr>
                                        <th scope="col">S.No</th>
                                        <th scope="col">Project Name</th>
                                        <th scope="col">Assigned Users</th>
                                        <th scope="col">Operation</th>
                                        <th scope="col">View Tasks</th>
                                    </tr>
                                </thead>
                                <tbody>
                                {
                                    projects.length > 0 ? (
                                    projects.map((project, index) => 
                                        <tr key={project._id}>
                                        <td>{index+1}</td>
                                        <td>{project.name}</td>
                                        <td>
                                        {project.assigned_users && project.assigned_users.length > 0
                                            ? project.assigned_users.map(user => user.username).join(", ")
                                            : "No Users Assigned"}
                                        </td>
                                        <td>
                                            <button onClick={()=> navigate(`/assign-task/${project._id}`)}className="btn btn-primary">Assign Tasks</button>
                                        </td>
                                        <td><button onClick={()=> navigate(`/view-tasks/${project._id}`)} className="btn btn-success">View Tasks</button></td>
                                    </tr> )):(
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

export default ProjectLists;