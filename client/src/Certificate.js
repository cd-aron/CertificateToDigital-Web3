import React, {useState} from 'react';
import { useLocation } from 'react-router-dom';

import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

import axios from 'axios';

import NFT from "./NFT";



function Certificate() {
  const location = useLocation();
  const formData = location.state?.formData || {};

  const containerStyle = {
    border: '2px solid black',
    padding: '20px',
    width: '700px',
    margin: '20px auto',
    textAlign: 'center',
    fontFamily: 'Arial, sans-serif',
    backgroundColor: '#f9f9f9',
  };


  const detailStyle = {
    fontSize: '18px',
    marginBottom: '10px',
  };

  const buttonContainerStyle = {
   display: 'flex',
   justifyContent: 'center',
   gap: '10px',
   marginTop: '20px',
 };

  const [loader, setLoader] = useState(false);

  const generatePDF = async(action) => {
     const capture = document.querySelector('.certificate');
     setLoader(true);

     html2canvas(capture, {scale: 2}).then((canvas) => {
       const imgData = canvas.toDataURL('image/png');
       const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: [297, 210] });
       const pdfWidth = doc.internal.pageSize.getWidth();
       const pdfHeight = doc.internal.pageSize.getHeight();

       const imgWidth = canvas.width;
       const imgHeight = canvas.height;

       const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
       const width = imgWidth * ratio;
       const height = imgHeight * ratio;

       const x = (pdfWidth - width) / 2;
       const y = (pdfHeight - height) / 2;

       doc.addImage(imgData, 'PNG',x,y,width,height);
       setLoader(false);

        const pdfBlob = doc.output('blob');

      if (action === 'download') {

        doc.save(`${formData.registerNo}.pdf`);

      } else if (action === 'store') {
         uploadToIPFS(pdfBlob);
      }

     });
  };

  const [uploadResponse, setUploadResponse] = useState(null);
  const [uploadSuccess, setUploadSuccess] = useState(null);
  const rollno = formData.registerNo;
 const certificateNo = formData.certificateNo;

  const uploadToIPFS = async (pdfBlob) => {
  try {
    const data = new FormData();
    data.append('file', pdfBlob, `${rollno}.pdf`);
    const metadata = JSON.stringify({
      name: rollno,
      keyvalues: {
        certificateNo: certificateNo,
        registerNo: rollno,
      },
    });
    data.append('pinataMetadata', metadata);

    const options = JSON.stringify({
      cidVersion: 0,
    });
    data.append('pinataOptions', options);

    const res = await axios.post(
      'https://api.pinata.cloud/pinning/pinFileToIPFS',
      data,
      {
        headers: {
          'Content-Type': `multipart/form-data; boundary=${data._boundary}`,
          'pinata_api_key': '',
          'pinata_secret_api_key': '',
        },
      }
    );

    setUploadResponse(res.data);
    setUploadSuccess(true);
    setTimeout(() => {
        setLoader(false);
      }, 10000);
  } catch (error) {
    alert('Error uploading to IPFS');
    setLoader(false);
  }
};



  return (
    <div className="main" >
    <div className="certificate bg-white shadow-lg rounded-lg p-8 w-full max-w-4xl border-4 border-gray-300" style={containerStyle}>
         <h2 className="text-2xl font-bold text-center mb-6">STATE BOARD OF TECHNICAL EDUCATION, SIKKIM</h2>

         <div className="relative w-full mb-7">
           <p className="absolute left-0 text-m">Certificate No: {formData.certificateNo || 'N/A'}</p>
           <h2 className="font-sans md:font-serif text-center text-2xl">Diploma</h2>
         </div>

         <p className="italic mb-4">This is to certify that</p>
         <p className="mb-4">
           Mr./Ms. {formData.studentName || 'N/A'} </p>
         <p className="mb-4">
           bearing registration number<span> {formData.registerNo || 'N/A'} </span>, have undergone
         </p>
         <p className="mb-4">
           prescribed course of studies for a period from <span>{formData.staringPeriod || 'N/A'}</span> till <span>{formData.endingPeriod || 'N/A'}</span>
         </p>

         <p className="italic text-center mb-4">at</p>

         <p className="mb-4"> {formData.department || 'N/A'} </p>

         <p className="mb-4">
           has been declared passed with a CGPA of <span>{formData.cgpa || 'N/A'}</span>
         </p>
         <p className="text-right mt-8">
           Date of Issue: {formData.dateOfIssue || 'N/A'}
         </p>
       </div>

    <div style={buttonContainerStyle}>
    <button type="button" onClick={() => generatePDF('download')} className="text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800">Downoad</button>
    <button type="button" onClick={() => generatePDF('store')} className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">Store to IPFS</button>
    </div>


        {loader && <p>Loading...</p>}

        {uploadResponse && (
          <div>
            <h3>Upload Response:</h3>
            <pre>{JSON.stringify(uploadResponse, null, 2)}</pre>
          </div>
        )}

        {uploadSuccess && <NFT />}



    </div>
  );
}

export default Certificate;
