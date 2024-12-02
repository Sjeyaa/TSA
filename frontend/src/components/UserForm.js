import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

function UserForm(props) {
    const heading = props.heading;
    const navigate = useNavigate();
    const { id } = useParams();
    const [departments, setDepartments] = useState([]);
    const [businessUnits, setBusinessUnits] = useState([]);
    const [formData, setFormData] = useState({
        username: "",
        password: "",
        email: "",
        phone: "",
        department: "",
        business_unit: "",
    });
    const [isEdit, setIsEdit] = useState(false);
    const [loading, setLoading] = useState(false); // Loader state

    useEffect(() => {
        fetchDepartments();
        if (id) {
            setIsEdit(true);
            fetchUserData();
        } else {
            generateRandomPassword();
        }
    }, [id]);

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

    const fetchUserData = async () => {
        try {
            const response = await axios.get(`http://localhost:8000/api/users/${id}`, {
                withCredentials: true,
                headers: { 'Content-Type': 'application/json' },
            });

            const user = response.data;
            setFormData({
                username: user.username,
                password: "",
                email: user.email,
                phone: user.phone,
                department: user.department,
                business_unit: user.business_unit,
            });

            if (user.department) {
                const deptResponse = await axios.get(`http://localhost:8000/api/department/${user.department}`, {
                    withCredentials: true
                });
                setBusinessUnits(deptResponse.data.business_units);
            }
        } catch (error) {
            alert("Error fetching user data!");
        }
    };

    const generateRandomPassword = () => {
        const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
        let password = "";
        for (let i = 0; i < 8; i++) {
            password += characters.charAt(Math.floor(Math.random() * characters.length));
        }
        setFormData(prevData => ({ ...prevData, password }));
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
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true); // Start loading
        try {
            if (isEdit) {
                await axios.put(`http://localhost:8000/api/users/${id}`, formData, {
                    withCredentials: true,
                    headers: { 'Content-Type': 'application/json' },
                });
                alert("User updated successfully!");
            } else {
                await axios.post("http://localhost:8000/api/users", formData, {
                    withCredentials: true,
                    headers: { 'Content-Type': 'application/json' },
                });
                alert("User created successfully!");
            }
            navigate("/api/users");
        } catch (error) {
            alert(error.response?.data?.message || "Error saving user");
        } finally {
            setLoading(false); // End loading
        }
    };

    const handleCancel = () => {
        navigate('/api/users');
    };

    return (
        <div className="d-flex justify-content-center align-items-center" style={{ height: "100vh", backgroundColor: "#f8f9fa" }}>
            <div className="card shadow" style={{ width: "30rem", padding: "20px" }}>
                <h2 className="text-center mb-4">{heading}</h2>
                <form onSubmit={handleSubmit}>
                    {loading && (
                        <div className="loader-overlay">
                            <div className="spinner-border text-primary" role="status">
                                <span className="visually-hidden">Loading...</span>
                            </div>
                        </div>
                    )}

                    <div className="mb-3">
                        <label htmlFor="username" className="form-label">Username</label>
                        <input
                            type="text"
                            className="form-control"
                            id="username"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    {!isEdit && (
                        <div className="mb-3">
                            <label htmlFor="password" className="form-label">Password</label>
                            <input
                                type="password"
                                className="form-control"
                                id="password"
                                name="password"
                                value={formData.password}
                                readOnly
                                required
                            />
                        </div>
                    )}

                    <div className="mb-3">
                        <label htmlFor="email" className="form-label">Email</label>
                        <input
                            type="email"
                            className="form-control"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="mb-3">
                        <label htmlFor="phone" className="form-label">Phone</label>
                        <input
                            type="tel"
                            className="form-control"
                            id="phone"
                            name="phone"
                            value={formData.phone}
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

                    <div className="d-flex justify-content-between">
                        <button type="submit" className="btn btn-primary w-50 me-2">
                            {isEdit ? "Update" : "Submit"}
                        </button>
                        <button type="button" onClick={handleCancel} className="btn btn-danger w-50">
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default UserForm;
