const { ethers } = require("hardhat");

async function deploy(signer, arbiter, beneficiary, value) {
  const Escrow = await ethers.getContractFactory("Escrow", signer);
  const escrow = await Escrow.deploy(arbiter, beneficiary, { value });
  await escrow.deployed();
  console.log(`Escrow contract deployed to: ${escrow.address}`);
  return escrow;
}

async function main() {
  const [signer] = await ethers.getSigners(); // Get the first signer (default account)
  const arbiter = "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266"; // Replace with the arbiter's address
  const beneficiary = "0x70997970C51812dc3A010C7d01b50e0d17dc79C8"; // Replace with the beneficiary's address
  const value = ethers.utils.parseEther("1.0"); // Example value to deposit (1 ETH)

  await deploy(signer, arbiter, beneficiary, value);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
