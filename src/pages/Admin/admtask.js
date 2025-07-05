import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import logo3 from '../../image/sath.png';
import logo4 from '../../image/Vector.png';
import '@fortawesome/fontawesome-free/css/all.min.css';
import '../Task/task.css'
import logo6 from '../../image/dd.png'
import { FaTasks, FaCogs, FaUsers, FaBox, FaSignOutAlt } from 'react-icons/fa';

const AdminTask = () => {
  const [activeItem, setActiveItem] = useState('');
  const [task, setTask] = useState(null);
  const [allTasks, setAllTasks] = useState([]);
  const [taskId, setTaskId] = useState('');
  const [message, setMessage] = useState('');
  const [showTaskDetails, setShowTaskDetails] = useState(false);
  const [activeModal, setActiveModal] = useState(null);
  const [submissionStatus, setSubmissionStatus] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [subject, setSubject] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('');
  const [priority, setPriority] = useState('');
  const [escalationType, setEscalationType] = useState('');
  const [categories, setCategories] = useState([]);
  const [filterStatus, setFilterStatus] = useState('all');

  const userEmail = 'vedobor@saconsulting.ai';

  useEffect(() => {
    fetchAllTasks();
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch('https://sathservicedesk-sathservicedesk-staging-dpdaa2a3dkd7e7as.eastus2-01.azurewebsites.net/get-categories', {
        method: 'GET',
        headers: { 'userEmail': userEmail },
      });
      if (!response.ok) throw new Error('Failed to fetch categories');
      const data = await response.json();
      setCategories(data.categories);
    } catch (error) {
      console.error('Error fetching categories:', error);
      setSubmissionStatus({ type: 'error', message: 'Failed to load categories.' });
    }
  };

  const fetchAllTasks = async () => {
    try {
      const response = await axios.get('https://sathservicedesk-sathservicedesk-staging-dpdaa2a3dkd7e7as.eastus2-01.azurewebsites.net/get-all-tasks', {
        headers: { userEmail: userEmail },
      });
      setAllTasks(response.data.tasks);
    } catch (error) {
      setMessage('Failed to retrieve all tasks. Please refresh the page or try again later.');
    }
  };

  const fetchTaskById = async () => {
    try {
      const response = await axios.get(`https://sathservicedesk-sathservicedesk-staging-dpdaa2a3dkd7e7as.eastus2-01.azurewebsites.net/get-task/${taskId}`, {
        headers: { userEmail: userEmail },
      });
      setTask(response.data.task);
      setShowTaskDetails(true);
    } catch (error) {
      setMessage('Unable to fetch task. Please check the Task ID and try again.');
    }
  };

  const deleteTaskById = async () => {
    try {
      await axios.delete(`https://sathservicedesk-sathservicedesk-staging-dpdaa2a3dkd7e7as.eastus2-01.azurewebsites.net/delete-task/${taskId}`, {
        headers: { userEmail: userEmail },
      });
      setMessage('Task successfully deleted.');
      fetchAllTasks();
      setShowTaskDetails(false);
    } catch (error) {
      setMessage('Error deleting the task. Please ensure the Task ID is correct and try again.');
    }
  };

  const updateTaskStatus = async () => {
    try {
      await axios.put(`https://sathservicedesk-sathservicedesk-staging-dpdaa2a3dkd7e7as.eastus2-01.azurewebsites.net/update-task-status/${taskId}`, {}, {
        headers: { userEmail: userEmail },
      });
      setMessage("Task status updated to 'Complete'.");
      fetchAllTasks();
      setShowTaskDetails(false);
    } catch (error) {
      setMessage('Error updating task status. Please try again.');
    }
  };

  const handleCreateRequestSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const response = await fetch('https://sathservicedesk-sathservicedesk-staging-dpdaa2a3dkd7e7as.eastus2-01.azurewebsites.net/create-request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'userEmail': userEmail },
        body: JSON.stringify({ subject, content, category, priority, escalation_type: escalationType }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create request');
      }

      setSubmissionStatus({ type: 'success', message: 'Request successfully created!' });
      setSubject('');
      setContent('');
      setCategory('');
      setPriority('');
      setEscalationType('');
    } catch (error) {
      setSubmissionStatus({ type: 'error', message: error.message || 'Failed to create request. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCloseModal = () => {
    setActiveModal(null);
  };

  const filteredTasks = allTasks.filter(task => {
    if (filterStatus === 'complete') {
      return task.status === 'Complete';
    } else if (filterStatus === 'incomplete') {
      return task.status !== 'Complete';
    }
    return true; // Show all tasks for 'all'
  });

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
        <div >
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
                
                <h1 className="ticket-list">Task List</h1>
                {/* <Link to='/agent'><h1 className="task-list">Ticket List</h1></Link> */}
                </div>
            <div className="dashboard-action-buttons">
              <button onClick={() => setActiveModal('create')} className="dashboard-btn">Create New Request</button>
              <Link to='/admin'><img className='chat-icon' src={logo4} alt="Chat Icon" /></Link>
            </div>
          </div>
          
          {/* Create Request Modal */}
          {activeModal === 'create' && (
            <div className="modal-overlay">
              <div className="modal-content">
                <button className="modal-close-btn" onClick={handleCloseModal}>×</button>
                <h1>Create a Request</h1>
                {submissionStatus && (
                  <div className={`status-message ${submissionStatus.type}`}>
                    {submissionStatus.message}
                  </div>
                )}
                <form onSubmit={handleCreateRequestSubmit} className="create-request-form">
                  {/* Form fields... */}
                  <button type="submit" className="submit-btn" disabled={isSubmitting}>
                    {isSubmitting ? 'Submitting...' : 'Submit'}
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* Task Management Section */}
          <div className="dashboard-requests-section">
            <div className="task-content">
              <div className="manage-tasks">
                {/* <div className="filters-search-wrapper">
                  <div className="filter-section">
                    <button className="filter-icon">🔍</button>
                    <select className="filter-dropdown"
                      value={filterStatus}
                      onChange={(e) => setFilterStatus(e.target.value)}
                    >
                      <option value="all">All</option>
                      <option value="complete">Complete</option>
                      <option value="incomplete">Incomplete</option>
                    </select>
                  </div>
                  <div className="search-wrapper">
                    <input
                      type="text"
                      value={taskId}
                      onChange={(e) => setTaskId(e.target.value)}
                      placeholder="Enter Task ID"
                      className="search-input"
                    />
                    <button onClick={fetchTaskById} className="dashboard-btn">search</button>
                  </div>
                </div> */}

                <div className="task-table-section">
                  {filteredTasks.length > 0 ? (
                    <table className="task-table">
                      <thead>
                        <tr>
                          <th>Request ID</th>
                          <th>Task</th>
                          <th>Task ID</th>
                          <th>Status</th>
                          <th>Due Date</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredTasks.map((task) => (
                          <tr key={task.id}>
                            <td>MNTRQ00{task.request_id}</td>
                            <td>{task.task}</td>
                            <td>MNT00{task.id}</td>
                            <td>{task.status}</td>
                            <td>{task.due_date}</td>
                            <td>
                              <button 
                                className="task-button"
                                onClick={() => {
                                  setTask(task);
                                  setShowTaskDetails(true);
                                }}
                              >
                                View Task
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  ) : (
                    <p>Loading Task.</p>
                  )}
                </div>
              </div>

              {/* Task Details Modal */}
              {showTaskDetails && task && (
                <div className="modal-overlay">
                  <div className="details-modal-content">
                    <button className="details-modal-close-btn" onClick={() => setShowTaskDetails(false)}>×</button>
                    
                      <h4>Task Details</h4>
                      <table>
                        <tbody>
                            <tr>
                            <td><strong>ID:</strong></td>
                            <td>MNT00{task.id}</td>
                            </tr>
                            <tr>
                            <td><strong>Request ID:</strong></td>
                            <td>MNTRQ00{task.request_id}</td>
                            </tr>
                            <tr>
                            <td><strong>Task:</strong></td>
                            <td>{task.task}</td>
                            </tr>
                            <tr>
                            <td><strong>Status:</strong></td>
                            <td>{task.status}</td>
                            </tr>
                            <tr>
                            <td><strong>Due Date:</strong></td>
                            <td>{task.due_date}</td>
                            </tr>
                            <tr>
                            <td><strong>Created Date:</strong></td>
                            <td>{task.created_date}</td>
                            </tr>
                        </tbody>
                    </table>
                        <div className='bt'>
                        <button onClick={deleteTaskById} className="details-modal-btn" style={{ marginRight: '20px' }}>Delete Task</button>
                        <button onClick={updateTaskStatus} className="details-modal-btn">Complete Task</button>
                        </div>
                     
                
                  </div>
                </div>
              )}

              {message && <p className="message">{message}</p>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminTask;
