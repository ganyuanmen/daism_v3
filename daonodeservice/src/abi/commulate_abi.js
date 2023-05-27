const commulate_abi={abi:[
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "init_iadd",
        "type": "address"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "previousOwner",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "newOwner",
        "type": "address"
      }
    ],
    "name": "OwnershipTransferred",
    "type": "event"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "eip3712_token_amount_A",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "pool_id_A",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "pool_id_B",
        "type": "uint256"
      }
    ],
    "name": "DaoTokenToDaoToken",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "_iadd",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "eip3712_token_amount",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "pool_id_A",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "pool_id_B",
        "type": "uint256"
      }
    ],
    "name": "daoTokenToExactDaoToken",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "unit_token_amount",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "pool_id",
        "type": "uint256"
      }
    ],
    "name": "daoTokenToExactUnitToken",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "eip3712_token_amount",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "pool_id",
        "type": "uint256"
      }
    ],
    "name": "daoTokenToUnitToken",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "owner",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "renounceOwnership",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "newOwner",
        "type": "address"
      }
    ],
    "name": "transferOwnership",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "unit_token_amount",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "pool_id",
        "type": "uint256"
      }
    ],
    "name": "unitTokenToDaoToken",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "eip3712_token_amount",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "pool_id",
        "type": "uint256"
      }
    ],
    "name": "unitTokenToExactDaoToken",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  }
]};
 module.exports=commulate_abi;