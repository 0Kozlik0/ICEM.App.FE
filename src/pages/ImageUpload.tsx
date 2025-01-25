import LoadData from '../components/common/LoadData';
import LogData from '../components/common/LogData';
import Footer from '../components/layout/Footer';

function ImageUpload() {
    return (
        <>
            <div>
                {/* <div className='App-headerBg'>
                    <h1 className='App-header'>Image Upload</h1>
                </div>
                <hr className='App-hr'/> */}
                <LoadData />
                {/* <hr className='App-hr App-hrLog'/> */}
            </div>
            <Footer />
        </>
    );
}

export default ImageUpload; 