import LoadData from '../components/common/LoadData';
import '../styles/Home.css';

function Home() {
    return (
        <div className="page-container">
            <h1>Welcome to IKEM Tool</h1>
            <div className="tutorial-content">
                <section>
                    <h2>How to Use the Application</h2>
                    <ol>
                        <li>
                            <h3>Image Upload</h3>
                            <p>Navigate to the "Image Upload" page to upload your TIFF files:</p>
                            <ul>
                                <li>Select a ZIP file containing your TIFF images</li>
                                <li>Click the Submit button to upload your files</li>
                                <li>Wait for the upload confirmation</li>
                            </ul>
                        </li>
                        <li>
                            <h3>Tiff Files</h3>
                            <p>View and manage your uploaded TIFF files:</p>
                            <ul>
                                <li>See all uploaded files</li>
                                <li>Select files for processing</li>
                                <li>Select model for processing</li>
                                <li>Monitor processing status</li>
                            </ul>
                        </li>
                        <li>
                            <h3>Results</h3>
                            <p>Access your processed results:</p>
                            <ul>
                                <li>View all processed GeoJSON files</li>
                                <li>Download results</li>
                                <li>Search and sort through your results</li>
                            </ul>
                        </li>
                    </ol>
                </section>
            </div>
        </div>
    );
}

export default Home; 