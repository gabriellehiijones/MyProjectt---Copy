import './App.css';
import React from 'react';
import Register from './Register'
import Home from './Home'
import Tryagain from './Tryagain'
import { BrowserRouter , Route, Routes,  } from 'react-router-dom';
import Redirect from './Redirect';
import FileUpload from './Upload';
import ImageDownload from './Download';
import Video from './Video';


function App() {
  return (
    
    <div className="App">
    <BrowserRouter>
        <Routes>
        <Route path='/' element={<> <Home /><Register /></>}/>
        <Route path="/Home" element={<Home></Home>} />
        <Route path="/Register" element={< Register />} />
        <Route path="/Tryagain" element={<Tryagain />} />
        <Route path="/Redirect" element={<Redirect />} />
        <Route path="/Upload" element={< FileUpload />} />
        <Route path="/Download" element={< ImageDownload />} />
        <Route path="/Video" element={< Video />} />



        </Routes>
    </BrowserRouter>
    </div>
    
  );
}

export default App;
