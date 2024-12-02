import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

function EditTask(){
    //state management
    const { taskId , projectId } = useParams();
    const navigate = useNavigate();
    const [users, setUsers] = useState([]);
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        planned_hours: "",
        due: "",
        priority: "",
        user: ""
    });

    const fetchProjectUsersByID = async () => {
        try {
            const response = await axios.get(`http://localhost:8000/api/task/${projectId}`, {
                withCredentials: true,
            });
            setUsers(response.data.assigned_users || []);
        } catch (error) {
            alert("Error fetching project users!");
        }
    };

    const fetchTaskData = async () => {
        try {
            const response = await axios.get(`http://localhost:8000/api/task/single-task/${taskId}`, {
                withCredentials: true,
            });
            const taskData = response.data;
            const formattedDueDate = taskData.due ? taskData.due.split("T")[0] : "";
    
            setFormData({
                name: taskData.name,
                description: taskData.description,
                planned_hours: taskData.planned_hours,
                due: formattedDueDate, 
                priority: taskData.priority,
                user: taskData.user ? taskData.user._id : "",
            });
        } catch (error) {
            alert("Error fetching task data!");
        }
    };
    

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleUserChange = async (e) => {
        const userId = e.target.value;
        setFormData({
            ...formData,
            user: userId,
        });
    };

    const handleSubmit = async(e) =>{
        e.preventDefault();
        try {
            const response = await axios.put(`http://localhost:8000/api/task/edit-task/${taskId}/${projectId}`,formData, {
                withCredentials: true,
                headers: { 'Content-Type': 'application/json' },
            });
            alert("Task Edited successfully!");
            navigate('/tasks-list')
        } catch (error) {
            alert(error.response?.data?.message || "Error updating task");
        }
    }

    useEffect( ()=> {
        fetchProjectUsersByID();
        fetchTaskData();
    },[]);

    return(
        <>
            <div className="d-flex justify-content-center align-items-center" style={{ height: "100vh", backgroundColor: "#f8f9fa" }}>
            <div className="card shadow" style={{ width: "30rem", padding: "20px" }}>
                <h2 className="text-center mb-4">Edit Task</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label htmlFor="username" className="form-label">Task Name</label>
                        <input
                            type="text"
                            className="form-control"
                            id="username"
                            name="username"
                            value={formData.name}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="mb-3">
                        <label htmlFor="username" className="form-label">Description</label>
                        <input
                            type="text"
                            className="form-control"
                            id="username"
                            name="username"
                            value={formData.description}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="mb-3">
                        <label htmlFor="plannedHours" className="form-label">
                            Planned Hours
                        </label>
                        <input
                            type="number"
                            id="plannedHours"
                            className="form-control"
                            name="planned_hours"
                            value={formData.planned_hours}
                            onChange={handleChange}
                            placeholder="Enter planned hours"
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="dueDate" className="form-label">
                            Due Date
                        </label>
                        <input
                            type="date"
                            id="dueDate"
                            name="due"
                            className="form-control"
                            value={formData.due}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="priority" className="form-label">
                            Priority
                        </label>
                        <select
                            id="priority"
                            className="form-select"
                            name="priority"
                            value={formData.priority}
                            onChange={handleChange}
                            required
                        >
                            <option value="" disabled>
                                Select priority
                            </option>
                            <option value="High">High</option>
                            <option value="Less">Less</option>
                            <option value="Severe">Severe</option>
                        </select>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="user" className="form-label">Select User</label>
                        <select
                            className="form-select"
                            id="user"
                            name="user"
                            value={formData.user}
                            onChange={handleUserChange}
                            required
                        >
                            <option value="">Select User</option>
                            {users.map((user) => (
                                <option key={user._id} value={user._id}>
                                    {user.username}
                                </option>
                            ))}
                        </select>
                    </div>
                    <button type="submit" className="btn btn-primary w-100">
                        Submit Task
                    </button>
                </form>
            </div>
        </div>
        </>
    );
}

export default EditTask;