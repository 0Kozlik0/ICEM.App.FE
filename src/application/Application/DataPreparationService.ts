export class DataPreparationService {
    
    constructor() {
    }

    public async prepareInputData(file: Blob) {
        const fileData = await this.readFile(file);
        const base64String = this.arrayBufferToBase64(fileData);
        return base64String;
    }

    private readFile(file: Blob) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsArrayBuffer(file);
        });
    }
    
    private arrayBufferToBase64(buffer: any) {
        let binary = '';
        const bytes = new Uint8Array(buffer);
        const len = bytes.byteLength;
        for (let i = 0; i < len; i++) {
            binary += String.fromCharCode(bytes[i]);
        }
        return window.btoa(binary);
    }

}