// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require("hardhat");

const CONTRACT_NAME = "PriceConsumerV3";

async function main() {

    // 账户信息验证
    const [deployer] = await ethers.getSigners();
    console.log(`\n🔨 使用部署账户: ${deployer.address}`);

    // 使用 provider 获取余额
    const balance = await ethers.provider.getBalance(deployer.address);
    console.log(`💰 账户余额: ${ethers.formatEther(balance)} ETH`); // 注意 formatEther 的使用方式变化

    // 获取合约工厂
    console.log(`\n🚀 开始部署 ${CONTRACT_NAME}...`);
    const ContractFactory = await hre.ethers.getContractFactory(CONTRACT_NAME);

    // 部署合约并等待完成
    const contract = await ContractFactory.deploy();
    await contract.waitForDeployment();  // 替换原 .deployed()

    // 获取部署后的合约地址
    console.log(`⏳ 等待交易确认...`);
    await contract.waitForDeployment(); // 使用新的等待方法
    console.log(`✅ 合约成功部署至地址: ${contract.target}`); // 注意 .target 替代 .address

    // // verify contract
    // if (hre.network.config.chainId == 11155111 && process.env.ETHERSCAN_API_KEY) {
    //     console.log("Waiting for 5 confirmations")
    //     await contract.deploymentTransaction().wait(5)
    //     await verifyContract(contract.target)
    // } else {
    //     console.log("verification skipped..")
    // }
}

async function verifyContract(contractAddr) {
    await hre.run("verify:verify", {
        address: contractAddr
    });
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
    console.error("❌ 部署失败:", error);
    process.exitCode = 1;
});