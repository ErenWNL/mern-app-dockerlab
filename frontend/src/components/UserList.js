import React from 'react';
import './UserList.css';

const UserList = ({ users, loading, error, onRefresh }) => {
  if (loading) {
    return <div className="user-list loading">Loading users...</div>;
  }

  if (error) {
    return (
      <div className="user-list error">
        <p>Error: {error}</p>
        <button onClick={onRefresh} className="refresh-btn">Try Again</button>
      </div>
    );
  }

  return (
    <div className="user-list">
      <div className="list-header">
        <h2>Users ({users.length})</h2>
        <button onClick={onRefresh} className="refresh-btn">Refresh</button>
      </div>

      {users.length === 0 ? (
        <p className="no-users">No users found. Add some users to get started!</p>
      ) : (
        <div className="users-grid">
          {users.map((user) => (
            <div key={user._id} className="user-card">
              <h3>{user.name}</h3>
              <p><strong>Email:</strong> {user.email}</p>
              <p><strong>Phone:</strong> {user.phone}</p>
              <p><strong>Age:</strong> {user.age}</p>
              <p><strong>Address:</strong> {user.address}</p>
              <p className="timestamp">
                Added: {new Date(user.createdAt).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserList;