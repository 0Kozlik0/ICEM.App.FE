import './LogData.css';

function LogData() {
    
    return( 

        <div className='LogData-box'>
            <p>Estimated time: <span className='LogData-highlightText'>1h 30m</span></p>
            <p>Number of images processed: <span className='LogData-highlightText'>0/10</span></p>

            <div className='LogData-texAreaBox'>
                <textarea name="" id="" className='LogData-textArea' readOnly>
                    {`1\n2\n2\n2\n2\n2`}
                </textarea>
            </div>
        </div>
     );

}

export default LogData;