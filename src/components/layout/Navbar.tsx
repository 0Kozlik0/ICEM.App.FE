import { Link } from 'react-router-dom';
import './Navbar.css';

function Navbar() {
    return (
        <nav className="navbar">
            <div className="navbar-container">
                <Link to="/" className="navbar-logo">
                    IKEM
                </Link>
                <ul className="nav-menu">
                    <li className="nav-item">
                        <Link to="/" className="nav-link">Home</Link>
                    </li>
                    <li className="nav-item">
                        <Link to="/image-upload" className="nav-link">Image Upload</Link>
                    </li>
                    <li className="nav-item">
                        <Link to="/tiff-list" className="nav-link">Tiff Files</Link>
                    </li>
                    <li className="nav-item">
                        <Link to="/geojson-list" className="nav-link">Results</Link>
                    </li>
                </ul>
            </div>
        </nav>
    );
}

export default Navbar; 