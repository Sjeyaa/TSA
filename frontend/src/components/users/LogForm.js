import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

function LogForm() {

    const { id } = useParams();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        project_name: "",
        date: "",
        task: id,
        hours_to_spend: "",
        task_status: "",
    });
    
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleStatusChange = (e) => {
        setFormData((prevData) => ({
            ...prevData,
            task_status: e.target.value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post(`http://localhost:8000/api/timelog/submit-log/${id}`,formData,
                {
                    withCredentials: true,
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                }
        );
        alert("Log submitted successfully!");
        navigate('/user-tasks');
        } catch (error) {
            alert("Error in log submission!")
        }
    };

    const fetchTaskDetails = async() =>{
        try {
            const response = await axios.get(
                `http://localhost:8000/api/timelog/task-details/${id}`,
                {
                    withCredentials: true,
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                }
            );
    
            const { name, projectName } = response.data;
            setFormData((prevData) => ({
                ...prevData,
                project_name: projectName,
                task: name,
            }));
        } catch (error) {
            alert('Error in fetching task details!')
        }
    }

    useEffect( ()=> {
        fetchTaskDetails()
    },[id])

    return (
        <>
            <div className="container d-flex align-items-center justify-content-center min-vh-100">
                <div className="card p-4 w-100" style={{ maxWidth: "600px", overflowY: "auto" }}>
                    <h1 className="text-center mb-4">Time Log Form</h1>
                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label htmlFor="projectName" className="form-label">
                                Project Name
                            </label>
                            <input
                                className="form-control"
                                type="text"
                                id="projectName"
                                name="project_name"
                                value={formData.project_name}
                                onChange={handleChange}
                                required
                                readOnly
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="date" className="form-label">
                                Date
                            </label>
                            <input
                                type="date"
                                id="date"
                                name="date"
                                className="form-control"
                                value={formData.date}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="taskName" className="form-label">
                                Task Name
                            </label>
                            <input
                                type="text"
                                id="taskName"
                                className="form-control"
                                name="task"
                                value={formData.task}
                                onChange={handleChange}
                                placeholder="Enter task name"
                                required
                                readOnly
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="hoursToSpend" className="form-label">
                                Hours to Spend
                            </label>
                            <input
                                type="number"
                                id="hoursToSpend"
                                className="form-control"
                                name="hours_to_spend"
                                value={formData.hours_to_spend}
                                onChange={handleChange}
                                placeholder="Enter hours to spend"
                                required
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="status" className="form-label">
                                Status
                            </label>
                            <select
                                id="status"
                                className="form-select"
                                name="task_status"
                                value={formData.task_status}
                                onChange={handleStatusChange}
                                required
                            >
                                <option value="" disabled>
                                    Select status
                                </option>
                                <option value="In Progress">In Progress</option>
                                <option value="Completed">Completed</option>
                            </select>
                        </div>
                        <button type="submit" className="btn btn-primary w-100">
                            Submit Log
                        </button>
                    </form>
                </div>
            </div>
        </>
    );
}

export default LogForm;
