import { useEffect, useState } from "react";
import UserNavBar from "../UserNavBar";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function MyTasks(){

    const navigate = useNavigate();
    const [ tasks , setTasks ] = useState([]);
    const [ error , setError ] = useState(null);

    const fetchUserTasks = async() =>{
        try {
            const response = await axios.get('http://localhost:8000/api/user/user-tasks', {
                withCredentials: true,
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });
            setTasks(response.data);
            setError("");
        } catch (error) {
            setError(error.response?.data?.message || "Error fetching Tasks");
        }
    };


    useEffect( ()=>{
        fetchUserTasks();
    },[])
    return(
        <>
        <div className="container-fluid" style={{ display: 'flex', margin: '0', padding: '0', height: '100vh' }}>
            
            <UserNavBar />
            <div className="content" style={{ marginLeft: '30px', width: 'calc(100% - 250px)', overflowY: 'auto' }}>
                <div className="container mt-3">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                        <h2>My Task List</h2>
                    </div>

                    {error && <div className="alert alert-danger">{error}</div>}

                    <div className="table-responsive" style={{ maxHeight: '80vh', overflowY: 'auto' }}>
                        <table className="table table-bordered table-striped">
                            <thead className="table-dark">
                                <tr>
                                    <th scope="col">S.No</th>
                                    <th scope="col">Task Name</th>
                                    <th scope="col">Description</th>
                                    <th scope="col">Task User</th>
                                    <th scope="col">Project</th>
                                    <th scope="col">Planned Hours</th>
                                    <th scope="col">Due</th>
                                    <th scope="col">Priority</th>
                                    <th scope="col">Status</th>
                                    <th scope="col">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {tasks.length > 0 ? (
                                    tasks.map((task, index) => (
                                        <tr key={task._id}>
                                            <td>{index + 1}</td>
                                            <td>{task.name}</td>
                                            <td>{task.description}</td>
                                            <td>{task.user.username}</td>
                                            <td>{task.project.name}</td>
                                            <td>{task.planned_hours}</td>
                                            <td>{task.due.substring(0,10)}</td>
                                            <td>{task.priority}</td>
                                            <td>{task.status}</td>
                                            <td><button onClick={()=> navigate(`/user-postlog/${task._id}`)} className="btn btn-primary">Enter Logs</button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="9" className="text-center">
                                            No Tasks found.
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

export default MyTasks;