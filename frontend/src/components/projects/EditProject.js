import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

function EditProject() {
    const navigate = useNavigate();
    const { id } = useParams();

    // State management
    const [departments, setDepartments] = useState([]);
    const [businessUnits, setBusinessUnits] = useState([]);
    const [availableUsers, setAvailableUsers] = useState([]);
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
        project_type: "",
        assigned_users:[]
    });

    const [userData, setUserData] = useState({
        selectedUsers: []
    });

    console.log(userData.selectedUsers);

    
    useEffect(() => {
        const initializeData = async () => {
            try {
                await Promise.all([
                    fetchDepartments(),
                    fetchProjectDetails()
                ]);
            } catch (error) {
                console.error("Initialization error:", error);
                alert("Error initializing project details");
            }
        };
        
        initializeData();
    }, [id]);

    

    // Fetch project details
    const fetchProjectDetails = async () => {
        try {
            const response = await axios.get(`http://localhost:8000/api/project/edit-project/${id}`, {
                withCredentials: true
            });
            const project = response.data;
            
            
            setFormData({
                ...project,
                department: project.department?._id || "",
                business_unit: project.business_unit?._id || "",
                address: project.address || { 
                    city: "", 
                    state: "", 
                    country: "", 
                    zip_code: "" 
                }
            });
    
            // Fetch users based on department and business unit
            if (project.department?._id && project.business_unit?._id) {
                // Fetch business units for the department
                await fetchBusinessUnits(project.department._id);

                // Fetch available users
                await fetchAvailableUsers(
                    project.department._id, 
                    project.business_unit._id
                );
            }
    
            // Set initially assigned users
            if (project.assigned_users) {
                setUserData({
                    selectedUsers: project.assigned_users
                });
            }
        } catch (error) {
            console.error("Error fetching Project Details:", error);
            alert("Error fetching Project Details!");
        }
    };

    // Fetch departments
    const fetchDepartments = async () => {
        try {
            const response = await axios.get('http://localhost:8000/api/department/', {
                withCredentials: true
            });
            setDepartments(response.data);
        } catch (error) {
            console.error("Error fetching departments:", error);
            alert("Error fetching departments!");
        }
    };

    // Fetch business units for a specific department
    const fetchBusinessUnits = async (departmentId) => {
        if (!departmentId) return;

        try {
            const response = await axios.get(`http://localhost:8000/api/department/${departmentId}`, {
                withCredentials: true
            });
            setBusinessUnits(response.data.business_units || []);
        } catch (error) {
            console.error("Error fetching business units:", error);
            alert("Error fetching business units!");
            setBusinessUnits([]);
        }
    };

    // Fetch available users
    const fetchAvailableUsers = async (departmentId, businessUnitId) => {
        
        if (!departmentId || !businessUnitId) {
            console.warn('Department or Business Unit ID is missing');
            setAvailableUsers([]);
            return;
        }
    
        try {
    
            const response = await axios.get(`http://localhost:8000/api/users/availableusers`, {
                withCredentials: true,
                params: {
                    department: departmentId,
                    business_unit: businessUnitId
                }
            });
    
            
            
            const users = Array.isArray(response.data) 
                ? response.data 
                : (response.data.users || []);
            
            setAvailableUsers(users);
        } catch (error) {
           
            alert(error.response?.data?.message || "Error fetching available users!");
            setAvailableUsers([]); 
        }
    };

    
    const handleDepartmentChange = async (e) => {
        const departmentId = e.target.value;
        
        
        setFormData(prev => ({
            ...prev,
            department: departmentId,
            business_unit: "" 
        }));
    
        
        setAvailableUsers([]);
        setUserData({ selectedUsers: [] });
        setBusinessUnits([]); 
    
        if (departmentId) {
            await fetchBusinessUnits(departmentId);
        }
    };

    
    const handleBusinessUnitChange = async (e) => {
        const businessUnitId = e.target.value;
        
       
        setFormData(prev => ({
            ...prev,
            business_unit: businessUnitId
        }));
    
        
        setUserData({ selectedUsers: [] });
    
        // Fetch users if both department and business unit are selected
        if (formData.department && businessUnitId) {
            await fetchAvailableUsers(formData.department, businessUnitId);
        }
    };

    
    const handleCheckboxChange = (e) => {
        const { value, checked } = e.target;
        setUserData((prev) => {
            const selectedUsers = checked
                ? [...prev.selectedUsers, value]
                : prev.selectedUsers.filter((user) => user !== value);
            return { ...prev, selectedUsers };
        });
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
            console.log(formData);
        }
        
    };

    
  
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
        
            const selectedUserIds = availableUsers
                .filter(user => userData.selectedUsers.includes(user.username)) 
                .map(user => user._id); 

                const submissionData = {
                    ...formData,
                    assigned_users: selectedUserIds
                };

                //put route for update
                await axios.put(`http://localhost:8000/api/project/edit-single-project/${id}`, submissionData, {
                    withCredentials: true,
                    headers: { 'Content-Type': 'application/json' },
                });
                
                alert("Project updated successfully!");
                navigate("/projects-list");
            } catch (error) {
                console.error("Submit error:", error);
                alert(error.response?.data?.message || "Error in updating project");
            }
        };


    
    const handleCancel = () => {
        navigate('/projects-list');
    };

    return (
        <div className="container-fluid vh-100 d-flex align-items-center justify-content-center bg-light">
            <div className="row w-100 justify-content-center">
                <div className="col-md-6 col-lg-5">
                    <div className="card shadow-sm overflow-auto" style={{ maxHeight: "90vh" }}>
                        <div className="card-body p-4">
                            <h2 className="text-center mb-4">Edit Project Details</h2>
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
                                        value={formData.address.state || ""}
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
                                        value={formData.address.country || ""}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>

                                <div className="mb-3">
                                    <label htmlFor="address.zip_code" className="form-label">Zip Code</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="address.zip_code"
                                        name="address.zip_code"
                                        value={formData.address.zip_code || ""}
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
                                        onChange={handleBusinessUnitChange}
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

                                <div className="mb-4">
                                    <h5 className="text-primary mb-3">User Assignment</h5>
                                    <div className="row">
                                        <div className="col-md-12">
                                            {formData.department && formData.business_unit ? (
                                                availableUsers.length > 0 ? (
                                                    <ul 
                                                        className="list-group" 
                                                        style={{ 
                                                            maxHeight: '200px',
                                                            overflowY: 'auto',
                                                        }}
                                                    >
                                                        {availableUsers.map((user) => (
                                                            <li 
                                                                key={user._id} 
                                                                className="list-group-item d-flex justify-content-between align-items-center"
                                                            >
                                                                <div>
                                                                    <span className="me-2">{user.username}</span>
                                                                </div>
                                                                <input
                                                                    type="checkbox"
                                                                    value={user.username}
                                                                    checked={userData.selectedUsers.includes(user.username)}
                                                                    onChange={handleCheckboxChange}
                                                                    className="form-check-input"
                                                                />
                                                            </li>
                                                        ))}
                                                    </ul>
                                                ) : (
                                                    <div className="alert alert-info text-center">
                                                        No users found for the selected department and business unit
                                                    </div>
                                                )
                                            ) : (
                                                <div className="alert alert-warning text-center">
                                                    Select both Department and Business Unit to view available users
                                                </div>
                                            )}
                                            
                                            
                                        </div>
                                    </div>
                                </div>

                                <div className="d-flex justify-content-between">
                                    <button type="submit" className="btn btn-primary w-50 me-2">
                                        Update
                                    </button>
                                    <button 
                                        type="button" 
                                        onClick={handleCancel} 
                                        className="btn btn-danger w-50"
                                    >
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

export default EditProject;