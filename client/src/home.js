import React, {useState, useEffect} from "react";
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from "react-router-dom";
import Web3 from "web3";
import certificateToNFT from "./contracts/certificateToNFT.json";

function HomePage() {
    const[state, setState] = useState({web3:null, contract: null});
    const[account, setAccount] = useState(null);

       useEffect(() => {
          if(window.ethereum){
            const provider = window.ethereum;
          }
        }, []);

        useEffect(() => {
          const provider = window.ethereum;

          async function template(){
            const web3 = new Web3(provider);
            const networkId = await web3.eth.net.getId();
            const deployedNetwork = certificateToNFT.networks[networkId];
            const contract = new web3.eth.Contract(certificateToNFT.abi, deployedNetwork.address);
            console.log(contract);
            setState({web3:web3, contract:contract});
          }
             provider && template();
        },[]);

   const connectMetaMask = async () => {
      try{
        const accounts = await window.ethereum.request({method: 'eth_requestAccounts'});
        setAccount(accounts[0]);
        console.log(accounts);

        const { web3, contract } = state;

        if (!contract || !web3) {
            console.error("Contract or web3 instance not found");
            return;
        }

        const userType = await contract.methods.login().call({ from: accounts[0] });
          console.log("User type:", userType.userType);

          // Perform actions based on user type
          switch (userType.userType) {
              case '0':
                  console.log("User type is None");
                  // Handle None user type
                  break;
              case '1':
                  console.log("User type is Institute");
                  // Handle Institute user type
                  break;
              case '2':
                  console.log("User type is Student");
                  // Handle Student user type
                  break;
              default:
                  console.log("Unknown user type");
            }

      }
      catch (error) {
        alert("User doesn't exists");
      }
   }



  const navigate = useNavigate();

 const verifyStudentCertificate = () => {
   navigate('/nft');
 };

  return (
    <div className="container mx-auto p-4 pt-6 md:p-6 lg:p-12">
        <h1 className="text-3xl font-bold mb-4 text-center">SVIS - Secure Verification & Immutable Storage</h1>
        <p className="text-lg mb-4 text-center">Welcome to our innovative electronic-based degree and certificate system, designed to easily get integrated <br/>  with traditional college certificate systems. Our solution ensures tamper-proof, immutable, and verifiable storage,<br/>  providing students with secure ownership and authenticity of their credentials,<br/>  while automating the verification process for enhanced accessibility and reliability.
  </p>

        <div className="flex justify-center mb-4 mt-20">
          <button className="bg-orange-500 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded"  onClick={verifyStudentCertificate}>Verify Student Certificate</button>
        </div>
      </div>
  );
}

export default HomePage;
