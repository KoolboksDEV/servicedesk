import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import logo3 from '../../image/koolboks.png';
import logo4 from '../../image/Vector.png';
import logo5 from '../../image/Filter_icon-removebg-preview.png'
import '@fortawesome/fontawesome-free/css/all.min.css';
import '../Agent/agent.css';
import { FaEye, FaTimes } from 'react-icons/fa';
import logo6 from '../../image/dd.png'
import { FaTasks, FaCogs, FaUsers, FaBox, FaSignOutAlt } from 'react-icons/fa';



const Agent = () => {
  const [activeItem, setActiveItem] = useState('');
  const [taskDetails, setTaskDetails] = useState(null);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [loadingTask, setLoadingTask] = useState(false);
  const [taskCreationMessage, setTaskCreationMessage] = useState('');
  const [newTask, setNewTask] = useState('');
  const [completionTimeHours, setCompletionTimeHours] = useState('');
    const [activeFilterDropdown, setActiveFilterDropdown] = useState(false);
    const [showCreateTaskModal, setShowCreateTaskModal] = useState(false);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [requestId, setRequestId] = useState('');
  const [requestDetails, setRequestDetails] = useState(null);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [detailsError, setDetailsError] = useState(null);
  const [activeModal, setActiveModal] = useState(null); 
  const [serviceTypeFilter, setServiceTypeFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  // State for CreateRequestPage
  const [subject, setSubject] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('');
  const [priority, setPriority] = useState('');
  const [escalationType, setEscalationType] = useState('');
  const [categories, setCategories] = useState([]);
  const [submissionStatus, setSubmissionStatus] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const userEmail = 'vedobor@saconsulting.ai';
  const userName = 'Pending'; 
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState(null);
const [filters, setFilters] = useState({
  serviceType: '',
  status: '',
  priority: '',
});

// Function to handle filter selection
// const handleFilterSelection = (filter) => {
//   setSelectedFilter(filter);
// };

const openFilterModal = () => {
    setIsModalOpen(true);
  };
  
  const closeFilterModal = () => {
    setIsModalOpen(false);
  };
 
  const openCreateTaskModal = (request) => {
    setSelectedRequest(request); // Set the selected request
    setShowCreateTaskModal(true);
  };
  
  useEffect(() => {
    const fetchData = async () => {
      const endpoint = 'https://sathservicedesk-sathservicedesk-staging-dpdaa2a3dkd7e7as.eastus2-01.azurewebsites.net/get-requests';
      try {
        const response = await axios.get(endpoint, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer your-auth-token',
            'userEmail': userEmail,
            'userName': userName
          }
        });
        setRequests(response.data.requests);
      } catch (error) {
        setError(error.message);
        handleErrorModal(error.response?.status || error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);
  const filteredRequests = requests.filter(request => {
    const matchesServiceType = serviceTypeFilter ? request.service_type === serviceTypeFilter : true;
    const matchesStatus = statusFilter ? request.status === statusFilter : true;
    const matchesPriority = priorityFilter ? request.priority === priorityFilter : true;

    return matchesServiceType && matchesStatus && matchesPriority;
  });
 
  const fetchRequestById = async (id) => {
    setDetailsLoading(true);
    const endpoint = `https://sathservicedesk-sathservicedesk-staging-dpdaa2a3dkd7e7as.eastus2-01.azurewebsites.net/get-request/${id}`;
    try {
      const response = await axios.get(endpoint, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer your-auth-token',
          'userEmail': userEmail,
          'userName': userName
        }
      });

      setRequestDetails(response.data.request);
      setActiveModal('details');
    } catch (error) {
      setDetailsError(error.message);
      handleErrorModal(error.response?.status || error.message);
    } finally {
      setDetailsLoading(false);
    }
  };

  const handleErrorModal = (status) => {
    let message = '';
    switch (status) {
      case 404:
        message = 'Request not found. Please check the Request ID and try again.';
        break;
      case 403:
        message = 'You do not have permission to access this request.';
        break;
      case 500:
        message = 'Internal Server Error. Please try again later.';
        break;
      default:
        message = 'An error occurred. Please try again later.';
        break;
    }
    setErrorMessage(message);
    setActiveModal('error'); 
  };

  const handleSearch = () => {
    if (requestId) {
      fetchRequestById(requestId);
    }
  };

  const handleCloseModal = () => {
    setActiveModal(null); // Close all modals
    setRequestDetails(null);
  };

  // CreateRequestPage logic
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('https://sathservicedesk-sathservicedesk-staging-dpdaa2a3dkd7e7as.eastus2-01.azurewebsites.net/get-categories', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'userEmail': userEmail,
            'userName': userName
          },
        });
        if (!response.ok) throw new Error('Failed to fetch categories');
        const data = await response.json();
        setCategories(data.categories);
      } catch (error) {
        console.error('Error fetching categories:', error);
        setSubmissionStatus({ type: 'error', message: 'Failed to load categories.' });
      }
    };

    fetchCategories();
  }, []);
  

  const handleCreateRequestSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch('https://sathservicedesk-sathservicedesk-staging-dpdaa2a3dkd7e7as.eastus2-01.azurewebsites.net/create-request', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'userEmail': userEmail,
          'userName': userName
        },
        body: JSON.stringify({
          subject,
          content,
          category,
          priority,
          escalation_type: escalationType 
        }),
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
      console.error('Error creating request:', error);
      setSubmissionStatus({ type: 'error', message: error.message || 'Failed to create request. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };
  const handleCloseRequest = async (requestId) => {
    try {
      await axios.put(`https://sathservicedesk-sathservicedesk-staging-dpdaa2a3dkd7e7as.eastus2-01.azurewebsites.net/close-request/${requestId}`, {}, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer your-auth-token',
          'userEmail': userEmail,
          'userName': userName
        }
      });
      setRequests(requests.map((request) =>
        request.id === requestId ? { ...request, status: 'Closed' } : request
      ));
      setError(null);
    } catch (err) {
      if (err.response && err.response.status === 403) {
        setError('Forbidden access or insufficient permissions to close this request.');
      } else if (err.response && err.response.status === 404) {
        setError('Request not found or already closed.');
      } else {
        setError('Failed to close the request. Please try again later.');
      }
    }
  };
  const handleCreateTask = async (requestId) => {
    const completionTimeHoursNumber = Number(completionTimeHours);
    setLoadingTask(true);
    try {
      await axios.post('https://sathservicedesk-sathservicedesk-staging-dpdaa2a3dkd7e7as.eastus2-01.azurewebsites.net/create-task', {
        task: newTask,
        request_id: requestId,
        completion_time_hours: completionTimeHoursNumber,
      }, {
        headers: {
          'Content-Type': 'application/json',
          'userEmail': userEmail,
            'userName': userName
        }
      });
      setTaskCreationMessage('Task created successfully.');
      setNewTask('');
      setCompletionTimeHours('');
    } catch (err) {
      setTaskCreationMessage('Failed to create task. Please try again later.');
    } finally {
      setLoadingTask(false);
    }
  };
  return (
    
       <div className="dashboard-container">
   <div className="left-sidebar">
      <div className="dashboard-log">
        <img src={logo3} alt="ServiceDesk Logo"/>
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
   <span className="user-role">Agent</span>
 </div>
 <button className="dropdown-button">
   <i className="arrow-down"></i>
 </button>
</div>

     </div>
        <div className='dash'>
            <div className='dashboard-header'>
                
            <h1 className="dashboard-headers">Ticket List</h1>
            <Link to='/task'><h1 className="task-list">Task List</h1></Link>
            </div>
            <div className="dashboard-action-buttons">
              <button onClick={() => setActiveModal('create')} className="dashboard-btn">Create New Request</button>
              <Link to=''> <img className='chat-icon' src={logo4} alt="Chat Icon" /></Link>
            </div>
          </div>

<div className="filters-search-wrapper">
<div className="filter-section">
    <img className="filter-img" src={logo5} alt="Filter Logo" />
    
    <div className="separator"></div> {/* Vertical line separator */}
    
    <button className="filter-button" onClick={openFilterModal}>
      Filter By
    </button>
    
    <div className="separator"></div> {/* Vertical line separator */}
    
    {isModalOpen && (
      <div className="modal-overlays">
        <div className="modal-contents">
          <button className="modal-close-btns" onClick={closeFilterModal}>×</button>
      <div className="filter-dropdown">
        <div className="filter-item">
          <label htmlFor="serviceType">Service Type</label>
          <select id="serviceType" value={serviceTypeFilter} onChange={(e) => setServiceTypeFilter(e.target.value)}>
            <option value="">All</option>
            <option value="service request">Service Request</option>
            <option value="Incident">Incident</option>
          </select>
        </div>

        <div className="filter-item">
          <label htmlFor="status">Status</label>
          <select id="status" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="">All</option>
            <option value="open">Open</option>
            <option value="closed">Closed</option>
          </select>
        </div>

        <div className="filter-item">
          <label htmlFor="priority">Priority</label>
          <select id="priority" value={priorityFilter} onChange={(e) => setPriorityFilter(e.target.value)}>
            <option value="">All</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>
      </div>
    </div>
    </div>
    )}

   

<button className="reset-filter-button" onClick={() => {
      setServiceTypeFilter('');
      setStatusFilter('');
      setPriorityFilter('');
      setActiveFilterDropdown(false); // Close dropdown on reset
    }}>
      <span className="reset-icon">↻</span> Reset Filter
    </button>
  </div>

  {/* <div className="search-wrapper">
    <div className="search-icon-wrapper">
        <i className="search-icon"></i> 
    </div>
    <input
      type="text"
      placeholder="Search"
      value={requestId}
      onChange={(e) => setRequestId(e.target.value)}
      className="search-input"
    />
    <button onClick={handleSearch}>Search</button>
</div> */}

</div>


      <div className="dashboard-requests-section">
        <table>
          <thead>
            <tr>
              <th>ID</th>
             
              <th>Contents</th>
              <th>Service Type</th>
              <th>Status</th>
              <th>Created Date</th>
              <th>Priority</th>
              <th>Subject</th>
              <th>Technician</th>
              <th>Details</th>
            </tr>
          </thead>
          <tbody>
            {filteredRequests.map(request => (
              <tr key={request.id}>
                <td>MNTRQ00{request.id}</td>
                {/* <td>{request.category}</td> */}
                <td>{request.content}</td>
                <td>{request.service_type}</td>
                <td>{request.status}</td>
                <td>{request.created_date}</td>
                <td>{request.priority}</td>
                <td>{request.subject}</td>
                <td>{request.technician}</td>
                <div>
                <td>
        <button onClick={() => fetchRequestById(request.id)} className="view-details-btn">
          <FaEye className="eye-icon" />
        </button>
      </td>
      <td>
        <button onClick={() => handleCloseRequest(request.id)} className="close-request-btn">
          <FaTimes className="eye-icon" />
        </button>
      </td>
                </div>
              </tr>
            ))}
          </tbody>
        </table>
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
                  <div className="form-group">
                    <label htmlFor="subject">Subject</label>
                    <input
                      id="subject"
                      type="text"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="content">Content</label>
                    <textarea
                      id="content"
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="category">IT Services</label>
                    <select
                      id="category"
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      required
                    >
                      <option value="" disabled>Select a category</option>
                      {categories.map((cat) => (
                        <option key={cat.id} value={cat.category}>{cat.category}</option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label htmlFor="priority">Priority</label>
                    <select
                      id="priority"
                      value={priority}
                      onChange={(e) => setPriority(e.target.value)}
                      required
                    >
                      <option value="" disabled>Select priority</option>
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label htmlFor="escalationType">Escalation Type</label>
                    <select
                      id="escalationType"
                      value={escalationType}
                      onChange={(e) => setEscalationType(e.target.value)}
                      required
                    >
                      <option value="" disabled>Select escalation type</option>
                      <option value="incident">Incident</option>
                      <option value="service request">Service Request</option>
                    </select>
                  </div>
                  {isSubmitting ? (
                    <button type="button" className="submit-btn submitting-btn" disabled>Submitting...</button>
                  ) : (
                    <button type="submit" className="submit-btn">Submit</button>
                  )}
                </form>
              </div>
            </div>
          )}

         {/* Details Modal */}
{activeModal === 'details' && requestDetails && (
  <div className="modal-overlay">
    <div className="details-modal-content">
      <button className="details-modal-close-btn" onClick={handleCloseModal}>×</button>
      <h2>Request Details</h2>
      <table>
        <tbody>
          <tr>
            <td>ID:</td>
            <td>MNTRQ00{requestDetails.id}</td>
          </tr>
          <tr>
            <td>Category:</td>
            <td>{requestDetails.category}</td>
          </tr>
          <tr>
            <td>Status:</td>
            <td>{requestDetails.status}</td>
          </tr>
          <tr>
            <td>Requester Name:</td>
            <td>{requestDetails.requester_name}</td>
          </tr>
          <tr>
            <td>Request Email:</td>
            <td>{requestDetails.requester_email}</td>
          </tr>
          <tr>
            <td>Created Date:</td>
            <td>{requestDetails.created_date}</td>
          </tr>
          <tr>
            <td>Due Date:</td>
            <td>{requestDetails.due_date}</td>
          </tr>
          <tr>
            <td>Priority:</td>
            <td>{requestDetails.priority}</td>
          </tr>
          <tr>
            <td>Subject:</td>
            <td>{requestDetails.subject}</td>
          </tr>
          <tr>
            <td>Technician:</td>
            <td>{requestDetails.technician}</td>
          </tr>
          <tr>
            <td>Updated Date:</td>
            <td>{requestDetails.updated_date}</td>
          </tr>
        </tbody>
      </table>
      <button onClick={() => openCreateTaskModal(requestDetails)} className="details-modal-btn">
  Create Task
</button>

    </div>
  </div>
)}

{/* Create Task Modal */}
{showCreateTaskModal && (
  <div className="modal-overlay">
    <div className="details-modal-content">
      <button className="details-modal-close-btn" onClick={() => setShowCreateTaskModal(false)}>×</button>
      <h2>Create Task</h2>
      <div className="create-task-form">
        <div className="form-group">
          <label htmlFor="task">Task</label>
          <input
            id="task"
            type="text"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="completionHours">Completion Hours</label>
          <input
            id="completionHours"
            type="number"
            value={completionTimeHours}
            onChange={(e) => setCompletionTimeHours(e.target.value)}
            required
          />
        </div>
        <button
  onClick={() => {
    if (selectedRequest) {
      handleCreateTask(selectedRequest.id);
      setShowCreateTaskModal(false);
    } else {
      console.error('No request selected!');
    }
  }}
  className="details-modal-btn"
>
  {loadingTask ? 'Creating...' : 'Create Task'}
</button>

        {taskCreationMessage && <p className="task-creation-message">{taskCreationMessage}</p>}
      </div>
    </div>
  </div>
)}
 {/* Unique Task Details Modal */}
 {taskDetails && (
    <div className="modal-overlay">
      <div className="details-modal-content">
        <button className="details-modal-close-btn" onClick={() => setTaskDetails(null)}>×</button>
        <h2>Task Details</h2>
        <table>
          <tbody>
            <tr>
              <td>ID:</td>
              <td>MNT00{taskDetails.id}</td>
            </tr>
            <tr>
              <td>Task:</td>
              <td>{taskDetails.task}</td>
            </tr>
            <tr>
              <td>Status:</td>
              <td>{taskDetails.status}</td>
            </tr>
            <tr>
              <td>Completion Hour:</td>
              <td>{taskDetails.completion_hour}</td>
            </tr>
          </tbody>
        </table>
        <button className="details-modal-btn" onClick={() => setTaskDetails(null)}>Close</button>
      </div>
    </div>
  )}

          {/* Error Modal */}
          {activeModal === 'error' && (
            <div className="modal-overlay">
              <div className="modal-content">
                <button className="modal-close-btn" onClick={handleCloseModal}>×</button>
                <h2>Error</h2>
                <p>{errorMessage}</p>
                <button className="dashboard-btn" onClick={handleCloseModal}>Close</button>
              </div>
            </div>
          )}
        
      </div>
    </div>
  );
};

export default Agent;


