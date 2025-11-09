import { run } from "hardhat";

async function verifyContract(
  contractAddress: string,
  constructorArguments: any[]
) {
  console.log("Verifying contract...");
  
  try {
    await run("verify:verify", {
      address: contractAddress,
      constructorArguments: constructorArguments,
    });
    console.log("Contract verified successfully");
  } catch (error: any) {
    if (error.message.toLowerCase().includes("already verified")) {
      console.log("Contract already verified");
    } else {
      console.error("Verification failed:", error.message);
    }
  }
}

async function main() {
  // Example usage - replace with actual deployment parameters
  const contractAddress = process.env.CONTRACT_ADDRESS || "";
  const constructorArgs = [
    "Advanced ERC20 Token", // name
    "AERC20",              // symbol
    18,                    // decimals
    "1000000000000000000000000", // maxSupply (1M tokens)
    100,                   // transferFee (1%)
    process.env.TREASURY_ADDRESS || "", // treasury
    50,                    // burnRate (50%)
    "10000000000000000000000"    // transferLimit (10K tokens)
  ];

  if (!contractAddress) {
    console.error("Please set CONTRACT_ADDRESS environment variable");
    process.exit(1);
  }

  await verifyContract(contractAddress, constructorArgs);
}

if (require.main === module) {
  main()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
}

export { verifyContract };