import React, { useEffect, useState } from 'react';
import axios from 'axios';
// import logo3 from '../../image/Logo.png';
import logo6 from '../../image/dd.png';
import { Link } from 'react-router-dom';
import logo3 from '../../image/koolboks.png';
import { Bar, Pie } from 'react-chartjs-2';
import { Chart, CategoryScale, LinearScale, BarElement, Title, ArcElement } from 'chart.js';
import '../Reporting/reporting.css';
import { FaTasks, FaChartPie, FaComments, FaSignOutAlt } from 'react-icons/fa';

// Register the necessary components
Chart.register(CategoryScale, LinearScale, BarElement, Title, ArcElement);

const Reporting = () => {
    const [activeItem, setActiveItem] = useState('');
    const [reportData, setReportData] = useState({
        totalTickets: 0,
        totalTasks: 0,
        totalUsers: 0,
        totalAgents: 0,
        ticketCategories: {},
        ticketStatus: {},
        ticketPriority: {},
        weeklyData: [],
        monthlyData: [],
        yearlyData: []
    });

    useEffect(() => {
        fetchReportingData();
    }, []);

    const fetchReportingData = async () => {
        try {
            const response = await axios.get('https://sathservicedesk-sathservicedesk-staging-dpdaa2a3dkd7e7as.eastus2-01.azurewebsites.net/get-requests', {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer your-auth-token',
                    'userEmail': 'unnamani@saconsulting.ai',
                    'userName': 'Uchenna Ikenna Nnamani',
                },
            });

            const requests = response.data.requests;
            const totalTickets = requests.length;
            const totalTasks = 4; // This can be dynamically updated when API is connected
            const totalUsers = 3; // Replace with API response once available
            const totalAgents = 2; // Replace with API response once available

            const ticketCategories = requests.reduce((acc, req) => {
                acc[req.category] = (acc[req.category] || 0) + 1;
                return acc;
            }, {});

            const ticketStatus = {
                open: requests.filter(req => req.status === 'open').length,
                assigned: requests.filter(req => req.status === 'assigned').length,
                closed: requests.filter(req => req.status === 'closed').length,
            };

            const ticketPriority = {
                high: requests.filter(req => req.priority === 'high').length,
                medium: requests.filter(req => req.priority === 'medium').length,
                low: requests.filter(req => req.priority === 'low').length,
            };

            // Organize data by week, month, and year
            const weeklyData = [];
            const monthlyData = [];
            const yearlyData = [];

            const dateCounts = requests.reduce((acc, request) => {
                const createdDate = new Date(request.created_date);
                const week = `${createdDate.getFullYear()}-W${getWeekNumber(createdDate)}`;
                const month = `${createdDate.getFullYear()}-${createdDate.getMonth() + 1}`;
                const year = createdDate.getFullYear();

                acc.weekly[week] = (acc.weekly[week] || 0) + 1;
                acc.monthly[month] = (acc.monthly[month] || 0) + 1;
                acc.yearly[year] = (acc.yearly[year] || 0) + 1;

                return acc;
            }, { weekly: {}, monthly: {}, yearly: {} });

            Object.entries(dateCounts.weekly).forEach(([week, count]) => {
                weeklyData.push({ week, count });
            });
            Object.entries(dateCounts.monthly).forEach(([month, count]) => {
                monthlyData.push({ month, count });
            });
            Object.entries(dateCounts.yearly).forEach(([year, count]) => {
                yearlyData.push({ year, count });
            });

            setReportData({
                totalTickets,
                totalTasks,
                totalUsers,
                totalAgents,
                ticketCategories,
                ticketStatus,
                ticketPriority,
                weeklyData,
                monthlyData,
                yearlyData,
            });
        } catch (error) {
            console.error('Error fetching reporting data:', error);
        }
    };

    const getWeekNumber = (date) => {
        const firstJan = new Date(date.getFullYear(), 0, 1);
        const days = Math.floor((date - firstJan) / (24 * 60 * 60 * 1000));
        return Math.ceil((days + firstJan.getDay() + 1) / 7);
    };

    return (
        <div className="dashboard-container">
        <div className="left-sidebar">
           <div className="dashboard-log">
             <img src={logo3} alt="ServiceDesk Logo"/>
           </div>
           <div className="sidebar-options">
       <Link to='/user' onClick={() => setActiveItem('Request')}>
         <div className={`sidebar-item ${activeItem === 'Request' ? 'active' : ''}`}>
           <FaTasks />
           <p>Request</p>
         </div>
       </Link>
     
       <Link to='/reporting' onClick={() => setActiveItem('Reporting')}>
         <div className={`sidebar-item ${activeItem === 'Reporting' ? 'active' : ''}`}>
           <FaChartPie />
           <p>Reporting</p>
         </div>
       </Link>
     
       <Link to='/bot' onClick={() => setActiveItem('Chat with Bot')}>
         <div className={`sidebar-item ${activeItem === 'Chat with Bot' ? 'active' : ''}`}>
           <FaComments /> 
           <p>Chat with Bot</p>
         </div>
       </Link>
     
       <div className="sidebar-item logout">
         <FaSignOutAlt />
         <p>Logout</p>
       </div>
     </div>
     
         </div>
         
         
           {/* <div className="dashboard-wrapper"> */}
             <div className="dashboards-content">
             <div className="dashboarheader-wrappers">
            
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
        <div className="reporting-container">
            <div className='table-scroll'>

           
            <div className="summary-container">
                <div className="summary-tile">
                    <h2>Total Tickets</h2>
                    <p>{reportData.totalTickets}</p>
                </div>
                <div className="summary-tile">
                    <h2>Total Tasks</h2>
                    <p>{reportData.totalTasks}</p>
                </div>
                <div className="summary-tile">
                    <h2>No. of Users</h2>
                    <p>{reportData.totalUsers}</p>
                </div>
                <div className="summary-tile">
                    <h2>No. of Agents</h2>
                    <p>{reportData.totalAgents}</p>
                </div>
            </div>
            
            <div className="charts-container">
                <div className="chart">
                    <h3>Tickets Raised by Time Periods</h3>
                    <Bar
                        data={{
                            labels: reportData.weeklyData.map(data => data.week),
                            datasets: [
                                {
                                    label: 'Weekly Requests',
                                    data: reportData.weeklyData.map(data => data.count),
                                    backgroundColor: 'rgba(75, 192, 192, 0.6)',
                                },
                            ],
                        }}
                    />
                </div>

                <div className="chart">
                    <h3>Tickets Categories</h3>
                    <Bar
                        data={{
                            labels: Object.keys(reportData.ticketCategories),
                            datasets: [
                                {
                                    label: 'Category Count',
                                    data: Object.values(reportData.ticketCategories),
                                    backgroundColor: 'rgba(54, 162, 235, 0.6)',
                                },
                            ],
                        }}
                    />
                </div>
            </div>

            <div className="charts-container">
                <div className="chart">
                    <h3>Tickets Status</h3>
                    <Pie
                        data={{
                            labels: ['Open', 'Assigned', 'Closed'],
                            datasets: [
                                {
                                    data: [reportData.ticketStatus.open, reportData.ticketStatus.assigned, reportData.ticketStatus.closed],
                                    backgroundColor: ['red', 'orange', 'green'],
                                },
                            ],
                        }}
                    />
                </div>

                <div className="chart">
                    <h3>Tickets Priority</h3>
                    <Pie
                        data={{
                            labels: ['High', 'Medium', 'Low'],
                            datasets: [
                                {
                                    data: [reportData.ticketPriority.high, reportData.ticketPriority.medium, reportData.ticketPriority.low],
                                    backgroundColor: ['red', 'yellow', 'green'],
                                },
                            ],
                        }}
                    />
                </div>
            </div>
        </div>
        </div>
        </div>
        </div>
    );
};

export default Reporting;
