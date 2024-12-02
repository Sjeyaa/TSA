import { useEffect, useState } from "react";
import NavBar from "../NavBar";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

function ViewTasks() {

    const [error, setError] = useState(null);
    const [ tasks , setTasks ] = useState([]);
    const { id } = useParams();
    const navigate = useNavigate();

    //fetch tasks
    const fetchTasks = async() =>{
        try {
            const response = await axios.get(`http://localhost:8000/api/task/list-tasks/${id}`,{
                withCredentials : true
            })
            setTasks(response.data.tasks);
            setError("");
        } catch (error) {
            alert("Error fetching Tasks!");
        }
    }

    useEffect( () => {
        fetchTasks();
    },[id]);
    return(
        <>
            <div className="container-fluid" style={{ display: 'flex', height: '100vh', margin: '0' }}>
                <div className="col-2 p-0" style={{ position: 'fixed', left: 0, top: 0, bottom: 0 }}>
                    <NavBar />
                </div>
                <div className="col-10" style={{ marginLeft: '250px' }}>
                    <div className="container mt-3">
                        <div className="d-flex justify-content-between align-items-center mb-3">
                            <h2>Task Lists</h2>
                        </div>

                        {error && <div className="alert alert-danger">{error}</div>}
                        
                        <div className="table-responsive" style={{ maxHeight: '80vh', overflowY: 'auto' }}>
                            <table className="table table-bordered table-striped">
                                <thead className="table-dark">
                                    <tr>
                                        <th scope="col">S.No</th>
                                        <th scope="col">Task Name</th>
                                        <th scope="col">Description</th>
                                        <th scope="col">User</th>
                                        <th scope="col">Planned Hours</th>
                                        <th scope="col">Due</th>
                                        <th scope="col">Priority</th>
                                        <th scope="col">Status</th>
                                        <th scope="col">Operations</th>
                                    </tr>
                                </thead>
                                <tbody>
                                {
                                    tasks.length > 0 ? (
                                    tasks.map((task, index) => 
                                        <tr key={task._id}>
                                        <td>{index+1}</td>
                                        <td>{task.name}</td>
                                        <td>{task.description}</td>
                                        <td>{task.user.username}</td>
                                        <td>{task.planned_hours}</td>
                                        <td>{task.due.substring(0,10)}</td>
                                        <td>{task.priority}</td>
                                        <td>{task.status}</td>
                                        <td><button className="btn btn-primary" onClick={()=> navigate(`/edit-task/${task._id}/${id}`)}>Edit Task</button></td>
                                    </tr> )):(
                                        <tr>
                                            <td colSpan="9" className="text-center">
                                                No Tasks found!!
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

export default ViewTasks;