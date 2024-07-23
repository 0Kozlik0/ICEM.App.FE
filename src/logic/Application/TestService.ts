export class TestService {

    private test: () => void;
    
    constructor() {
        this.test = () => {
            console.log('TestServise');
        };
    }

    public testMethod(): void {
        console.log('Hello Test');
    }
}