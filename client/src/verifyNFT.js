import React, { useState, useEffect } from "react";
import Web3 from "web3";
import { Document, Page } from 'react-pdf';

import certificateToNFT from "./contracts/certificateToNFT.json";
import { pdfjs } from 'react-pdf';

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.mjs`;


function VerifyNFT() {
  const [state, setState] = useState({ web3: null, contract: null });
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [pdfBlob,setPdfBlob] = useState(null);

  useEffect(() => {
    if (window.ethereum) {
      const provider = window.ethereum;

      const loadContract = async () => {
        const web3 = new Web3(provider);
        const networkId = await web3.eth.net.getId();
        const deployedNetwork = certificateToNFT.networks[networkId];
        const contract = new web3.eth.Contract(certificateToNFT.abi, deployedNetwork && deployedNetwork.address);

        setState({ web3: web3, contract: contract });
      };

      provider && loadContract();
    }
  }, []);

  const handleNFTVerification = async () => {
    const { web3, contract } = state;
    const studentAddress = document.querySelector("#StudentAddress").value;


    if (web3 && contract && studentAddress) {
      try {
        const alreadyExists = await contract.methods.isCertificateNFTAlreadyExists(studentAddress).call();
        const response = await contract.methods.getIpfsHash(studentAddress).call();

        if (alreadyExists) {
          console.log("NFT Verified IPFS Hash: ", response);
          setSuccessMessage(`Certificate is Verified \n Certificate Owner: ${response.student}`);

          const ipfsGateway = "https://maroon-bitter-prawn-966.mypinata.cloud/ipfs/"; // Replace with your Pinata gateway URL if needed
            const pdfUrl = `${ipfsGateway}${response.ipfs_hash}`;

            const pdfResponse = await fetch(pdfUrl); // Fetch the PDF data
            const pdfBlob = await pdfResponse.blob();
            setPdfBlob(pdfBlob);

          setErrorMessage("");
        } else {
          setErrorMessage("Student Certificate NFT not Issued");
          setSuccessMessage("");
        }
      } catch (error) {
        console.error("Error verifying NFT:", error);
        setErrorMessage("Error verifying NFT");
        setSuccessMessage("");
      }
    } else {
      setErrorMessage("Please connect MetaMask, enter student address, and ensure a certificate NFT exists for this address.");
      setSuccessMessage("");
    }
  };

  const detailStyle = {
    width: '30em',
    padding: '10px',
    margin: '10px 0',
    border: '1px solid #ccc',
    borderRadius: '4px',
  };



  return (
    <div style={{ textAlign: 'center', padding: '20px' }}>
    <h2 className="text-3xl font-extrabold text-blue-500 mt-6">Student Certificate Verification</h2>

      <p className="mt-7 text-xl">Student Address:</p>
      <input type="text" id="StudentAddress" style={detailStyle} />
      <br/>
      <button onClick={handleNFTVerification} class="text-white mt-3 bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800">Verify Certificate</button>
      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
      {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}

      {pdfBlob && (
   <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>

           <p>Certificate PDF:</p>
     <Document file={pdfBlob}>
       <Page pageNumber={1} /> {/* Render the first page by default */}
     </Document>
   </div>
 )}
    </div>
  );
}

export default VerifyNFT;
