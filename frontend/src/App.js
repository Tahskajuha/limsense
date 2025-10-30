import { NavLink, Route, Routes, useLocation, useNavigate, Navigate } from 'react-router-dom';
import Reports from './pages/Reports';
import AnalyticsDashboard from './pages/AnalyticsDashboard';
import Login from './pages/Login';
import Signup from './pages/Signup';

function Shell({ children }) {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <img src={process.env.PUBLIC_URL + '/logo.png'} alt="Limsense" className="logo-img" onError={(e)=>{e.currentTarget.outerHTML='<div class="logo">LS</div>';}} />
          <div className="brand-text">Limsense</div>
        </div>
        <nav className="side-links">
          <NavLink to="/reports" className={({ isActive }) => isActive ? 'active' : ''}>Report Generation</NavLink>
          <NavLink to="/analytics" className={({ isActive }) => isActive ? 'active' : ''}>Analytics Dashboard</NavLink>
        </nav>
      </aside>

      <main className="content">
        <header className="topbar">
          <div className="breadcrumbs">
            <span>Dashboard</span>
            <span className="sep">/</span>
            <span>{location.pathname.startsWith('/analytics') ? 'Analytics Dashboard' : 'Report Generation'}</span>
          </div>
          <div className="top-actions">
            <input className="search" placeholder="Search" />
            <button className="btn outline" onClick={() => navigate('/reports')}>Create</button>
            <button className="btn" onClick={() => { localStorage.removeItem('auth'); navigate('/signup'); }}>Logout</button>
            <img src={process.env.PUBLIC_URL + '/logo.png'} alt="Limsense" className="top-logo" onError={(e)=>{e.currentTarget.outerHTML='<div class="avatar">LS</div>';}} />
          </div>
        </header>

        <div className="tabs">
          <button
            className={`tab ${location.pathname.startsWith('/reports') ? 'selected' : ''}`}
            onClick={() => navigate('/reports')}
          >Reports</button>
          <button
            className={`tab ${location.pathname.startsWith('/analytics') ? 'selected' : ''}`}
            onClick={() => navigate('/analytics')}
          >Analytics</button>
        </div>

        <div className="page">
          {children}
        </div>
      </main>
    </div>
  );
}

export default function App() {
  const RequireAuth = ({ children }) => {
    const authed = !!localStorage.getItem('auth');
    return authed ? children : <Navigate to="/signup" replace />;
  };
  return (
    <Routes>
      <Route path="/" element={<Navigate to={localStorage.getItem('auth') ? '/reports' : '/signup'} replace />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/reports" element={<RequireAuth><Shell><Reports /></Shell></RequireAuth>} />
      <Route path="/analytics" element={<RequireAuth><Shell><AnalyticsDashboard /></Shell></RequireAuth>} />
    </Routes>
  );
}


