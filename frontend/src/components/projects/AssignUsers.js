import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

function AssignUsers() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [projectData, setProjectData] = useState({
    project: {
      name: "",
      department: "",
      business_unit: ""
    },
    users: []
  });

  const [formData, setFormData] = useState({
    selectedUsers: []
  });

  const handleCheckboxChange = (e) => {
    const { value, checked } = e.target;
    setFormData((prev) => {
      const selectedUsers = checked
        ? [...prev.selectedUsers, value]
        : prev.selectedUsers.filter((user) => user !== value);
        console.log(selectedUsers);
      return { ...prev, selectedUsers };
    });
  };

  const handleSubmit = async (e) => {
        e.preventDefault();
        try {
                await axios.put(`http://localhost:8000/api/project/${id}`,{ 
                selectedUsers: formData.selectedUsers ,
                headers: {
                    'Content-Type': 'application/json'
                }
            },{ 
                withCredentials: true 
            });
            alert('Users assigned successfully!');
            navigate('/projects-list');
            
        } 
        catch (error) {
            console.error('Error assigning users:', error);
        }
  };

  const fetchProjectUsers = async () => {
    try {
      const response = await axios.get(`http://localhost:8000/api/project/${id}`, {
        withCredentials: true
      });
      setProjectData(response.data);
    } catch (error) {
      console.error("Error fetching project users:", error);
    }
  };

  useEffect(() => {
    fetchProjectUsers();
  }, [id]);

  return (
    <div
      className="container-fluid vh-100 d-flex align-items-center justify-content-center"
      style={{ backgroundColor: "#f4f6f9" }}
    >
      <div
        className="card shadow-lg"
        style={{
          width: "500px",
          maxHeight: "90vh",
          overflowY: "auto",
          borderRadius: "15px"
        }}
      >
        <div className="card-header bg-dark text-white text-center">
          <h4 className="mb-0">Assign Users to Project</h4>
        </div>

        <div className="card-body p-4">
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <h5 className="text-primary mb-3">Project Details</h5>
              <div className="row">
                <div className="col-md-12">
                  <label className="form-label">Project Name</label>
                  <input
                    type="text"
                    className="form-control"
                    value={projectData.project.name}
                    readOnly
                  />
                </div>
                <div className="col-md-12">
                  <label className="form-label">Department</label>
                  <input
                    type="text"
                    className="form-control"
                    value={projectData.project.department}
                    readOnly
                  />
                </div>
                <div className="col-md-12">
                  <label className="form-label">Business Unit</label>
                  <input
                    type="text"
                    className="form-control"
                    value={projectData.project.business_unit}
                    readOnly
                  />
                </div>
              </div>
            </div>

        
            <div className="mb-4">
            <h5 className="text-primary mb-3">User Assignment</h5>
            <div className="row">
                <div className="col-md-12">
                <ul 
                    className="list-group" 
                    style={{ 
                    maxHeight: '200px', 
                    overflowY: 'auto', 
                    }}
                >
                    {projectData.users.map((user, index) => (
                    <li
                        key={index}
                        className="list-group-item d-flex justify-content-between align-items-center"
                    >
                        <span>{user.username}</span>
                        <input
                        type="checkbox"
                        value={user.username}
                        checked={formData.selectedUsers.includes(user.username)}
                        onChange={handleCheckboxChange}
                        />
                    </li>
                    ))}
                </ul>
                {formData.selectedUsers.length > 0 && (
                    <div className="mt-2 text-muted small">
                    {formData.selectedUsers.length} user(s) selected
                    </div>
                )}
                </div>
            </div>
            </div>

            
            <div className="d-grid mt-3">
              <button
                type="submit"
                className="btn btn-primary btn-lg"
                disabled={formData.selectedUsers.length === 0}
              >
                Assign {formData.selectedUsers.length} User(s) to Project
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AssignUsers;