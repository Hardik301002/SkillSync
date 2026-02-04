import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

// Page Imports
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import About from './pages/About';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import EditProfile from './pages/EditProfile';
import MyApplications from './pages/MyApplications';
import SavedJobs from './pages/SavedJobs';
import JobDetails from './pages/JobDetails';
import PostJob from './pages/PostJob';
import ManageJob from './pages/ManageJob';
import EditJob from './pages/EditJob';
import AdminDashboard from './pages/AdminDashboard';
import JobFeed from './pages/JobFeed';
import RegisteredCompanies from './pages/RegisteredCompanies';
import AddCompany from './pages/AddCompany';

function App() {
  return (
    <Router>
      {/* Toast Notification Config */}
      <Toaster 
        position="top-center" 
        reverseOrder={false} 
        toastOptions={{
            duration: 3000,
            style: {
                background: '#333',
                color: '#fff',
                fontWeight: 'bold'
            }
        }}
      />
      
      <div className="flex flex-col min-h-screen">
        <div className="flex-grow">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/jobs" element={<JobFeed />} />
            
            {/* Auth Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Dashboard & User Routes */}
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/edit-profile" element={<EditProfile />} />
            
            {/* Candidate Routes */}
            <Route path="/applications" element={<MyApplications />} />
            <Route path="/saved-jobs" element={<SavedJobs />} />

            {/* Recruiter Routes */}
            <Route path="/post-job" element={<PostJob />} />
            <Route path="/manage-job/:id" element={<ManageJob />} />
            <Route path="/edit-job/:id" element={<EditJob />} />
            <Route path="/registered-companies" element={<RegisteredCompanies />} />
            <Route path="/add-company" element={<AddCompany />} />
            <Route path="/edit-company/:id" element={<AddCompany />} /> 

            {/* Shared */}
            <Route path="/jobs/:id" element={<JobDetails />} />

            {/* Admin Routes */}
            <Route path="/admin" element={<AdminDashboard />} />

          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;