import { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import './LoadData.css';
import { DataHandlerService } from '../../application/Application/DataHandlerService';

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
        <>
            <div className="page-container">
                <div className='LoadData-box'>
                    <div className='LoadData-uploadSection'>
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
                        <hr className='LoadData-hr'/>
                        <button 
                            className='LoadData-button' 
                            onClick={handleUpload}
                        >
                            Submit
                        </button>
                        <h4 className='LoadData-highlightTextShift'>
                            <span className='LoadData-highlightText'>{progressText}</span>
                        </h4>
                        
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
        </>
    );
}

export default LoadData;