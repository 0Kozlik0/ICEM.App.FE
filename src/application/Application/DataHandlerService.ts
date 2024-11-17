import { DataPreparationService } from "./DataPreparationService";
import { PredictionResponse, TaskStatusResponse, TiffFileResponse } from "../Domain/Response";

interface ProcessingTask {
    taskId: string;
    recordIds: string[];
    startTime: number;
}

export class DataHandlerService extends DataPreparationService{

    constructor() {
        super();
    }

    private async validateZipFile(file: File): Promise<{ isValid: boolean; message: string }> {
        if (!file.name.toLowerCase().endsWith('.zip')) {
            return { isValid: false, message: 'Please select a ZIP file' };
        }

        try {
            const JSZip = (await import('jszip')).default;
            const zip = await JSZip.loadAsync(file);
            
            const hasInvalidFiles = Object.keys(zip.files).some(filename => {
                const lowercaseFile = filename.toLowerCase();
                return !filename.endsWith('/') && // Skip directories
                       !lowercaseFile.endsWith('.tif') && 
                       !lowercaseFile.endsWith('.tiff');
            });

            if (hasInvalidFiles) {
                return { 
                    isValid: false, 
                    message: 'ZIP file can only contain .tif or .tiff files' 
                };
            }

            return { isValid: true, message: 'File is valid' };
        } catch (error) {
            return { isValid: false, message: 'Invalid ZIP file format' };
        }
    }

    public async handleZipData(fileInputElement: HTMLInputElement | null, setProgressText: (text: string) => void) {
        const file = fileInputElement?.files?.[0];
        if (!file) return;

        const validation = await this.validateZipFile(file);
        if (!validation.isValid) {
            setProgressText(validation.message);
            return;
        }

        var filedata = new FormData();
        filedata.append('zipFolder', file);
        
        try {
            setProgressText('Uploading data...');
            const response = await fetch(`${process.env.REACT_APP_FAST_API_HOST}/ikem_api/upload_zip`, {
                method: 'POST',
                body: filedata,
            });

            if (response.ok) {
                setProgressText('Data uploaded successfully');
                console.log('File uploaded successfully');
            } else {
                setProgressText('Error - Data did not upload');
                console.error('Error uploading file');
            }
        } catch (error) {
            setProgressText('Error - Data did not upload');
            console.error('Error uploading file:', error);
        }
    }

    public async handleFolderData(fileInputElement: HTMLInputElement | null) {
        
        var preparedData;

        // Get the files from the input element
        const files = fileInputElement!.files;
        console.log(files);
        if (files) {
            for (let i = 0; i < files.length; i++) {
            const file = files[i];
            // Prepare the data to base64 format
            preparedData = this.prepareInputData(file);
            console.log(preparedData);
            }
        }
    }

    public async getTiffFiles(): Promise<TiffFileResponse> {
        try {
            const response = await fetch(`${process.env.REACT_APP_FAST_API_HOST}/ikem_api/get-tiff-files`);
            if (!response.ok) {
                throw new Error('Failed to fetch TIFF files');
            }
            return await response.json();
        } catch (error) {
            console.error('Error fetching TIFF files:', error);
            throw error;
        }
    }

    public async predictStructure(selectedIds: string[]): Promise<PredictionResponse> {
        try {
            const integerIds = selectedIds.map(id => parseInt(id.replace(/\D/g, '')));
            const response = await fetch(`${process.env.REACT_APP_FAST_API_HOST}/ikem_api/predict_structure`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(integerIds),
            });

            if (!response.ok) {
                throw new Error('Failed to start prediction');
            }

            return await response.json();
        } catch (error) {
            console.error('Error starting prediction:', error);
            throw error;
        }
    }

    public async checkTaskStatus(taskId: string): Promise<TaskStatusResponse> {
        try {
            const response = await fetch(`${process.env.REACT_APP_FAST_API_HOST}/ikem_api/task-status/${taskId}`);
            if (!response.ok) {
                throw new Error('Failed to fetch task status');
            }
            return await response.json();
        } catch (error) {
            console.error('Error checking task status:', error);
            throw error;
        }
    }

    public async downloadGeoJSON(id: string): Promise<void> {
        try {
            const response = await fetch(`${process.env.REACT_APP_FAST_API_HOST}/ikem_api/download_geojson/${id}`);
            if (!response.ok) {
                throw new Error('Failed to download GeoJSON file');
            }
            
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${id}.geojson`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
        } catch (error) {
            console.error('Error downloading GeoJSON file:', error);
            throw error;
        }
    }

    public getStoredTasks(): ProcessingTask[] {
        const tasks = localStorage.getItem('processingTasks');
        return tasks ? JSON.parse(tasks) : [];
    }

    public storeTask(taskId: string, recordIds: string[]) {
        const tasks = this.getStoredTasks();
        tasks.push({
            taskId,
            recordIds,
            startTime: Date.now()
        });
        localStorage.setItem('processingTasks', JSON.stringify(tasks));
    }

    public removeTask(taskId: string) {
        const tasks = this.getStoredTasks().filter(task => task.taskId !== taskId);
        localStorage.setItem('processingTasks', JSON.stringify(tasks));
    }

}