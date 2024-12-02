import React, { useState, useEffect } from 'react';
import axios from 'axios';

function DepartmentForm(){
    const [businessUnits, setBusinessUnits] = useState([]);
    const [selectedBusinessUnits, setSelectedBusinessUnits] = useState([]);
    const [departmentName, setDepartmentName] = useState("");
    const [message, setMessage] = useState("");

    
    useEffect(() => {
        const fetchBusinessUnits = async () => {
            try {
                const response = await axios.get('http://localhost:8000/api/unit',{
                    withCredentials : true
                }); 
                setBusinessUnits(response.data);
            } catch (error) {
                console.error("Error fetching business units:", error);
            }
        };
        fetchBusinessUnits();
    }, []);

    // handle submit
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:8000/api/department', {
                name: departmentName,
                business_units: selectedBusinessUnits
            },{
                withCredentials : true,
            });
            setMessage(`Department '${response.data.name}' created successfully!`);
            setDepartmentName('');
            setSelectedBusinessUnits([]);
        } catch (error) {
            setMessage(error.response?.data?.message || "Error creating department.");
        }
    };
    return(<>
        <div className="container mt-5">
            <h2>Create New Department</h2>
            {message && <div className="alert alert-info">{message}</div>}
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label htmlFor="departmentName" className="form-label">Department Name</label>
                    <input
                        type="text"
                        id="departmentName"
                        className="form-control"
                        value={departmentName}
                        onChange={(e) => setDepartmentName(e.target.value)}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="businessUnits" className="form-label">Select Business Units</label>
                    <select
                        id="businessUnits"
                        className="form-select"
                        multiple
                        value={selectedBusinessUnits}
                        onChange={(e) => {
                            const selectedOptions = Array.from(e.target.selectedOptions, (option) => option.value);
                            setSelectedBusinessUnits(selectedOptions);
                        }}
                    >
                        {businessUnits.map((unit) => (
                            <option key={unit._id} value={unit._id}>
                                {unit.name}
                            </option>
                        ))}
                    </select>
                    <small className="form-text text-muted">Hold down the Ctrl button to select multiple options</small>
                </div>
                <button type="submit" className="btn btn-primary">Create Department</button>
            </form>
        </div>
    </>);
}

export default DepartmentForm;