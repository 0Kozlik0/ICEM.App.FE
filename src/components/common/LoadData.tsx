import { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import './LoadData.css';
import { DataHandlerService } from '../../application/Application/DataHandlerService';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import InfoIcon from '@mui/icons-material/Info';

function LoadData() {
    const [folderPath, setFolderPath] = useState('not selected');
    const [progressText, setProgressText] = useState('Data not uploaded');
    const [isUploaded, setIsUploaded] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    
    const dataService = new DataHandlerService();

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        setFolderPath(selectedFile?.name || 'not selected');
        setIsUploaded(false);
    };

    const handleUpload = async () => {
        await dataService.handleZipData(fileInputRef.current, (text) => {
            setProgressText(text);
            if (text === 'Data uploaded successfully') {
                setIsUploaded(true);
            }
        });
    };

    return(
        <div className="page-container">
            <div className='LoadData-box'>
                <div className='LoadData-header'>
                    <h1>Upload Your Data</h1>
                    <p className="LoadData-description">
                        Upload your whole slide images in a ZIP file for processing. The system accepts tiff files.
                    </p>
                </div>
                
                <div className='LoadData-uploadSection'>
                    {/* <div className="LoadData-requirements">
                        <h3><InfoIcon className="LoadData-infoIcon" /> Upload Requirements</h3>
                        <ul>
                            <li>File must be in ZIP format</li>
                            <li>Maximum file size: 500MB</li>
                            <li>Supported image formats: TIFF, SVS</li>
                            <li>All images must be in the root of the ZIP file</li>
                        </ul>
                    </div> */}

                    <div className="LoadData-uploadBox">
                        <UploadFileIcon className="LoadData-uploadIcon" />
                        <label htmlFor="LoadData-folderSelector" className='LoadData-folderLabel'>
                            Select zip file
                        </label>
                        <input
                            ref={fileInputRef}
                            id='LoadData-folderSelector'
                            type="file"
                            accept=".zip"
                            onChange={handleFileChange}
                        />
                        <h3 className='LoadData-pathText'>
                            Selected file: <span className='LoadData-highlightText'>{folderPath}</span>
                        </h3>
                        <button 
                            className='LoadData-button' 
                            onClick={handleUpload}
                            disabled={folderPath === 'not selected'}
                        >
                            Submit
                        </button>
                        <h4 className='LoadData-highlightTextShift'>
                            <span className='LoadData-highlightText'>{progressText}</span>
                        </h4>
                    </div>
                    
                    {isUploaded && (
                        <div className="LoadData-success">
                            <h3>Next Steps:</h3>
                            <ol>
                                <li>Go to the <Link to="/tiff-list" className="LoadData-link">Whole Slide Images</Link> page</li>
                                <li>Select the uploaded images you want to process</li>
                                <li>Choose the appropriate model for processing</li>
                                <li>Click "Process Selected" to start the analysis</li>
                            </ol>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default LoadData;