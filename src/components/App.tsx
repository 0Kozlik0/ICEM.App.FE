import React, { useState } from 'react';
import axios from 'axios';
import { useDropzone, DropEvent, FileRejection } from 'react-dropzone';
import { TestService } from '../logic/Application/TestService';

const App = () => {
  const [folderPath, setFolderPath] = useState('');
  const [files, setFiles] = useState<File[]>([]);
  const testServise = new TestService();

  const onDrop = (acceptedFiles: File[], fileRejections: FileRejection[], event: DropEvent) => {
    setFiles(acceptedFiles);
  };

  const { getRootProps, getInputProps } = useDropzone({ onDrop });

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

  return (
    <div>
      <input 
        type="text" 
        value={folderPath} 
        onChange={(e) => setFolderPath(e.target.value)} 
        placeholder="Enter folder path" 
      />
      <div {...getRootProps()}>
        <input {...getInputProps()} />
        <p>Drag 'n' drop some files here, or click to select files</p>
      </div>
      <button onClick={handleSubmit}>Submit</button>
      <button onClick={testServise.testMethod}>Test Button</button>
    </div>
  );
};

export default App;