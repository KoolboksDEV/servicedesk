// import React from 'react';
// import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// import Landing from '../src/pages/Landing/landing';
// import User from '../src/pages/User/user';
// import Agent from '../src/pages/Agent/agent';
// import Task from '../src/pages/Task/task';
// import Admin from '../src/pages/Admin/admin'
// import Services from '../src/pages/Admin/Services'
// import Roles from '../src/pages/Admin/role'
// import Admtask from '../src/pages/Admin/admtask'
// import Asset from '../src/pages/Admin/asset'
// import Bot from '../src/pages/Bot/bot'
// import Report from '../src/pages/Reporting/reporting'

// function App() {
//   return (
//     <Router>
//       <Routes>
//         <Route path="/" element={<Landing />} />
//         <Route path="/user" element={<User />} />
//         <Route path="/agent" element={<Agent/>} />
//         <Route path="/task" element={<Task/>}/>
//         <Route path="/admin" element={<Admin/>}/>
//         <Route path="/services" element={<Services/>}/>
//         <Route path="/roles" element={<Roles/>}/>
//         <Route path="/admtask" element={<Admtask/>}/>
//         <Route path="/asset" element={<Asset/>}/>
//         <Route path="/bot" element={<Bot/>}/>
//         <Route path="/reporting" element={<Report/>}/>
//       </Routes>
//     </Router>
//   );
// }

// export default App;

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Landing from '../src/pages/Landing/landing';
import ServiceRequest from '../src/pages/User/user';  
import Agent from '../src/pages/Agent/agent';
import Task from '../src/pages/Task/task';
import Admin from '../src/pages/Admin/admin'
import Services from '../src/pages/Admin/Services'
import Roles from '../src/pages/Admin/role'
import Admtask from '../src/pages/Admin/admtask'
import Asset from '../src/pages/Admin/asset'
import Bot from '../src/pages/Bot/bot'
import Reporting from '../src/pages/Reporting/reporting'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
           <Route path="/agent" element={<Agent/>} />
        <Route path="/user" element={<ServiceRequest />} />  
     
        <Route path="/task" element={<Task/>}/>
        <Route path="/admin" element={<Admin/>}/>
        <Route path="/services" element={<Services/>}/>
        <Route path="/roles" element={<Roles/>}/>
        <Route path="/admtask" element={<Admtask/>}/>
        <Route path="/asset" element={<Asset/>}/>
        <Route path="/bot" element={<Bot/>}/>
        <Route path="/reporting" element={<Reporting/>}/>
      </Routes>
    </Router>
  );
}

export default App;
