import { Link, useLocation, useNavigate } from 'react-router-dom';
import { HeaderProps } from '../interfaces/Interface';
import { useAuth } from './AuthContext';
import '../styles/Header.css';

function Header({ isOpen, toggleSidebar }: HeaderProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const SU_LGButton = !user
    ? location.pathname === '/login'
      ? 'Sign up'
      : 'Login'
    : null;

  const handleButtonClick = () => {
    if (SU_LGButton === 'Sign up') navigate('/signup');
    if (SU_LGButton === 'Login') navigate('/login');
  };

  const openProfile = () => {
    navigate('/profile');
  } 

  return (
    <header className="header">
      <div className="header-left">
        <div style={{ display: 'flex', width: 200 }}>
          <img src="/images/logo.svg" alt="CamSphere Logo" className="logo" />
          <h1 className="brand" style={{ display: `${isOpen ? '' : 'none'}` }}>HaNoiCam</h1>
        </div>
        <button className="toggle-button" onClick={toggleSidebar}>
          <img
            src={'/images/close-sidebar-icon.svg'}
            alt="Toggle Icon"
            className={`toggle-icon ${isOpen ? '' : 'flipped'}`}
          />
        </button>
      </div>
      <div style={{ display: 'flex', gap: 20 }}>
        <nav className="header-nav">
          <Link to="/" className="nav-link">Home</Link>
          <Link to="/camera" className="nav-link">Live Cameras</Link>
          <Link to="https://www.facebook.com/@ductuan1406" className="nav-link">Join Us</Link>
          <Link to="https://www.earthcam.com/myearthcam/help/faq.php" className="nav-link">FAQs</Link>
        </nav>
        <div className="header-right">
          {!user ? (
            <button className="signup-button" onClick={handleButtonClick}>
              {SU_LGButton}
            </button>
          ) : (
            <div className="user-menu">
              <img
                src={user.avatar}
                alt={`My avatar`}
                className="user-avatar"
                onClick={openProfile}
              />
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;
