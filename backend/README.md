# Chainlink dApp Example backend

## tutorial
    mkdir chainlink-dapp-example
    cd chainlink-dapp-example
    mkdir backend
    cd backend
    code ./

## Vscode:Create a new terminal
    npm init -y
    npm install --save-dev hardhat
    npx hardhat init
    (choose create javascript project, choose default parameters)

    npm install --save-dev @chainlink/contracts
    npm install --save-dev dotenv

## Infura
    We recommend signing up for a free Infura or Alchemy account to get an RPC URL.

## .env example:
    SEPOLIA_RPC_URL='https://sepolia.infura.io/v3/xxxxxxxxxxxxxxxxxxx'
    PRIVATE_KEY='xxxxxxxxxxxxxxxxxxxxxxx'

## deploy
    npx hardhat compile
    npx hardhat run --network sepolia scripts/deploy.js