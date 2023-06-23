const { ethers } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();

  //deploy nft contract
  const NftContract = await ethers.getContractFactory("NFT");
  const nftDeployed = await NftContract.deploy();
  console.log("nft contract address is", nftDeployed.address);
  //deploy marketplace contract
  const marketplaceContract = await ethers.getContractFactory("Marketplace");
  const marketplaceDeployed = await marketplaceContract.deploy(1);
  console.log("nft contract address is", marketplaceDeployed.address);

  console.log("Deploying contracts with the account:", deployer.address);
  console.log("Account balance:", (await deployer.getBalance()).toString());

  // deploy contracts here:

  // For each contract, pass the deployed contract and name to this function to save a copy of the contract ABI and address to the front end.
  saveFrontendFiles(nftDeployed, "NFT");
  saveFrontendFiles(marketplaceDeployed, "Marketplace");
}

function saveFrontendFiles(contract, name) {
  const fs = require("fs");
  const contractsDir = __dirname + "/../../frontend/contractsData";

  if (!fs.existsSync(contractsDir)) {
    fs.mkdirSync(contractsDir);
  }

  fs.writeFileSync(
    contractsDir + `/${name}-address.json`,
    JSON.stringify({ address: contract.address }, undefined, 2)
  );

  const contractArtifact = artifacts.readArtifactSync(name);

  fs.writeFileSync(
    contractsDir + `/${name}.json`,
    JSON.stringify(contractArtifact, null, 2)
  );
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
