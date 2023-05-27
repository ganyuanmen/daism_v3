const DaoSystemManage_abi={abi:[
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "dao_software_version_control",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "dao_registrar",
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
        "internalType": "uint128",
        "name": "dao_id",
        "type": "uint128"
      },
      {
        "indexed": true,
        "internalType": "uint128",
        "name": "software_id",
        "type": "uint128"
      },
      {
        "indexed": true,
        "internalType": "uint128",
        "name": "software_version_id",
        "type": "uint128"
      },
      {
        "indexed": false,
        "internalType": "address",
        "name": "delegator",
        "type": "address"
      }
    ],
    "name": "InstallSystem",
    "type": "event"
  },
  {
    "inputs": [],
    "name": "daoSoftwareVersionControl",
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
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "name": "delegatorToDaoId",
    "outputs": [
      {
        "internalType": "uint128",
        "name": "",
        "type": "uint128"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "delegator",
        "type": "address"
      }
    ],
    "name": "getProxyTarget",
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
        "internalType": "uint128",
        "name": "dao_id",
        "type": "uint128"
      },
      {
        "internalType": "uint128",
        "name": "software_id",
        "type": "uint128"
      },
      {
        "internalType": "uint128",
        "name": "software_version_id",
        "type": "uint128"
      }
    ],
    "name": "installSystem",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "delegator",
        "type": "address"
      }
    ],
    "name": "isDelegator",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint128",
        "name": "",
        "type": "uint128"
      }
    ],
    "name": "softwareInstallInfos",
    "outputs": [
      {
        "internalType": "uint128",
        "name": "software_id",
        "type": "uint128"
      },
      {
        "internalType": "uint128",
        "name": "software_version_id",
        "type": "uint128"
      },
      {
        "internalType": "address",
        "name": "delegator",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "supportGasToken",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "pure",
    "type": "function"
  }
]};
 module.exports=DaoSystemManage_abi;