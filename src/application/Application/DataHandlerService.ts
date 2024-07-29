import { DataPreparationService } from "./DataPreparationService";

export class DataHandlerService extends DataPreparationService{

    constructor() {
        super();
    }

    public async handleZipData(fileInputElement: HTMLInputElement | null, setProgressText: (text: string) => void) {
            
        var filedata = new FormData();

        // Get the files from the input element
        const file = fileInputElement!.files?.[0];
        if (file) {
            filedata.append('zipFolder', file );
            
            try {
                setProgressText('Uploading data...');
                const response = await fetch(`${process.env.REACT_APP_FAST_API_HOST}/ikem_api/transfer_zip_data`, {
                    method: 'POST',
                    body: filedata,
                });

                if (response.ok) {
                    // File uploaded successfully
                    setProgressText('Data uploaded successfully');
                    console.log('File uploaded successfully');
                } else {
                    // Error uploading file
                    setProgressText('Error - Data did not uploaded');
                    console.error('Error uploading file');
                }
            } catch (error) {
                setProgressText('Error - Data did not uploaded');
                console.error('Error uploading file:', error);
            }
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


}