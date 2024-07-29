import { useState } from 'react';
import './LoadData.css';
import { DataHandlerService } from '../../application/Application/DataHandlerService';

function LoadData() {
    
    const [folderPath, setFolderPath] = useState('not selected');
    const [progressText, setProgressText] = useState('Data not uploaded');
    
    const dataService = new DataHandlerService();

    return(
        <div className='LoadData-box'>

            <label htmlFor="LoadData-folderSelector" className='LoadData-folderLabel'>Select zip file</label>
            <input
                id='LoadData-folderSelector'
                type="file"
                onChange={(e) => {
                    const selectedFile = e.target.files?.[0];
                    setFolderPath(selectedFile?.name || 'not selected');
                }}
            />
            <h3 className='LoadData-pathText'>Selected file name: <span className='LoadData-highlightText'>{folderPath}</span></h3>
            <hr className='App-hr LoadData-hr'/>
            <button className='LoadData-button' onClick={() => dataService.handleZipData(document.getElementById("LoadData-folderSelector") as HTMLInputElement, setProgressText)}>Submit</button>
            <h4 className='LoadData-highlightTextShift'><span className='LoadData-highlightText'>{progressText}</span></h4>    
        </div>
    );

}

export default LoadData;