import React from "react";
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from "react-router-dom";
import Form from "./Form";
import NFT from "./NFT";
import VerifyNFT from "./verifyNFT";
import Certificate from './Certificate';
import HomePage from './home';

function NavigationBar() {
  return (
    <nav style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: '#3572EF', padding: '8px 0',}}>
      <Link to="/" style={linkStyle}>Home</Link>
      <Link to="/form" style={linkStyle}>Form</Link>
    </nav>
  );
}


const linkStyle = {
  padding: '8px',
  margin: '0 10px',
  textDecoration: 'none',
  color: 'white',
};



function App() {


  return (
    <Router>
      <div className="App">
       <NavigationBar/>
        <Routes>

          <Route path="/" element={<HomePage />} />
          <Route path="/form" element={<Form />} />
          <Route path="/nft" element={<VerifyNFT />} />
          <Route path="/certificate" element={<Certificate />} /> {/* New route for Certificate */}
        </Routes>
      </div>
    </Router>
  );
}


export default App;
