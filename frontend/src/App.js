import React, { useState, useEffect } from 'react';
import './App.css';
import UserForm from './components/UserForm';
import UserList from './components/UserList';

function App() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/users`);
      if (!response.ok) {
        throw new Error('Failed to fetch users');
      }
      const data = await response.json();
      setUsers(data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const addUser = (newUser) => {
    setUsers([newUser, ...users]);
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>MERN Docker Lab - User Management</h1>
        <p>Containerized Full-Stack Application</p>
      </header>
      
      <main className="App-main">
        <div className="container">
          <div className="form-section">
            <UserForm onUserAdded={addUser} apiBaseUrl={API_BASE_URL} />
          </div>
          
          <div className="list-section">
            <UserList 
              users={users} 
              loading={loading} 
              error={error}
              onRefresh={fetchUsers}
            />
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;