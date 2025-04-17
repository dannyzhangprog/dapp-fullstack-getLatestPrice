// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require("hardhat");

async function main() {
    // 获取合约工厂
    const PriceConsumer = await hre.ethers.getContractFactory("PriceConsumerV3");
    
    // 部署合约并等待完成
    const priceConsumer = await PriceConsumer.deploy();
    await priceConsumer.waitForDeployment();  // 替换原 .deployed()

    // 获取部署后的合约地址
    const address = await priceConsumer.getAddress();
    console.log("Contract deployed to:", address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});