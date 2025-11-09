import { ethers } from "hardhat";
import { AnalyticsHooks } from "../../typechain-types";

async function assignRoles(tokenAddress: string, userAddress: string, roles: string[]) {
  const [signer] = await ethers.getSigners();
  
  console.log("Connecting to token at:", tokenAddress);
  const token = await ethers.getContractAt("AnalyticsHooks", tokenAddress) as AnalyticsHooks;
  
  // Role constants
  const ROLES = {
    DEFAULT_ADMIN_ROLE: await token.DEFAULT_ADMIN_ROLE(),
    MINTER_ROLE: await token.MINTER_ROLE(),
    BURNER_ROLE: await token.BURNER_ROLE(),
    PAUSER_ROLE: await token.PAUSER_ROLE(),
    COMPLIANCE_ROLE: await token.COMPLIANCE_ROLE(),
    GOVERNOR_ROLE: await token.GOVERNOR_ROLE(),
    ANALYTICS_ROLE: await token.ANALYTICS_ROLE()
  };

  console.log("Assigning roles to:", userAddress);
  
  for (const roleName of roles) {
    const roleBytes = ROLES[roleName as keyof typeof ROLES];
    if (!roleBytes) {
      console.error(`Unknown role: ${roleName}`);
      continue;
    }
    
    const hasRole = await token.hasRole(roleBytes, userAddress);
    if (hasRole) {
      console.log(`User already has ${roleName}`);
      continue;
    }
    
    console.log(`Granting ${roleName}...`);
    const tx = await token.grantRole(roleBytes, userAddress);
    await tx.wait();
    console.log(`${roleName} granted successfully`);
  }
}

async function revokeRoles(tokenAddress: string, userAddress: string, roles: string[]) {
  const [signer] = await ethers.getSigners();
  
  console.log("Connecting to token at:", tokenAddress);
  const token = await ethers.getContractAt("AnalyticsHooks", tokenAddress) as AnalyticsHooks;
  
  // Role constants
  const ROLES = {
    DEFAULT_ADMIN_ROLE: await token.DEFAULT_ADMIN_ROLE(),
    MINTER_ROLE: await token.MINTER_ROLE(),
    BURNER_ROLE: await token.BURNER_ROLE(),
    PAUSER_ROLE: await token.PAUSER_ROLE(),
    COMPLIANCE_ROLE: await token.COMPLIANCE_ROLE(),
    GOVERNOR_ROLE: await token.GOVERNOR_ROLE(),
    ANALYTICS_ROLE: await token.ANALYTICS_ROLE()
  };

  console.log("Revoking roles from:", userAddress);
  
  for (const roleName of roles) {
    const roleBytes = ROLES[roleName as keyof typeof ROLES];
    if (!roleBytes) {
      console.error(`Unknown role: ${roleName}`);
      continue;
    }
    
    const hasRole = await token.hasRole(roleBytes, userAddress);
    if (!hasRole) {
      console.log(`User doesn't have ${roleName}`);
      continue;
    }
    
    console.log(`Revoking ${roleName}...`);
    const tx = await token.revokeRole(roleBytes, userAddress);
    await tx.wait();
    console.log(`${roleName} revoked successfully`);
  }
}

async function main() {
  const tokenAddress = process.env.TOKEN_ADDRESS || "";
  const userAddress = process.env.USER_ADDRESS || "";
  const roles = (process.env.ROLES || "").split(",").filter(r => r.trim());
  const action = process.env.ACTION || "grant"; // grant or revoke
  
  if (!tokenAddress || !userAddress || roles.length === 0) {
    console.error("Please set TOKEN_ADDRESS, USER_ADDRESS, and ROLES environment variables");
    console.error("Example: ROLES=MINTER_ROLE,PAUSER_ROLE");
    process.exit(1);
  }
  
  if (action === "grant") {
    await assignRoles(tokenAddress, userAddress, roles);
  } else if (action === "revoke") {
    await revokeRoles(tokenAddress, userAddress, roles);
  } else {
    console.error("ACTION must be 'grant' or 'revoke'");
    process.exit(1);
  }
}

if (require.main === module) {
  main()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
}

export { assignRoles, revokeRoles };