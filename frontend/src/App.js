// App.js
import React, { useEffect, useState, useCallback } from 'react';
import { ethers } from "ethers";

function App() {
  const [storedPrice, setStoredPrice] = useState('');
  const [contract, setContract] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // 初始化合约连接
  useEffect(() => {
    const initContract = async () => {
      try {
        // 检查MetaMask是否安装
        if (!window.ethereum) {
          setError('请安装MetaMask钱包');
          return;
        }

        // 请求账户访问权限
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        
        // 初始化provider和signer
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        
        // 合约配置
        const contractAddress = '0x80cD6373B339Ab4c3B983682067516f0a1E0341a';
        const ABI = [
          {
            "inputs": [],
            "stateMutability": "nonpayable",
            "type": "constructor"
          },
          {
            "inputs": [],
            "name": "getLatestPrice",
            "outputs": [
              {
                "internalType": "int256",
                "name": "",
                "type": "int256"
              }
            ],
            "stateMutability": "view",
            "type": "function"
          },
          {
            "inputs": [],
            "name": "storeLastPrice",  // 修正函数名匹配合约
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
          },
          {
            "inputs": [],
            "name": "storedPrice",
            "outputs": [
              {
                "internalType": "int256",
                "name": "",
                "type": "int256"
              }
            ],
            "stateMutability": "view",
            "type": "function"
          }
        ];

        setContract(new ethers.Contract(contractAddress, ABI, signer));
      } catch (err) {
        setError(`连接钱包失败: ${err.message}`);
      }
    };

    initContract();
  }, []);

  // 获取价格方法（使用useCallback优化）
  const getStoredPrice = useCallback(async () => {
    if (!contract) return;
    
    try {
      setLoading(true);
      const contractPrice = await contract.storedPrice();
      setStoredPrice(parseInt(contractPrice) / 100000000);
      setError('');
    } catch (err) {
      setError(`获取价格失败: ${err.message}`);
    } finally {
      setLoading(false);
    }
  }, [contract]);

  // 自动获取最新价格
  useEffect(() => {
    if (contract) {
      getStoredPrice();
    }
  }, [contract, getStoredPrice]);

  // 更新价格方法
  const updatePrice = async () => {
    try {
      setLoading(true);
      const transaction = await contract.storeLastPrice(); // 修正函数名
      await transaction.wait();
      await getStoredPrice();
      setError('');
    } catch (err) {
      setError(`更新价格失败: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="row mt-5">
        
        {/* 错误提示 */}
        {error && (
          <div className="alert alert-danger">
            {error}
            <button 
              className="btn-close ms-2"
              onClick={() => setError('')}
            />
          </div>
        )}

        <div className="col">
          <h3>Stored Price</h3>
          {loading ? (
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          ) : (
            <p>Stored ETH/USD Price: {storedPrice}</p>
          )}
        </div>

        <div className="col">
          <h3>Update Price</h3>
          <button 
            type="button" 
            className="btn btn-dark" 
            onClick={updatePrice}
            disabled={loading}
          >
            {loading ? '处理中...' : '立即更新'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;