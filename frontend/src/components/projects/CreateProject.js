import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function CreateProject() {
    //state management 
    const navigate = useNavigate();
    const [departments, setDepartments] = useState([]);
    const [businessUnits, setBusinessUnits] = useState([]);
    const [formData, setFormData] = useState({
        name: "",
        client_name: "",
        address: {
            city: "",
            state: "",
            country: "",
            zip_code: ""
        },
        department: "",
        business_unit: "",
        project_type: ""
    });

    useEffect(() => {
        fetchDepartments();
    }, []);

    //fetch departments
    const fetchDepartments = async () => {
        try {
            const response = await axios.get('http://localhost:8000/api/department', {
                withCredentials: true
            });
            setDepartments(response.data);
        } catch (error) {
            alert("Error fetching departments!");
        }
    };

    const handleDepartmentChange = async (e) => {
        const departmentId = e.target.value;
        setFormData({
            ...formData,
            department: departmentId,
            business_unit: ""
        });

        if (departmentId) {
            try {
                const response = await axios.get(`http://localhost:8000/api/department/${departmentId}`, {
                    withCredentials: true
                });
                setBusinessUnits(response.data.business_units);
            } catch (error) {
                alert("Error fetching business units!");
            }
        } else {
            setBusinessUnits([]);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
    
        if (name.includes("address.")) {
            const field = name.split(".")[1]; 
            setFormData((prevData) => ({
                ...prevData,
                address: {
                    ...prevData.address,
                    [field]: value
                }
            }));
        } else {
            setFormData({
                ...formData,
                [name]: value
            });
        }
    };

    const handleCancel = () => {
        navigate('/projects-list');
    };

    //handle submit
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:8000/api/project', formData, {
                withCredentials: true,
                headers: { 'Content-Type': 'application/json' },
            });
            alert("Project created successfully!");
            navigate("/projects-list");
        } catch (error) {
            alert(error.response?.data?.message || "Error in creating project");
        }
    }

    return (
        <div className="container-fluid vh-100 d-flex align-items-center justify-content-center bg-light">
            <div className="row w-100 justify-content-center">
                <div className="col-md-6 col-lg-5">
                    <div className="card shadow-sm overflow-auto" style={{ maxHeight: "90vh" }}>
                        <div className="card-body p-4">
                            <h2 className="text-center mb-4">Create Project</h2>
                            <form onSubmit={handleSubmit}>
                                <div className="mb-3">
                                    <label htmlFor="name" className="form-label">Project Name</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="name"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="client_name" className="form-label">Client Name</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="client_name"
                                        name="client_name"
                                        value={formData.client_name}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>

                                <div className="mb-3">
                                    <label htmlFor="address.city" className="form-label">City</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="address.city"
                                        name="address.city"
                                        value={formData.address.city || ""}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="address.state" className="form-label">State</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="address.state"
                                        name="address.state"
                                        value={formData.address.state}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="address.country" className="form-label">Country</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="address.country"
                                        name="address.country"
                                        value={formData.address.country}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>

                                <div className="mb-3">
                                    <label htmlFor="zipcode" className="form-label">Zip Code</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="address.zip_code"
                                        name="address.zip_code"
                                        value={formData.address.zip_code}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>

                                <div className="mb-3">
                                    <label htmlFor="department" className="form-label">Department</label>
                                    <select
                                        className="form-select"
                                        id="department"
                                        name="department"
                                        value={formData.department}
                                        onChange={handleDepartmentChange}
                                        required
                                    >
                                        <option value="">Select Department</option>
                                        {departments.map(dept => (
                                            <option key={dept._id} value={dept._id}>
                                                {dept.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="mb-3">
                                    <label htmlFor="business_unit" className="form-label">Business Unit</label>
                                    <select
                                        className="form-select"
                                        id="business_unit"
                                        name="business_unit"
                                        value={formData.business_unit}
                                        onChange={handleChange}
                                        required
                                        disabled={!formData.department}
                                    >
                                        <option value="">Select Business Unit</option>
                                        {businessUnits.map(unit => (
                                            <option key={unit._id} value={unit._id}>
                                                {unit.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="mb-3">
                                    <label htmlFor="project_type" className="form-label">Project Type</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="project_type"
                                        name="project_type"
                                        value={formData.project_type}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>

                                <div className="d-flex justify-content-between">
                                    <button type="submit" className="btn btn-primary w-50 me-2">
                                        Submit
                                    </button>
                                    <button type="button" onClick={handleCancel} className="btn btn-danger w-50">
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CreateProject;