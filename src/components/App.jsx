import React, { useState } from 'react';
import Manager from './Manager';
import User from './User';

export const App = () => {
  const [role, setRole] = useState('');

  const handleRoleChange = (e) => {
    setRole(e.target.value);
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Chat Widget</h1>
      </header>
      <div>
        <label>
          <input
            type="radio"
            value="manager"
            checked={role === 'manager'}
            onChange={handleRoleChange}
          />
          Manager
        </label>
        <label>
          <input
            type="radio"
            value="user"
            checked={role === 'user'}
            onChange={handleRoleChange}
          />
          User
        </label>
      </div>
      {role === 'manager' && <Manager />}
      {role === 'user' && <User />}
    </div>
  );
};
