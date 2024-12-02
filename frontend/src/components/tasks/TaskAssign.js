import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

function TaskAssign() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: "",
        description: "",
        planned_hours: "",
        due: "",
        priority: "",
        user: ""
    });
    const [users, setUsers] = useState([]);

    const fetchProjectUsersByID = async () => {
        try {
            const response = await axios.get(`http://localhost:8000/api/task/${id}`, {
                withCredentials: true,
            });
            setUsers(response.data.assigned_users || []);
        } catch (error) {
            alert("Error fetching project users!");
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

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post(`http://localhost:8000/api/task/${id}`, formData, {
                withCredentials: true,
                headers: { "Content-Type": "application/json" },
            });
            alert("Task Created Successfully!");
            navigate("/tasks-list");
        } catch (error) {
            alert(error.response?.data?.message || "Error saving task");
        }
    };

    useEffect(() => {
        fetchProjectUsersByID();
    }, []);

    return (
        <div className="container d-flex align-items-center justify-content-center min-vh-100">
            <div className="card p-4 w-100" style={{ maxWidth: "600px", overflowY: "auto" }}>
                <h1 className="text-center mb-4">Create Task</h1>
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label htmlFor="taskName" className="form-label">
                            Task Name
                        </label>
                        <input
                            type="text"
                            id="taskName"
                            className="form-control"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="Enter task name"
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="taskDescription" className="form-label">
                            Task Description
                        </label>
                        <textarea
                            id="taskDescription"
                            className="form-control"
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            placeholder="Enter task description"
                            rows="3"
                            required
                        ></textarea>
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
    );
}

export default TaskAssign;
