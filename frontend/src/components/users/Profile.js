import { useEffect, useState } from "react";
import UserNavBar from "../UserNavBar";
import axios from 'axios';

function Profile() {

    const [user, setUser] = useState({});

    // Fetch user data from the DB
    const fetchUser = async () => {
        try {
            const response = await axios.get('http://localhost:8000/api/user', {
                withCredentials: true,
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });
            setUser(response.data);
        } catch (error) {
            alert("Error fetching user details");
        }
    };

    useEffect(() => {
        fetchUser();
    }, []);

    return (
        <>
            <div style={{ display: 'flex', height: '100vh', margin: '0' }}>
                <UserNavBar />
                <div className="container my-5" style={{ flexGrow: 1, padding: "20px" }}>
                    <h2 className="text-center mb-4 text-primary">User Profile</h2>
                    <div className="row justify-content-center">
                        <div className="col-md-8">
                            <div className="card shadow-lg">
                                <div className="card-body">
                                    <div className="text-center mb-4">
                                        <h3 className="mt-3">{user.username}</h3>
                                        
                                    </div>
                                    <ul className="list-group list-group-flush">
                                        <li className="list-group-item">
                                            <strong>Email:</strong> {user.email}
                                        </li>
                                        <li className="list-group-item">
                                            <strong>Phone:</strong> {user.phone}
                                        </li>
                                        <li className="list-group-item">
                                            <strong>Department:</strong> {user.department?.name || "Not Available"}
                                        </li>
                                        <li className="list-group-item">
                                            <strong>Business Unit:</strong> {user.business_unit?.name || "Not Available"}
                                        </li>
                                        <li className="list-group-item">
                                            <strong>Role:</strong> {user.role}
                                        </li>
                                        
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Profile;
