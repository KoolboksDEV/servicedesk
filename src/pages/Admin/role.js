import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import logo3 from '../../image/sath.png';
import logo6 from '../../image/dd.png'
import '@fortawesome/fontawesome-free/css/all.min.css';
import '../Admin/admin.css';
import axios from 'axios';
import logo4 from '../../image/Vector.png';
import { FaTasks, FaCogs, FaUsers, FaBox, FaSignOutAlt } from 'react-icons/fa';

const Role = () => {
  const [activeItem, setActiveItem] = useState('');
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [newRole, setNewRole] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserRole, setNewUserRole] = useState('');
  const [newUserName, setNewUserName] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const userEmail = 'unnamani@saconsulting.ai';

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const response = await axios.get('https://sathservicedesk-sathservicedesk-staging-dpdaa2a3dkd7e7as.eastus2-01.azurewebsites.net/get-roles', {
          headers: { userEmail },
        });
        setRoles(response.data.users);
      } catch (err) {
        setError('Failed to load roles');
      } finally {
        setLoading(false);
      }
    };

    fetchRoles();
  }, []);

  const handleUpdateRole = async (userId) => {
    try {
      await axios.put(`https://sathservicedesk-sathservicedesk-staging-dpdaa2a3dkd7e7as.eastus2-01.azurewebsites.net/${userId}/${newRole}`, {}, {
        headers: { userEmail },
      });
      alert('Role updated successfully');
      setNewRole('');
    } catch (err) {
      alert('Failed to update role');
    }
  };

  const handleAssignRole = async () => {
    try {
      await axios.put('https://sathservicedesk-sathservicedesk-staging-dpdaa2a3dkd7e7as.eastus2-01.azurewebsites.net/assign-role', {
        email: newUserEmail,
        role: newUserRole,
        name: newUserName,
      }, {
        headers: {
          userEmail,
          'Content-Type': 'application/json',
        },
      });
      alert('Role assigned successfully');
      setNewUserEmail('');
      setNewUserRole('');
      setNewUserName('');
      setIsModalOpen(false);
    } catch (err) {
      alert('Failed to assign role');
    }
  };

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);



  return (
    <div className="dashboard-container">
      <div className="left-sidebar">
      <div className="dashboard-log">
        <img src={logo3} alt="ServiceDesk Logo" />
      </div>
      <div className="sidebar-options">
        <Link to='/admin' onClick={() => setActiveItem('Request')}>
          <div className={`sidebar-item ${activeItem === 'Request' ? 'active' : ''}`}>
            <FaTasks />
            <p>Request</p>
          </div>
        </Link>
        <Link to='/services' onClick={() => setActiveItem('IT Services')}>
          <div className={`sidebar-item ${activeItem === 'IT Services' ? 'active' : ''}`}>
            <FaCogs />
            <p>IT Services</p>
          </div>
        </Link>
        <Link to='/roles' onClick={() => setActiveItem('Roles')}>
          <div className={`sidebar-item ${activeItem === 'Roles' ? 'active' : ''}`}>
            <FaUsers />
            <p>Roles</p>
          </div>
        </Link>
        <Link to='/admtask' onClick={() => setActiveItem('Task')}>
          <div className={`sidebar-item ${activeItem === 'Task' ? 'active' : ''}`}>
            <FaTasks />
            <p>Task</p>
          </div>
        </Link>
        <Link to='/asset' onClick={() => setActiveItem('Asset')}>
          <div className={`sidebar-item ${activeItem === 'Asset' ? 'active' : ''}`}>
            <FaBox />
            <p>Asset</p>
          </div>
        </Link>
        <div className="sidebar-item logout">
          <FaSignOutAlt />
          <p>Logout</p>
        </div>
      </div>
    </div>
      <div className="dashboards-content">
      <div className="dashboard-header-wrappers">
       
       <div className="dashboard-user">
 <img src={logo6} alt="User Avatar" className="user-avatar"/>
 <div className="user-details">
   <p className="user-name">Vincent Edobor</p>
   <span className="user-role">Admin</span>
 </div>
 <button className="dropdown-button">
   <i className="arrow-down"></i>
 </button>
</div>

     </div>
        <div className='dash'>
          <div className='dashboard-header'>
            <h1 className="dashboard-headers">User Roles</h1>
          </div>
          <div className="dashboard-action-buttons">
            {/* <button className="dashboard-btn">Create New Request</button> */}
            <button onClick={openModal} className="dashboard-btn">Assign New Role</button>
            <Link to=''> <img className='chat-icon' src={logo4} alt="Chat Icon" /></Link>
    
        
          </div>
        </div>
        
       

        {isModalOpen && (
          <div className="modal">
            <div className="modal-content">
              <span className="close-button" onClick={closeModal}>&times;</span>
              <h3>Assign New Role</h3>
              <input
                type="text"
                value={newUserName}
                onChange={(e) => setNewUserName(e.target.value)}
                placeholder="Enter user name"
              />
              <input
                type="email"
                value={newUserEmail}
                onChange={(e) => setNewUserEmail(e.target.value)}
                placeholder="Enter user email"
              />
              <input
                type="text"
                value={newUserRole}
                onChange={(e) => setNewUserRole(e.target.value)}
                placeholder="Enter new role"
              />
              <button onClick={handleAssignRole}>Assign Role</button>
            </div>
          </div>
        )}
        <div className="dashboard-requests-section">
        <table className="role-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {roles.map((user) => (
              <tr key={user.id}>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.role || 'No role assigned'}</td>
                <td>
                  <button onClick={() => setSelectedUserId(user.id)} className="update-button">Update Role</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>

        {selectedUserId && (
          <div className="role-form">
            <h3>Update Role for {roles.find(user => user.id === selectedUserId).name}</h3>
            <input
              type="text"
              value={newRole}
              onChange={(e) => setNewRole(e.target.value)}
              placeholder="Enter new role"
            />
            <button onClick={() => handleUpdateRole(selectedUserId)}>Update Role</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Role;
