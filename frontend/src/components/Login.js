import React, { useState } from 'react';
import axios from 'axios';

function Login() {
  // Use state to store the username and password
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  // Handle login
  const handleLogin = async (e) => {
    e.preventDefault();
    
    const formData = {
      username,
      password,
    };

    try {
      const response = await axios.post('http://localhost:8000/api/login', formData,{
        withCredentials: true,
        headers: { 'Content-Type': 'application/json' },
      });

      const data = response.data;

      if (response.status === 201) {
        // Store token and role in localStorage
        localStorage.setItem('token', data.token);
        localStorage.setItem('role', data.user.role);  
        window.location.href = data.user.role === 'Admin' ? '/admin' : '/user-dashboard'; 
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error('Login error:', error);
      alert('An error occurred. Please try again.');
    }
  };

  return (
    <div
      className="d-flex justify-content-center align-items-center"
      style={{ height: '100vh' }}
    >
      <div className="card" style={{ width: '25rem' }}>
        <div className="card-body">
          <h5 className="card-title text-center mb-4">Login</h5>
          <form onSubmit={handleLogin}>
            <div className="mb-3">
              <label htmlFor="username" className="form-label">Username</label>
              <input
                type="text"
                className="form-control"
                id="username"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)} 
              />
            </div>

            <div className="mb-3">
              <label htmlFor="password" className="form-label">Password</label>
              <input
                type="password"
                className="form-control"
                id="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}  
                style={{ paddingRight: "40px" }}
              />
            </div>
            <div className='mt-5'>
              <button type="submit" className="btn btn-primary w-100">
                Login
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;
