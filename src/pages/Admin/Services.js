import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import logo3 from '../../image/sath.png';

import '@fortawesome/fontawesome-free/css/all.min.css';
import '../../pages/Admin/services.css';
import axios from 'axios';
import { FaTasks, FaCogs, FaUsers, FaBox, FaSignOutAlt } from 'react-icons/fa';
import logo6 from '../../image/dd.png'

const Services = () => {
  const [activeItem, setActiveItem] = useState('');
  const [requests] = useState([]);
  const [setFilteredRequests] = useState([]);
  
  const [errorMessage] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categories, setCategories] = useState([]);
  const [newCategories, setNewCategories] = useState('');
  const [message, setMessage] = useState('');
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [updatedCategoryName, setUpdatedCategoryName] = useState('');

  const userEmail = 'bbusari@saconsulting.ai';

  useEffect(() => {
    

    const fetchCategories = async () => {
      try {
        const response = await axios.get('https://sathservicedesk-sathservicedesk-staging-dpdaa2a3dkd7e7as.eastus2-01.azurewebsites.net/get-categories', {
          headers: {
            userEmail: userEmail,
          },
        });
        setCategories(response.data.categories);
      } catch (error) {
        setMessage('Error: ' + (error.response?.data?.message || 'Failed to fetch categories'));
      }
    };

   
    fetchCategories();
  }, [userEmail]);

 

  useEffect(() => {
    if (statusFilter === 'all') {
      setFilteredRequests(requests);
    } else {
      setFilteredRequests(requests.filter(request => request.status.toLowerCase() === statusFilter));
    }
  }, [statusFilter, requests]);

  const handleInputChange = (e) => {
    setNewCategories(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        'https://sathservicedesk-sathservicedesk-staging-dpdaa2a3dkd7e7as.eastus2-01.azurewebsites.net/add-category',
        { categories: newCategories.split(',') },
        {
          headers: {
            userEmail: userEmail,
          },
        }
      );

      setMessage(response.data.message);
      setCategories([...categories, ...newCategories.split(',').map((name) => ({
        id: categories.length + 1,
        category: name.trim(),
      }))]);
      setNewCategories('');
    } catch (error) {
      setMessage('Error: ' + (error.response?.data?.message || 'Failed to add categories'));
    }
  };

  const handleDeleteCategory = async (id) => {
    try {
      const response = await axios.delete(`https://sathservicedesk-sathservicedesk-staging-dpdaa2a3dkd7e7as.eastus2-01.azurewebsites.net/delete-category/${id}`, {
        headers: {
          userEmail: userEmail,
        },
      });

      setMessage(response.data.message);
      setCategories(categories.filter((category) => category.id !== id));
    } catch (error) {
      setMessage('Error: ' + (error.response?.data?.message || 'Failed to delete category'));
    }
  };

  const handleUpdateCategory = async (id) => {
    try {
      const response = await axios.put(
        `https://sathservicedesk-sathservicedesk-staging-dpdaa2a3dkd7e7as.eastus2-01.azurewebsites.net/${id}/${updatedCategoryName}`,
        {},
        {
          headers: {
            userEmail: userEmail,
          },
        }
      );

      setMessage(response.data.message);
      setCategories(categories.map((category) =>
        category.id === id ? { ...category, category: updatedCategoryName } : category
      ));
      setSelectedCategoryId(null);
      setUpdatedCategoryName('');
    } catch (error) {
      setMessage('Error: ' + (error.response?.data?.message || 'Failed to update category'));
    }
  };

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
            <h1 className="dashboard-headers">Manage IT Services</h1>
          </div>
          <div className="dashboard-action-buttons">
            {/* <button className="dashboard-btn">Create New Request</button> */}
            <form onSubmit={handleSubmit} className="category-form">
            <input
              type="text"
              value={newCategories}
              onChange={handleInputChange}
              placeholder="Enter a new service"
              className="category-input"
            />
            {/* <button type="submit" className="">Add IT Services</button> */}
          </form>
        
          </div>
        </div>

        
        
        <div className="dashboard-requests-section">
         
          <table>
            <thead>
              <tr>
                <th>IT Services</th>
                <th>Action</th>
                
              </tr>
            </thead>
            <tbody>
            {categories.map((category) => (
              <tr key={category.id}>
                <td>
                  {category.id === selectedCategoryId ? (
                    <div className="edit-category">
                      <input
                        type="text"
                        value={updatedCategoryName}
                        onChange={(e) => setUpdatedCategoryName(e.target.value)}
                        className="category-input"
                      />
                    </div>
                  ) : (
                    <span className="category-name">{category.category}</span>
                  )}
                </td>
                <td>
                  <div className="button-group">
                    {category.id === selectedCategoryId ? (
                      <>
                        <button onClick={() => handleUpdateCategory(category.id)} className="update-button">Update</button>
                        <button onClick={() => setSelectedCategoryId(null)} className="cancel-button">Cancel</button>
                      </>
                    ) : (
                      <>
                        <button onClick={() => setSelectedCategoryId(category.id)} className="edit-button">Edit</button>
                        <button onClick={() => handleDeleteCategory(category.id)} className="delete-button">Delete</button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
          </table>
        </div>
        
        

        
        

        {message && <p className="message">{message}</p>}
        {errorMessage && <p className="error-message">{errorMessage}</p>}
      </div>
    </div>
  );
};

export default Services;
