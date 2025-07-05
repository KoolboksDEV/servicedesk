// import React, { useState, useEffect } from 'react';
// import axios from 'axios';

// import { Link, useNavigate } from 'react-router-dom';

// const AssetPage = () => {
//   const [assets, setAssets] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [selectedAsset, setSelectedAsset] = useState(null);
//   const [showDeleteModal, setShowDeleteModal] = useState(false);
//   const [assetToDelete, setAssetToDelete] = useState(null);

//   const [assetForm, setAssetForm] = useState({
//     asset_name: '',
//     asset_description: '',
//     asset_owner: '',
//     asset_serial_number: '',
//     asset_status: '',
//     asset_type: '',
//     created_date: '',
//     expiry_date: ''
//   });
//   const [message, setMessage] = useState('');
//   const [submissionStatus, setSubmissionStatus] = useState(null);
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const userEmail = 'unnamani@saconsulting.ai';
//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchAssets = async () => {
//       try {
//         const response = await axios.get('https://mintservice.azurewebsites.net/get-assets', {
//           headers: {
//             'Content-Type': 'application/json',
//             'userEmail': userEmail,
//           },
//         });
//         setAssets(response.data.assets || []);
//       } catch (err) {
//         console.error('Error fetching assets:', err);
//         setError('Failed to load assets. Please try again later.');
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchAssets();
//   }, [userEmail]);

//   const handleDeleteClick = (id) => {
//     setAssetToDelete(id);
//     setShowDeleteModal(true);
//   };

//   const confirmDelete = async () => {
//     if (!assetToDelete) return;
//     try {
//       await axios.delete(`https://mintservice.azurewebsites.net/delete-asset/${assetToDelete}`, {
//         headers: {
//           'Content-Type': 'application/json',
//           'userEmail': userEmail,
//         }
//       });
//       setAssets(assets.filter(asset => asset.id !== assetToDelete));
//       setError(null);
//     } catch (err) {
//       console.error('Error deleting asset:', err);
//       setError('Failed to delete asset. Please try again later.');
//     } finally {
//       setShowDeleteModal(false);
//       setAssetToDelete(null);
//     }
//   };

//   const cancelDelete = () => {
//     setShowDeleteModal(false);
//     setAssetToDelete(null);
//   };

//   const handleViewDetails = async (id) => {
//     try {
//       const response = await axios.get(`https://mintservice.azurewebsites.net/get-asset/${id}`, {
//         headers: {
//           'Content-Type': 'application/json',
//           'userEmail': userEmail,
//         }
//       });

//       if (response.status === 200 && response.data) {
//         setSelectedAsset(response.data);
//         setAssetForm({
//           asset_name: response.data.asset_name,
//           asset_description: response.data.asset_description,
//           asset_owner: response.data.asset_owner,
//           asset_serial_number: response.data.asset_serial_number,
//           asset_status: response.data.asset_status,
//           asset_type: response.data.asset_type,
//           created_date: response.data.created_date,
//           expiry_date: response.data.expiry_date,
//         });
//         setError(null);
//       } else {
//         setError('Failed to load asset details due to an unexpected response.');
//       }
//     } catch (err) {
//       console.error('Error fetching asset details:', err);
//       setError('Failed to load asset details. Please try again later.');
//     }
//   };

//   const handleUpdateAsset = async () => {
//     if (!selectedAsset) return;
//     try {
//       await axios.put(`https://mintservice.azurewebsites.net/update-asset/${selectedAsset.id}`, {
//         ...assetForm,
//       }, {
//         headers: {
//           'Content-Type': 'application/json',
//           'userEmail': userEmail,
//         }
//       });
//       setMessage('Asset updated successfully.');
//       setSelectedAsset(null);
//     } catch (err) {
//       console.error('Error updating asset:', err);
//       setError('Failed to update asset. Please try again later.');
//     }
//   };

//   const handleChange = (e) => {
//     setAssetForm({
//       ...assetForm,
//       [e.target.name]: e.target.value
//     });
//   };

//   const handleCreateAsset = async (e) => {
//     e.preventDefault();
//     setIsSubmitting(true);

//     try {
//       const response = await fetch('https://mintservice.azurewebsites.net/create-asset', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           'userEmail': userEmail
//         },
//         body: JSON.stringify(assetForm),
//       });

//       if (!response.ok) {
//         const errorData = await response.json();
//         throw new Error(errorData.message || 'Failed to create asset');
//       }

