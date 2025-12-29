import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';

// Public components
import Layout from './components/Layout';
import ScrollToTop from './components/ScrollToTop';
import Home from './pages/Home';
import About from './pages/About';
import VisionMission from './pages/VisionMission';
import Structure from './pages/Structure';
import Contact from './pages/Contact';

// Admin components
import AdminLayout from './components/admin/AdminLayout';
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminProfile from './pages/admin/AdminProfile';
import AdminVisionMission from './pages/admin/AdminVisionMission';
import AdminStructure from './pages/admin/AdminStructure';
import AdminContact from './pages/admin/AdminContact';
import AdminWebsiteInfo from './pages/admin/AdminWebsiteInfo';
import ProtectedRoute from './components/admin/ProtectedRoute';

function App() {
  useEffect(() => {
    // Initialize AOS
    AOS.init({
      duration: 800,
      delay: 100,
      once: true,
      easing: 'ease-out-cubic',
    });
  }, []);

  return (
    <Router>
      <ScrollToTop />
      <div className="App overflow-x-hidden">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="tentang" element={<About />} />
            <Route path="visi-misi" element={<VisionMission />} />
            <Route path="struktur" element={<Structure />} />
            <Route path="kontak" element={<Contact />} />
          </Route>

          {/* Admin Routes */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }>
            <Route index element={<AdminDashboard />} />
            <Route path="profile" element={<AdminProfile />} />
            <Route path="visi-misi" element={<AdminVisionMission />} />
            <Route path="struktur" element={<AdminStructure />} />
            <Route path="kontak" element={<AdminContact />} />
            <Route path="website-info" element={<AdminWebsiteInfo />} />
          </Route>
        </Routes>
      </div>
    </Router>
  );
}

export default App;