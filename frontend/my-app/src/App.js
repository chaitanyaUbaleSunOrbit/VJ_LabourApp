// import React from 'react';
// import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// import Header from './components/Header/Header';
// import Sidebar from './components/Sidebar/Sidebar';
// import OnboardingForm from './components/OnboardingForm/OnboardingForm';
// import './App.css';

// function App() {
//   return (
//     <Router>
//       <div className="app">
//         <Header />
//         <div className="main-content">
          
//           <Sidebar />
//           <Routes>

//             <Route path="/kyc" element={<OnboardingForm formType="kyc" />} />
//             <Route path="/personal" element={<OnboardingForm formType="personal" />} />
//             <Route path="/project" element={<OnboardingForm formType="project" />} />
//             <Route path="/bankDetails" element={<OnboardingForm formType="bankDetails" />} />
//           </Routes>
//         </div>
//       </div>
//     </Router>
//   );
// }

// export default App;


import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header/Header';
import Sidebar from './components/Sidebar/Sidebar';
import OnboardingForm from './components/OnboardingForm/OnboardingForm';
import './App.css';

function App() {
  const [formStatus, setFormStatus] = useState({
    kyc: false,
    personal: false,
    bankDetails: false,
    project: false
  });

  const handleFormSubmit = (formType) => {
    setFormStatus((prevStatus) => ({
      ...prevStatus,
      [formType]: true
    }));
  };

  return (
    <Router>
      <div className="app">
        <Header />
        <div className="main-content">
          <Sidebar formStatus={formStatus} />
          <Routes>
            <Route path="/kyc" element={<OnboardingForm formType="kyc" onFormSubmit={handleFormSubmit} />} />
            <Route path="/personal" element={<OnboardingForm formType="personal" onFormSubmit={handleFormSubmit} />} />
            <Route path="/project" element={<OnboardingForm formType="project" onFormSubmit={handleFormSubmit} />} />
            <Route path="/bankDetails" element={<OnboardingForm formType="bankDetails" onFormSubmit={handleFormSubmit} />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;