//       setSubmissionStatus({ type: 'success', message: 'Asset successfully created!' });
//       setAssetForm({
//         asset_name: '',
//         asset_description: '',
//         asset_owner: '',
//         asset_serial_number: '',
//         asset_status: '',
//         asset_type: '',
//         created_date: '',
//         expiry_date: ''
//       });
//     } catch (error) {
//       console.error('Error creating asset:', error);
//       setSubmissionStatus({ type: 'error', message: error.message || 'Failed to create asset. Please try again.' });
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   return (
//     <div className="asset-page-container">
     
//       <div className="asset-page-content">
        

//         <div className="asset-navigation-links">
//           <button  className="asset-btn asset-btn-create">Create New Asset</button>
//         </div>

//         {loading && <p>Loading assets...</p>}
//         {error && <div className="error-message">{error}</div>}
//         {message && <div className="success-message">{message}</div>}
//         {submissionStatus && (
//           <div className={`status-message ${submissionStatus.type}`}>
//             {submissionStatus.message}
//           </div>
//         )}

//         <form onSubmit={handleCreateAsset} className="create-asset-form">
//           <h2>Create Asset</h2>
//           <div className="form-group">
//             <label>Asset Name:</label>
//             <input type="text" name="asset_name" value={assetForm.asset_name} onChange={handleChange} required />
//           </div>
//           <div className="form-group">
//             <label>Asset Description:</label>
//             <textarea name="asset_description" value={assetForm.asset_description} onChange={handleChange} required />
//           </div>
//           <div className="form-group">
//             <label>Asset Owner:</label>
//             <input type="text" name="asset_owner" value={assetForm.asset_owner} onChange={handleChange} required />
//           </div>
//           <div className="form-group">
//             <label>Asset Serial Number:</label>
//             <input type="text" name="asset_serial_number" value={assetForm.asset_serial_number} onChange={handleChange} required />
//           </div>
//           <div className="form-group">
//             <label>Asset Status:</label>
//             <input type="text" name="asset_status" value={assetForm.asset_status} onChange={handleChange} required />
//           </div>
//           <div className="form-group">
//             <label>Asset Type:</label>
//             <input type="text" name="asset_type" value={assetForm.asset_type} onChange={handleChange} required />
//           </div>
//           <div className="form-group">
//             <label>Creation Date:</label>
//             <input type="date" name="created_date" value={assetForm.created_date} onChange={handleChange} required />
//           </div>
//           <div className="form-group">
//             <label>Expiry Date:</label>
//             <input type="date" name="expiry_date" value={assetForm.expiry_date} onChange={handleChange} required />
//           </div>
//           <button type="submit" className="asset-btn" disabled={isSubmitting}>
//             {isSubmitting ? 'Submitting...' : 'Create Asset'}
//           </button>
//         </form>

//         <table className="asset-table">
//           <thead>
//             <tr>
//               <th>ID</th>
//               <th>Name</th>
//               <th>Description</th>
//               <th>Owner</th>
//               <th>Serial Number</th>
//               <th>Status</th>
//               <th>Type</th>
//               <th>Created Date</th>
//               <th>Expiry Date</th>
//               <th>Details</th>
//               <th>Delete</th>
//             </tr>
//           </thead>
//           <tbody>
//             {assets.map((asset) => (
//               <tr key={asset.id}>
//                 <td>{asset.id}</td>
//                 <td>{asset.asset_name}</td>
//                 <td>{asset.asset_description}</td>
//                 <td>{asset.asset_owner}</td>
//                 <td>{asset.asset_serial_number}</td>
//                 <td>{asset.asset_status}</td>
//                 <td>{asset.asset_type}</td>
//                 <td>{asset.created_date}</td>
//                 <td>{asset.expiry_date}</td>
//                 <td>
//                   <button onClick={() => handleViewDetails(asset.id)}>View</button>
//                 </td>
//                 <td>
//                   <button onClick={() => handleDeleteClick(asset.id)}>Delete</button>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>

//         {showDeleteModal && (
//           <div className="modal">
//             <div className="modal-content">
//               <p>Are you sure you want to delete this asset?</p>
//               <button onClick={confirmDelete}>Yes</button>
//               <button onClick={cancelDelete}>No</button>
//             </div>
//           </div>
//         )}
        
//         {selectedAsset && (
//           <div className="asset-details-modal">
//             <div className="modal-content">
//               <h3>Edit Asset Details</h3>
//               <button className="modal-close" onClick={() => setSelectedAsset(null)}>×</button>
//               <form>
//                 <label>Name:</label>
//                 <input
//                   type="text"
//                   name="asset_name"
//                   value={assetForm.asset_name}
//                   onChange={handleChange}
//                 />
//                 <label>Description:</label>
//                 <textarea
//                   name="asset_description"
//                   value={assetForm.asset_description}
//                   onChange={handleChange}
//                 />
//                 <label>Owner:</label>
//                 <input
//                   type="text"
//                   name="asset_owner"
//                   value={assetForm.asset_owner}
//                   onChange={handleChange}
//                 />
//                 <label>Serial Number:</label>
//                 <input
//                   type="text"
//                   name="asset_serial_number"
//                   value={assetForm.asset_serial_number}
//                   onChange={handleChange}
//                 />
//                 <label>Status:</label>
//                 <input
//                   type="text"
//                   name="asset_status"
//                   value={assetForm.asset_status}
//                   onChange={handleChange}
//                 />
//                 <label>Type:</label>
//                 <input
//                   type="text"
//                   name="asset_type"
//                   value={assetForm.asset_type}
//                   onChange={handleChange}
//                 />
//                 <label>Created Date:</label>
//                 <input
//                   type="date"
//                   name="created_date"
//                   value={assetForm.created_date}
//                   onChange={handleChange}
//                 />
//                 <label>Expiry Date:</label>
//                 <input
//                   type="date"
//                   name="expiry_date"
//                   value={assetForm.expiry_date}
//                   onChange={handleChange}
//                 />
//               </form>
//               <button onClick={handleUpdateAsset} className="asset-btn asset-btn-update">Update Asset</button>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default AssetPage;


import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import logo3 from '../../image/sath.png';
import logo4 from '../../image/Vector.png';
import logo6 from '../../image/dd.png'
import logo5 from '../../image/Filter_icon-removebg-preview.png'
import { FaTasks, FaCogs, FaUsers, FaBox, FaSignOutAlt } from 'react-icons/fa';

const AssetPage = () => {

  const [serviceTypeFilter, setServiceTypeFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  const [activeFilterDropdown, setActiveFilterDropdown] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState(null);

  const [activeItem, setActiveItem] = useState('');
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedAsset, setSelectedAsset] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [assetToDelete, setAssetToDelete] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false); // New state for Create Asset modal

  const [assetForm, setAssetForm] = useState({
    asset_name: '',
    asset_description: '',
    asset_owner: '',
    asset_serial_number: '',
    asset_status: '',
    asset_type: '',
    created_date: '',
    expiry_date: ''
  });
  const [message, setMessage] = useState('');
  const [submissionStatus, setSubmissionStatus] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const userEmail = 'unnamani@saconsulting.ai';
  const navigate = useNavigate();
  const handleFilterSelection = (filter) => {
    setSelectedFilter(filter);
  };
  
  const openFilterModal = () => {
      setIsModalOpen(true);
    };
    
    const closeFilterModal = () => {
      setIsModalOpen(false);
    };
   
    
    
  useEffect(() => {
    const fetchAssets = async () => {
      try {
        const response = await axios.get('https://service-desk-api-wr5e.zeet-team-devuche.zeet.app/get-assets', {
          headers: {
            'Content-Type': 'application/json',
            'userEmail': userEmail,
          },
        });
        setAssets(response.data.assets || []);
      } catch (err) {
        console.error('Error fetching assets:', err);
        setError('Failed to load assets. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchAssets();
  }, [userEmail]);

  const handleDeleteClick = (id) => {
    setAssetToDelete(id);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!assetToDelete) return;
    try {
      await axios.delete(`https://sathservicedesk-sathservicedesk-staging-dpdaa2a3dkd7e7as.eastus2-01.azurewebsites.net/delete-asset/${assetToDelete}`, {
        headers: {
          'Content-Type': 'application/json',
          'userEmail': userEmail,
        }
      });
      setAssets(assets.filter(asset => asset.id !== assetToDelete));
      setError(null);
    } catch (err) {
      console.error('Error deleting asset:', err);
      setError('Failed to delete asset. Please try again later.');
    } finally {
      setShowDeleteModal(false);
      setAssetToDelete(null);
    }
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setAssetToDelete(null);
  };

  const handleViewDetails = async (id) => {
    try {
      const response = await axios.get(`https://sathservicedesk-sathservicedesk-staging-dpdaa2a3dkd7e7as.eastus2-01.azurewebsites.net/get-asset/${id}`, {
        headers: {
          'Content-Type': 'application/json',
          'userEmail': userEmail,
        }
      });

      if (response.status === 200 && response.data) {
        setSelectedAsset(response.data);
        setAssetForm({
          asset_name: response.data.asset_name,
          asset_description: response.data.asset_description,
          asset_owner: response.data.asset_owner,
          asset_serial_number: response.data.asset_serial_number,
          asset_status: response.data.asset_status,
          asset_type: response.data.asset_type,
          created_date: response.data.created_date,
          expiry_date: response.data.expiry_date,
        });
        setError(null);
      } else {
        setError('Failed to load asset details due to an unexpected response.');
      }
    } catch (err) {
      console.error('Error fetching asset details:', err);
      setError('Failed to load asset details. Please try again later.');
    }
  };

  const handleUpdateAsset = async () => {
    if (!selectedAsset) return;
    try {
      await axios.put(`https://sathservicedesk-sathservicedesk-staging-dpdaa2a3dkd7e7as.eastus2-01.azurewebsites.net/update-asset/${selectedAsset.id}`, {
        ...assetForm,
      }, {
        headers: {
          'Content-Type': 'application/json',
          'userEmail': userEmail,
        }
      });
      setMessage('Asset updated successfully.');
      setSelectedAsset(null);
    } catch (err) {
      console.error('Error updating asset:', err);
      setError('Failed to update asset. Please try again later.');
    }
  };

  const handleChange = (e) => {
    setAssetForm({
      ...assetForm,
      [e.target.name]: e.target.value
    });
  };

  const handleCreateAsset = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch('https://sathservicedesk-sathservicedesk-staging-dpdaa2a3dkd7e7as.eastus2-01.azurewebsites.net/create-asset', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'userEmail': userEmail
        },
        body: JSON.stringify(assetForm),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create asset');
      }

      setSubmissionStatus({ type: 'success', message: 'Asset successfully created!' });
      setAssetForm({
        asset_name: '',
        asset_description: '',
        asset_owner: '',
        asset_serial_number: '',
        asset_status: '',
        asset_type: '',
        created_date: '',
        expiry_date: ''
      });
      setShowCreateModal(false); // Close modal on successful submission
    } catch (error) {
      console.error('Error creating asset:', error);
      setSubmissionStatus({ type: 'error', message: error.message || 'Failed to create asset. Please try again.' });
    } finally {
      setIsSubmitting(false);
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
            <h1 className="dashboard-headers">Asset List</h1>
            </div>
            <div className="dashboard-action-buttons">
            <button onClick={() => setShowCreateModal(true)} className="dashboard-btn">
            Create New Asset
          </button>
          <Link to=''> <img className='chat-icon' src={logo4} alt="Chat Icon" /></Link>
             
            </div>
          </div>

          
          <div className="filters-search-wrapper">
<div className="filter-section">
    <img className="filter-img" src={logo5} alt="Filter Logo" />
    
    <div className="separator"></div> 
    
    <button className="filter-button" onClick={openFilterModal}>
      Filter By
    </button>
    
    <div className="separator"></div> 
    
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
      setActiveFilterDropdown(false); 
    }}>
      <span className="reset-icon">↻</span> Reset Filter
    </button>
  </div>

  {/* <div className="search-wrapper">
    <div className="search-icon-wrapper">
        <i className="search-icon"></i> 
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
        {/* <div className="asset-navigation-links">
          <button onClick={() => setShowCreateModal(true)} className="dashboard-btn">
            Create New Asset
          </button>
        </div> */}

        {loading && <p>Loading assets...</p>}
        {error && <div className="error-message">{error}</div>}
        {message && <div className="success-message">{message}</div>}
        {submissionStatus && (
          <div className={`status-message ${submissionStatus.type}`}>
            {submissionStatus.message}
          </div>
        )}

        {showCreateModal && ( // Show modal when state is true
         <div className="modal-overlay">
         <div className="modal-content">
           <button className="modal-close-btn" onClick={() => setShowCreateModal(false)}>×</button>
           <h2>Create Asset</h2>
           <form onSubmit={handleCreateAsset} className="create-request-form">
             <div className="form-group">
               <label>Asset Name:</label>
               <input type="text" name="asset_name" value={assetForm.asset_name} onChange={handleChange} required />
             </div>
             <div className="form-group">
               <label>Asset Description:</label>
               <textarea name="asset_description" value={assetForm.asset_description} onChange={handleChange} required />
             </div>
             <div className="form-group">
               <label>Asset Owner:</label>
               <input type="text" name="asset_owner" value={assetForm.asset_owner} onChange={handleChange} required />
             </div>
             <div className="form-group">
               <label>Asset Serial Number:</label>
               <input type="text" name="asset_serial_number" value={assetForm.asset_serial_number} onChange={handleChange} required />
             </div>
             <div className="form-group">
               <label>Asset Status:</label>
               <input type="text" name="asset_status" value={assetForm.asset_status} onChange={handleChange} required />
             </div>
             <div className="form-group">
               <label>Asset Type:</label>
               <input type="text" name="asset_type" value={assetForm.asset_type} onChange={handleChange} required />
             </div>
             <div className="form-group">
               <label>Creation Date:</label>
               <input type="date" name="created_date" value={assetForm.created_date} onChange={handleChange} required />
             </div>
             <div className="form-group">
               <label>Expiry Date:</label>
               <input type="date" name="expiry_date" value={assetForm.expiry_date} onChange={handleChange} required />
             </div>
             <button type="submit" className="submit-btn" disabled={isSubmitting}>
               {isSubmitting ? 'Submitting...' : 'Create Asset'}
             </button>
             <button type="button" onClick={() => setShowCreateModal(false)} className="modal-close-btn">Cancel</button>
           </form>
         </div>
       </div>
       
        )}
 <div className="dashboard-requests-section">
        <table className="asset-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Description</th>
              <th>Owner</th>
              <th>Serial Number</th>
              <th>Status</th>
              <th>Type</th>
              <th>Created Date</th>
              <th>Expiry Date</th>
              <th>Details</th>
              <th>Delete</th>
            </tr>
          </thead>
          <tbody>
            {assets.map((asset) => (
              <tr key={asset.id}>
                <td>{asset.id}</td>
                <td>{asset.asset_name}</td>
                <td>{asset.asset_description}</td>
                <td>{asset.asset_owner}</td>
                <td>{asset.asset_serial_number}</td>
                <td>{asset.asset_status}</td>
                <td>{asset.asset_type}</td>
                <td>{asset.created_date}</td>
                <td>{asset.expiry_date}</td>
                <td>
                  <button onClick={() => handleViewDetails(asset.id)} className="update-button">View</button>
                </td>
                <td>
                  <button onClick={() => handleDeleteClick(asset.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
        {showDeleteModal && (
          <div className="modal">
            <div className="modal-content">
              <p>Are you sure you want to delete this asset?</p>
              <button onClick={confirmDelete}>Yes</button>
              <button onClick={cancelDelete}>No</button>
            </div>
          </div>
        )}
        
        {selectedAsset && (
          <div className="modal-overlay">
          <div className="details-modal-content">
            <h2>Edit Asset Details</h2>
            <button className="details-modal-close-btn" onClick={() => setSelectedAsset(null)}>×</button>
            <form>
              <div className="form-group">
                <label>Name:</label>
                <input
                  type="text"
                  name="asset_name"
                  value={assetForm.asset_name}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label>Description:</label>
                <textarea
                  name="asset_description"
                  value={assetForm.asset_description}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label>Owner:</label>
                <input
                  type="text"
                  name="asset_owner"
                  value={assetForm.asset_owner}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label>Serial Number:</label>
                <input
                  type="text"
                  name="asset_serial_number"
                  value={assetForm.asset_serial_number}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label>Status:</label>
                <input
                  type="text"
                  name="asset_status"
                  value={assetForm.asset_status}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label>Type:</label>
                <input
                  type="text"
                  name="asset_type"
                  value={assetForm.asset_type}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label>Created Date:</label>
                <input
                  type="date"
                  name="created_date"
                  value={assetForm.created_date}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label>Expiry Date:</label>
                <input
                  type="date"
                  name="expiry_date"
                  value={assetForm.expiry_date}
                  onChange={handleChange}
                />
              </div>
            </form>
            <button onClick={handleUpdateAsset} className="details-modal-btn">Update Asset</button>
          </div>
        </div>
        
        )}
      </div>
    </div>
  );
};

export default AssetPage;
