import { DataPreparationService } from "./DataPreparationService";
import { PredictionResponse, TaskStatusResponse, TiffFileResponse } from "../Domain/Response";
import { AuthService } from './AuthService';
import { TiffRecord } from "../Domain/Records";

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
            const response = await AuthService.fetchWithAuth(
                `${process.env.REACT_APP_FAST_API_HOST}/ikem_api/upload_zip`, 
                {
                    method: 'POST',
                    body: filedata,
                }
            );

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
            const response = await AuthService.fetchWithAuth(
                `${process.env.REACT_APP_FAST_API_HOST}/ikem_api/get-tiff-files`
            );
            if (!response.ok) {
                throw new Error('Failed to fetch TIFF files');
            }
            return await response.json();
        } catch (error) {
            console.error('Error fetching TIFF files:', error);
            throw error;
        }
    }

    public async predictStructureVPP2024(selectedIds: string[]): Promise<PredictionResponse> {
        try {
            // const integerIds = selectedIds.map(id => parseInt(id.replace(/\D/g, '')));
            const integerIds = selectedIds.map(id => id.split('.')[0]);
            console.log(integerIds);
            const response = await AuthService.fetchWithAuth(
                `${process.env.REACT_APP_FAST_API_HOST}/ikem_api/predict_structure`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(integerIds),
                }
            );

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
            const response = await AuthService.fetchWithAuth(
                `${process.env.REACT_APP_FAST_API_HOST}/ikem_api/task-status/${taskId}`
            );
            
            if (!response.ok) {
                throw new Error('Failed to fetch task status');
            }
            
            const data = await response.json();
            console.log('Task status response:', data);
            return data;
        } catch (error) {
            console.error('Error checking task status:', error);
            throw error;
        }
    }

    public async downloadGeoJSON(id: string, type: 'tissue' | 'cell'): Promise<void> {
        try {
            id = id.split('mask_')[1].split('.')[0];
            const response = await AuthService.fetchWithAuth(
                `${process.env.REACT_APP_FAST_API_HOST}/ikem_api/download_geojson/${id}?type=${type}`
            );
            if (!response.ok) {
                throw new Error('Failed to download GeoJSON file');
            }
            
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${type}_mask_${id}.geojson`;
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

    public async deleteTiffData(id: string): Promise<void> {
        try {
            id = id.split('.')[0];
            const response = await AuthService.fetchWithAuth(
                `${process.env.REACT_APP_FAST_API_HOST}/ikem_api/clear-tiff-data/${id}`,
                {
                    method: 'DELETE'
                }
            );
            
            if (!response.ok) {
                throw new Error('Failed to delete TIFF data');
            }
        } catch (error) {
            console.error('Error deleting TIFF data:', error);
            throw error;
        }
    }

    public storeRecordStatuses(records: TiffRecord[]) {
        localStorage.setItem('recordStatuses', JSON.stringify(records));
    }

    public getStoredRecordStatuses(): TiffRecord[] {
        const stored = localStorage.getItem('recordStatuses');
        return stored ? JSON.parse(stored) : [];
    }

}