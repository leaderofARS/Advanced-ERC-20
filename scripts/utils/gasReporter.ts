import { ethers } from "hardhat";

interface GasReport {
  functionName: string;
  gasUsed: bigint;
  gasPrice: bigint;
  cost: bigint;
  costInEth: string;
}

class GasReporter {
  private reports: GasReport[] = [];

  async recordTransaction(
    functionName: string,
    txPromise: Promise<any>
  ): Promise<any> {
    const tx = await txPromise;
    const receipt = await tx.wait();
    
    const gasUsed = receipt.gasUsed;
    const gasPrice = tx.gasPrice || receipt.gasPrice || 0n;
    const cost = gasUsed * gasPrice;
    
    const report: GasReport = {
      functionName,
      gasUsed,
      gasPrice,
      cost,
      costInEth: ethers.formatEther(cost)
    };
    
    this.reports.push(report);
    
    console.log(`⛽ ${functionName}: ${gasUsed.toString()} gas (${report.costInEth} ETH)`);
    
    return tx;
  }

  printSummary(): void {
    console.log("\n📊 Gas Usage Summary");
    console.log("=".repeat(60));
    
    let totalGas = 0n;
    let totalCost = 0n;
    
    this.reports.forEach(report => {
      console.log(`${report.functionName.padEnd(25)} | ${report.gasUsed.toString().padStart(10)} gas | ${report.costInEth.padStart(12)} ETH`);
      totalGas += report.gasUsed;
      totalCost += report.cost;
    });
    
    console.log("=".repeat(60));
    console.log(`${"TOTAL".padEnd(25)} | ${totalGas.toString().padStart(10)} gas | ${ethers.formatEther(totalCost).padStart(12)} ETH`);
    console.log("=".repeat(60));
  }

  getReports(): GasReport[] {
    return [...this.reports];
  }

  clear(): void {
    this.reports = [];
  }
}

export { GasReporter, GasReport };