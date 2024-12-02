import { Link , useNavigate} from "react-router-dom";
import axios from "axios";

function UserNavBar() {

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
            <div className="sidebar" style={{ width: '250px', backgroundColor: '#343a40', color: 'white' }}>
                <h4 className="p-3">User Menu</h4>
                <Link to={'/user-dashboard'} className="sidebar-link">Dashboard</Link>
                <Link to={'/user-profile'} className="sidebar-link">My Profile</Link>
                <Link to={'/user-projects'} className="sidebar-link">My Projects</Link>
                <Link to={'/user-tasks'} className="sidebar-link">My Tasks</Link>
                <Link to={'/user-logs'} className="sidebar-link">My Time Logs</Link>
                <Link onClick={handleLogout} className="sidebar-link">Logout</Link>
            </div>
        </>
    );
}

export default UserNavBar;