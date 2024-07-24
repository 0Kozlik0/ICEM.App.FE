import React, { useState } from 'react';
import './App.css';
import LoadData  from './common/LoadData';
import LogData  from './common/LogData';


const App = () => {

  return (
    <div>

      <div className='App-headerBg'><h1 className='App-header'>ICEM - tool</h1></div>

      <hr className='App-hr'/>

      <LoadData/>
    
      <hr className='App-hr'/>

      <LogData/>

      <button className='App-ShowReportButton'>Show Report</button>

    </div>
  );
};

export default App;