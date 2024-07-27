import { useState } from 'react';
import './LoadData.css';
import { DataHandlerService } from '../../application/Application/DataHandlerService';

function LoadData() {
    
    const [folderPath, setFolderPath] = useState('not selected');
    const dataService = new DataHandlerService();

    return(
        <div className='LoadData-box'>

            <label htmlFor="LoadData-folderSelector" className='LoadData-folderLabel'>Select data folder</label>
            <input
                id='LoadData-folderSelector'
                type="file"
                multiple
                onChange={(e) => {
                    const selectedFolder = e.target.files?.[0]?.webkitRelativePath;
                    const folderName = selectedFolder?.substring(0, selectedFolder.lastIndexOf('/'));
                    setFolderPath(folderName!);
                }}
                ref={(input) => {
                    if (input) {
                        (input as HTMLInputElement).webkitdirectory = true;
                    }
                }}
            />
            <h3 className='LoadData-pathText'>Selected folder name: <span className='LoadData-highlightText'>{folderPath}</span></h3>
            <button className='LoadData-button' onClick={() => dataService.handleData(document.getElementById("LoadData-folderSelector") as HTMLInputElement)}>Submit</button>
        </div>
    );

}

export default LoadData;