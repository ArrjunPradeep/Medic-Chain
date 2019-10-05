const Medical = artifacts.require("MedicalChain");

module.exports = function(deployer) {
  // Use deployer to state migration tasks.
  deployer.deploy(Medical);
};
