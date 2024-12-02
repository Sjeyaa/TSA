import React, { useEffect, useState } from "react";
import NavBar from "./NavBar";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function DepartmentsList() {
  const [departments, setDepartments] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch departments
    const fetchDepartments = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/department',{
            withCredentials: true
        });
        setDepartments(response.data);
        
      } catch (error) {
        console.error("Error fetching departments:", error);
      }
    };
    fetchDepartments();
  }, []);

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      
      <NavBar />
      <div style={{ flex: 1, padding: "20px", backgroundColor: "#f8f9fa" }}>
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h3>Departments</h3>
          <button
            className="btn btn-primary"
            onClick={() => navigate('/add-department')}
          >
            Add Department
          </button>
        </div>

       
        <table className="table table-striped">
          <thead className="table-dark">
            <tr>
              <th scope="col">S.No</th>
              <th scope="col">Department Name</th>
              <th scope="col">Business Units</th>
            </tr>
          </thead>
          <tbody>
            {departments.length > 0 ? (
              departments.map((department, index) => (
                <tr key={department._id}>
                  <td>{index + 1}</td>
                  <td>{department.name}</td>
                  <td>
                    {department.business_units
                      .map((unit) => unit.name)
                      .join(", ")}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" className="text-center">
                  No Departments Found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default DepartmentsList;
