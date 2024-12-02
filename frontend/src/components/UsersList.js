import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "./NavBar";
import axios from "axios";

function UsersList() {
    const [users, setUsers] = useState([]);
    const [searchQuery, setSearchQuery] = useState(""); 
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedDepartment, setSelectedDepartment] = useState(""); 
    const [selectedBusinessUnit, setSelectedBusinessUnit] = useState("");
    const navigate = useNavigate();

    // Fetch users api
    const fetchUsers = async () => {
        try {
            setLoading(true);
            const response = await axios.get("http://localhost:8000/api/users", {
                withCredentials: true,
            });
            setUsers(response.data);
            setError(null);
        } catch (error) {
            setError(error.response?.data?.message || "Error fetching users");
        } finally {
            setLoading(false);
        }
    };

    // Delete User api
    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this user?")) {
            try {
                await axios.delete(`http://localhost:8000/api/users/${id}`, {
                    withCredentials: true,
                    headers: { "Content-Type": "application/json" },
                });
                const updatedUsers = users.filter((user) => user._id !== id);
                setUsers(updatedUsers);
                alert("User deleted successfully!");
            } catch (error) {
                alert(error.response?.data?.message || "Error deleting user");
            }
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    // Filter functions
    const filteredUsers = users.filter((user) => {
        const searchString = [
            user.username,
            user.email,
            user.phone,
            user.department?.name,
            user.business_unit?.name,
        ]
            .filter(Boolean)
            .join(" ")
            .toLowerCase();

        const matchesSearch = searchString.includes(searchQuery.toLowerCase());
        const matchesDepartment = !selectedDepartment || user.department?.name === selectedDepartment;
        const matchesBusinessUnit = !selectedBusinessUnit || user.business_unit?.name === selectedBusinessUnit;

        return matchesSearch && matchesDepartment && matchesBusinessUnit;
    });

    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ height: "100vh" }}>
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        );
    }

    return (
        <div style={{ display: "flex", height: "100vh" }}>
            <NavBar />
            <div style={{ marginLeft: "20px", padding: "20px", flex: 1, overflowY: "auto" }}>
                <div className="mb-4 d-flex justify-content-between align-items-center">
                    <h2>User Management</h2>
                    <button 
                        className="btn btn-success"
                        onClick={() => navigate("/add-user")}
                    >
                        Add User
                    </button>
                </div>

                {error && (
                    <div className="alert alert-danger" role="alert">
                        {error}
                    </div>
                )}

                
                <div className="d-flex flex-column flex-md-row gap-3 mb-4">
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Search users by name, email, department, or business unit..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <select 
                        className="form-select" 
                        value={selectedDepartment} 
                        onChange={(e) => setSelectedDepartment(e.target.value)}
                    >
                        <option value="">All Departments</option>
                        {Array.from(new Set(users.map((user) => user.department?.name).filter(Boolean))).map((dept) => (
                            <option key={dept} value={dept}>{dept}</option>
                        ))}
                    </select>
                    <select 
                        className="form-select" 
                        value={selectedBusinessUnit} 
                        onChange={(e) => setSelectedBusinessUnit(e.target.value)}
                    >
                        <option value="">All Business Units</option>
                        {Array.from(new Set(users.map((user) => user.business_unit?.name).filter(Boolean))).map((unit) => (
                            <option key={unit} value={unit}>{unit}</option>
                        ))}
                    </select>
                </div>

                {filteredUsers.length > 0 ? (
                    <div className="table-responsive">
                        <table className="table table-bordered table-striped">
                            <thead className="table-dark">
                                <tr>
                                    <th>Sno</th>
                                    <th>Username</th>
                                    <th>Email</th>
                                    <th>Phone</th>
                                    <th>Department</th>
                                    <th>Business Unit</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredUsers.map((user, index) => (
                                    <tr key={user._id}>
                                        <td>{index + 1}</td>
                                        <td>{user.username}</td>
                                        <td>{user.email}</td>
                                        <td>{user.phone}</td>
                                        <td>{user.department?.name || "N/A"}</td>
                                        <td>{user.business_unit?.name || "N/A"}</td>
                                        <td>
                                            <div className="btn-group" role="group">
                                                <button
                                                    className="btn btn-primary btn-sm"
                                                    onClick={() => navigate(`/edit-user/${user._id}`)}
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    className="btn btn-danger btn-sm ms-2"
                                                    onClick={() => handleDelete(user._id)}
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="alert alert-info">
                        {searchQuery || selectedDepartment || selectedBusinessUnit
                            ? "No users found matching your filters."
                            : "No users found."}
                    </div>
                )}
            </div>
        </div>
    );
}

export default UsersList;
