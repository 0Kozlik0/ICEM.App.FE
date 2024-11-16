import LoadData from '../components/common/LoadData';
import LogData from '../components/common/LogData';

function Home() {
    return (
        <div>
            <div className='App-headerBg'>
                <h1 className='App-header'>IKEM - tool</h1>
            </div>
            <hr className='App-hr'/>
            <LoadData />
            <hr className='App-hr App-hrLog'/>
            {/* <LogData /> */}
            {/* <button className='App-ShowReportButton'>Show Report</button> */}
        </div>
    );
}

export default Home; 