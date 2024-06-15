var certificateToNFT = artifacts.require("certificateToNFT");

module.exports = function(deployer) {
  const admin = "0xE6bF504DaeD61B33Ea340c80985B67d36c10E20e";
  deployer.deploy(certificateToNFT, admin, "Diploma","CCCT");
};
