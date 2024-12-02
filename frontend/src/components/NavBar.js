import { Link , useNavigate} from 'react-router-dom';
import axios from 'axios';
function NavBar() {

    const navigate = useNavigate();

    const handleLogout = async (e) => {
        e.preventDefault();
        const confirmLogout = window.confirm("Are you sure you want to logout?");
        if (!confirmLogout) {
            return; 
        }
    
        try {
            const response = await axios.get('http://localhost:8000/api/login/logout', {
                withCredentials: true,
            });
            localStorage.removeItem('token');
            localStorage.removeItem('role');
            alert(response.data.message);
            navigate('/');
        } catch (error) {
            alert("Error in logout");
        }
    };
    

    return(
        <>
            <div style={{ display: 'flex', height: '100vh', margin: '0' }}>
    
    <div 
        className="sidebar" 
        style={{
            position: 'fixed',      
            top: 0,                 
            left: 0,                
            width: '250px',         
            height: '100vh',        
            backgroundColor: '#343a40', 
            color: 'white',
            paddingTop: '20px',     
            paddingLeft: '15px'     
        }}
    >
        <h4 className="p-3">Admin Menu</h4>
        <Link to={'/admin'} className="sidebar-link">Dashboard</Link>
        <Link to={'/api/users'} className="sidebar-link">User Management</Link>
        <Link to={'/business-unit'} className="sidebar-link">Business Unit Management</Link>
        <Link to={'/departments-list'} className="sidebar-link">Department Management</Link>
        <Link to={'/projects-list'} className="sidebar-link">Project Management</Link>
        <Link to={'/tasks-list'} className="sidebar-link">Task Management</Link>
        <Link to={'/all-user-logs'} className="sidebar-link">All Logs</Link>
        <Link onClick={handleLogout} className="sidebar-link">Logout</Link>
    </div>

    
    <div className="main-content" style={{ marginLeft: '250px', padding: '20px', height: '100vh', overflowY: 'auto' }}>
        
    </div>
    </div>

        </>
    );
}

export default NavBar;