import { DataPreparationService } from "./DataPreparationService";

export class DataHandlerService extends DataPreparationService{

    constructor() {
        super();
    }

    public async handleData(fileInputElement: HTMLInputElement | null) {
        
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