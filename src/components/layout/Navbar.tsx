import { Link, useLocation } from 'react-router-dom';
import './Navbar.css';
import vggLogo from '../../assets/images/VGG.png';

function Navbar() {
    const location = useLocation();
    const currentPath = location.pathname;

    return (
        <nav className="navbar">
            <div className="navbar-container">
                <Link to="/" className="navbar-logo">
                    <img src={vggLogo} alt="VGG Logo" className="navbar-logo-image" />
                    Intelligent Assistant
                </Link>
                <ul className="nav-menu">
                    <li className="nav-item">
                        <Link to="/" className={`nav-link ${currentPath === '/' ? 'active' : ''}`}>
                            Home
                        </Link>
                    </li>
                    <li className="nav-item">
                        <Link to="/image-upload" className={`nav-link ${currentPath === '/image-upload' ? 'active' : ''}`}>
                            Image Upload
                        </Link>
                    </li>
                    <li className="nav-item">
                        <Link to="/tiff-list" className={`nav-link ${currentPath === '/tiff-list' ? 'active' : ''}`}>
                            Whole Slide Images
                        </Link>
                    </li>
                    <li className="nav-item">
                        <Link to="/geojson-list" className={`nav-link ${currentPath === '/geojson-list' ? 'active' : ''}`}>
                            Results
                        </Link>
                    </li>
                </ul>
            </div>
        </nav>
    );
}

export default Navbar; 