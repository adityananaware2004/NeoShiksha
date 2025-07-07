
import { Route, Routes } from 'react-router-dom';
import {Home} from './pages/Home'
import { useState } from 'react';



function App() {
  
  return (
    <div className=' relative w-screen min-h-screen bg-richblack-900 flex flex-col font-inter'>
      
      <Routes>
        <Route path='/' element={<Home/>} />
      </Routes>
    </div>
  );
  
}

export default App;
