
document.getElementById('checkBalance').addEventListener('click', async () => {
    const walletAddress = document.getElementById('walletAddress').value;
    const tokenAddress = document.getElementById('tokenSelect').value;
    const balanceElement = document.getElementById('balance');

    if (!window.ethereum) {
        balanceElement.innerText = "Please install a Web3 wallet!";
        return;
    }

    const web3 = new Web3(window.ethereum);

    
    const abi = [
        {
            "constant": true,
            "inputs": [{"name": "_owner", "type": "address"}],
            "name": "balanceOf",
            "outputs": [{"name": "balance", "type": "uint256"}],
            "payable": false,
            "stateMutability": "view",
            "type": "function"
        },
        {
            "constant": true,
            "inputs": [],
            "name": "decimals",
            "outputs": [{"name": "", "type": "uint8"}],
            "payable": false,
            "stateMutability": "view",
            "type": "function"
        }
    ];

    try {
        
        await window.ethereum.request({ method: 'eth_requestAccounts' });

    
        if (!tokenAddress) {
            balanceElement.innerText = "Please select a token.";
            return;
        }

        let balance;

        if (tokenAddress === 'ETH') {
            
            const balanceWei = await web3.eth.getBalance(walletAddress);
            balance = web3.utils.fromWei(balanceWei, 'ether');
            
            
            const ethToUsdtRate = 2612.93; 
            const usdtValue = (balance * ethToUsdtRate).toFixed(2);
            
            balanceElement.innerText = `Balance: ${balance} ETH (~${usdtValue} USDT)`;
            return;
        } else if (tokenAddress === '0xdac17f958d2ee523a2206206994597c13d831ec7') { 
            
            const tokenContract = new web3.eth.Contract(abi, tokenAddress);
            
    
            const balanceWei = await tokenContract.methods.balanceOf(walletAddress).call();

            
            const decimals = await tokenContract.methods.decimals().call();
            balance = balanceWei / Math.pow(10, decimals);
            
            balanceElement.innerText = `Balance: ${balance} USDT`;
        } else {
            
            const tokenContract = new web3.eth.Contract(abi, tokenAddress);

            
            const balanceWei = await tokenContract.methods.balanceOf(walletAddress).call();

    
            const decimals = await tokenContract.methods.decimals().call();
            balance = balanceWei / Math.pow(10, decimals);
            
            balanceElement.innerText = `Balance: ${balance} Tokens`;
        }
        
    } catch (error) {
        console.error(error);
        balanceElement.innerText = "Error fetching balance. Please check your wallet address.";
    }

});
