import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Navbar from './layout/Navbar';
import Home from '../pages/Home';
import TiffList from '../pages/TiffList';
import GeoJSONList from '../pages/GeoJSONList';

const App = () => {
  return (
    <Router>
      <div>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/tiff-list" element={<TiffList />} />
          <Route path="/geojson-list" element={<GeoJSONList />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;