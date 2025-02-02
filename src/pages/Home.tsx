import LoadData from '../components/common/LoadData';
import '../styles/Home.css';
import Footer from '../components/layout/Footer';

function Home() {
    return (
        <>
            <div className="page-container">
                <div className="home-content">
                    <div className="hero-section">
                        <h1>Welcome to Intelligent Assistant</h1>
                        <p className="hero-description">
                            A specialized tool for analyzing microscopic structures through advanced image processing and AI-powered segmentation and classification.
                            This tool assists researchers in their analysis but requires expert validation of results.
                        </p>
                    </div>

                    <div className="info-cards">
                        <div className="info-card">
                            <h2>About the Tool</h2>
                            <p>Intelligent Assistant is designed to process whole slide images, helping identify and segment various microscopic structures. 
                            While the AI model provides accurate segmentation and classification, all results should be reviewed and validated by qualified experts.</p>
                        </div>
                        
                        <div className="info-card warning-card">
                            <h2>Important Notice</h2>
                            <p>The results provided by this tool are meant to assist in research and analysis. All predicted results must be verified 
                            by qualified experts before being used in any research context or conclusions.</p>
                        </div>

                        <div className="info-card">
                            <h2>File Requirements</h2>
                            <p>When preparing your files for upload:</p>
                            <ul className="requirements-list">
                                <li>Files must be in .ome.tif format</li>
                                <li>File names must follow the pattern: number_number.ome.tif</li>
                                <li>Example valid names: 1_1.ome.tif, 23_45.ome.tif</li>
                                <li>All files must be contained in a single ZIP archive</li>
                            </ul>
                        </div>
                    </div>

                    <div className="tutorial-content">
                        <section>
                            <h2>How to Use the Application</h2>
                            <ol>
                                <li>
                                    <h3>Image Upload</h3>
                                    <p>Navigate to the "Image Upload" page to upload your Whole Slide Images:</p>
                                    <ul>
                                        <li>Select a ZIP file containing your Whole Slide Images</li>
                                        <li>Click the Submit button to upload your files</li>
                                        <li>Wait for the upload confirmation</li>
                                    </ul>
                                </li>
                                <li>
                                    <h3>Whole Slide Images</h3>
                                    <p>View and manage your uploaded Whole Slide Images:</p>
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
                                        <li>Download results for expert review</li>
                                        <li>Search and sort through your results</li>
                                    </ul>
                                </li>
                            </ol>
                        </section>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
}

export default Home; 