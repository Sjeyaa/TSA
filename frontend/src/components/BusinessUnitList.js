import { useState, useEffect } from "react";
import NavBar from "./NavBar";
import axios from "axios";

function BusinessUnitList() {
    const [units, setUnits] = useState([]);
    const [showModal, setShowModal] = useState(false); 
    const [unitName, setUnitName] = useState("");
    const [errorMessage, setErrorMessage] = useState(""); 

    // Fetch business units
    const fetchUnits = async () => {
        const response = await axios.get('http://localhost:8000/api/unit', {
            withCredentials: true,  
        });
        setUnits(response.data);
    };

    useEffect(() => {
        fetchUnits();
    }, []);

    // Post Business unit to DB
    const handleAddBusinessUnit = async () => {
        try {
            const response = await axios.post('http://localhost:8000/api/unit', { name: unitName }, {
                withCredentials: true,
            });
            setShowModal(false);
            setUnitName(""); 
            setErrorMessage(""); 
            fetchUnits();
        } catch (error) {
            if (error.response && error.response.status === 400) {
                setErrorMessage("Business unit already exists.");
            } else {
                setErrorMessage("An unexpected error occurred. Please try again.");
            }
        }
    };
    

    return (
        <>
            <div style={{ display: 'flex', height: '100vh' }}>
                <NavBar />
                <div className="container d-flex justify-content-center align-items-center" style={{ overflow: 'hidden' }}>
                    <div className="card shadow" style={{ width: "80%", padding: "20px", maxHeight: "80vh", overflowY: "auto" }}>
                        
                        <button
                            onClick={() => setShowModal(true)}
                            className="btn btn-primary position-absolute"
                            style={{ top: '20px', right: '20px' }}
                        >
                            Add Business Unit
                        </button>

                        <h3 className="text-center mb-4">Business Unit</h3>
                        <table className="table table-bordered">
                            <thead>
                                <tr>
                                    <th scope="col">Serial No</th>
                                    <th scope="col">Business Unit Name</th>
                                </tr>
                            </thead>
                            <tbody>
                                {units.map((unit, index) => (
                                    <tr key={unit.id}>
                                        <td>{index + 1}</td>
                                        <td>{unit.name}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            
            {showModal && (
                <div className="modal fade show" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }} tabIndex="-1" role="dialog">
                    <div className="modal-dialog" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Add Business Unit</h5>
                                <button type="button" className="close" onClick={() => {setShowModal(false); setUnitName("");}}>&times;</button>
                            </div>
                            <div className="modal-body">
                            <div className="form-group">
                                    <label>Business Unit Name</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={unitName}
                                        onChange={(e) => setUnitName(e.target.value)}
                                        placeholder="Enter business unit name"
                                    />
                                </div>
                                {errorMessage && (
                                    <div className="alert alert-danger mt-2" role="alert">
                                        {errorMessage}
                                    </div>
                                )}  
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Close</button>
                                <button type="button" className="btn btn-primary" onClick={handleAddBusinessUnit}>Add</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default BusinessUnitList;
