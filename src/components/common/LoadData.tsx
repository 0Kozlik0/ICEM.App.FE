import { useState } from 'react';
import './LoadData.css';
import { TestService } from '../../application/Application/TestService';
import axios from 'axios';

function LoadData() {
    
    const [folderPath, setFolderPath] = useState('not selected');
    const [files, setFiles] = useState<File[]>([]);
    const testServise = new TestService();

    const handleSubmit = async () => {
        const formData = new FormData();
        formData.append('folderPath', folderPath);
        files.forEach(file => formData.append('files', file));

        try {
        const response = await axios.post('http://your-backend-endpoint', formData, {
            headers: {
            'Content-Type': 'multipart/form-data',
            },
        });
        console.log('Output:', response.data);
        } catch (error) {
        console.error('Error uploading files:', error);
        }
    };

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
            <button className='LoadData-button' onClick={handleSubmit}>Submit</button>
        </div>
    );

}

export default LoadData;