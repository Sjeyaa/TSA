import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

function EditMyLog() {
    const [formData, setFormData] = useState({
        project_name: "",
        date: "",
        task: "",
        hours_to_spend: "",
        task_status: "",
    });
    
    const { id } = useParams(); 
    const navigate = useNavigate(); 

    
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

    // Fetch single log details
    const fetchLogDetails = async () => {
        try {
            const response = await axios.get(`http://localhost:8000/api/timelog/user-log/${id}`, {
                withCredentials: true,
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });
            const log = response.data;

            
            setFormData({
                project_name: log.project_name,
                date: log.date.split("T")[0], 
                task: log.task.name,
                hours_to_spend: log.hours_to_spend,
                task_status: log.task_status,
            });
        } catch (error) {
            console.error("Error fetching log details:", error);
            alert("Failed to fetch log details!");
        }
    };

    // handle submit
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const updatedLog = {
                project_name: formData.project_name, 
                date: formData.date,
                hours_to_spend: formData.hours_to_spend,
                task_status: formData.task_status,
            };

            await axios.put(`http://localhost:8000/api/timelog/edit-log/${id}`, updatedLog, {
                withCredentials: true,
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });

            alert("Log updated successfully!");
            navigate("/user-logs"); 
        } catch (error) {
            console.error("Error updating log:", error);
            alert("Failed to update log!");
        }
    };

    
    useEffect(() => {
        fetchLogDetails();
    }, [id]);

    return (
        <>
            <div className="container d-flex align-items-center justify-content-center min-vh-100">
                <div className="card p-4 w-100" style={{ maxWidth: "600px", overflowY: "auto" }}>
                    <h1 className="text-center mb-4">Edit Time Log</h1>
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
                            Update Log
                        </button>
                    </form>
                </div>
            </div>
        </>
    );
}

export default EditMyLog;