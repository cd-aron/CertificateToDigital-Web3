import {useState, useEffect} from "react";
import Web3 from "web3";
import certificateToNFT from "./contracts/certificateToNFT.json";

function App() {


  const[state, setState] = useState({web3:null, contract:null});
  const[account, setAccount] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  const [formData, setFormData] = useState({
    studentAddress:"",
    ipfs_hash:"",
  });


  const detailStyle = {
    height: '14px',
    width: '28em'
  };


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

      setState({web3:web3, contract:contract});
    }
       provider && template();
  },[]);

  const connectWallet = async () => {
    try{
      const accounts = await window.ethereum.request({method: 'eth_requestAccounts'});
      setAccount(accounts[0]);

    }
    catch (error) {
      alert("Error connecting to MetaMask: ");
    }
  };

  const handleChange = (event) => {
    const {name, value} = event.target;
     setFormData((prevFormData) => ({ ...prevFormData, [name]: value }));
  };

  const handleMintNFT = async () => {
    const {web3, contract} = state;
    const {studentAddress, ipfs_hash} = formData;

    console.log(contract);


    if(web3, contract) {
      try {
        const alreadyExists = await contract.methods.isCertificateNFTAlreadyExists(studentAddress).call();
        if(!alreadyExists) {
          const tx = await contract.methods.safeMint(studentAddress, ipfs_hash).send({from: account});
          console.log("Transaction Hash: ", tx.transactionHash);
          setFormData({studentAddress: "", ipfs_hash: ""});
        }
        else {
          setErrorMessage("Student Certificate NFT Already Exists");
        }

      }
      catch(error){
        setErrorMessage("Error minting NFT");
      }
    }else{
      setErrorMessage("Please Connect MetaMask wallet");
    }
  }




  return (
    <div className="App">
    <hr/>
    <h2 className="text-2xl font-bold ml-5">Create Certificate NFT</h2>


  <button className="bg-orange-500 hover:bg-orange-700 text-white font-bold py-2 px-4 mt-5 ml-5" onClick={connectWallet}>Connet Metamask</button>
      <p className="ml-5 mt-5"> Connected Account: {account} </p>

      <h2 className="ml-5 mt-5 font-bold" > Student Certificate to NFT </h2>

       {errorMessage && <p className="error-message">{errorMessage} </p>}
          <p className="ml-5 mt-5"> Student Address:  </p>
          <input type="text" name="studentAddress" value={formData.studentAddress} onChange={handleChange} className="ml-5 mt-5 "/>
           <br/>
          <p className="ml-5 mt-5"> IPFS Hash:  </p>
          <input type="text" name="ipfs_hash" value={formData.ipfs_hash} onChange={handleChange} className="ml-5 mt-5 w-6"/>
          <br/>
            <button type="button" onClick={handleMintNFT} className="mt-5 ml-5 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">Create NFT</button>


      <br/>



    </div>
  );
}

export default App;
