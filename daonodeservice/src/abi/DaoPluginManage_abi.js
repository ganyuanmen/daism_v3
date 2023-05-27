const DaoPluginManage_abi={abi:[
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "dao_software_version_control",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "dao_system_manage",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "turn_to_static_call",
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
        "internalType": "uint256",
        "name": "dao_delegator_full_id",
        "type": "uint256"
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
      }
    ],
    "name": "Install",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "dao_delegator_full_id",
        "type": "uint256"
      }
    ],
    "name": "Recover",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "dao_delegator_full_id",
        "type": "uint256"
      },
      {
        "indexed": true,
        "internalType": "uint128",
        "name": "software_old_id",
        "type": "uint128"
      },
      {
        "indexed": true,
        "internalType": "uint128",
        "name": "software_new_id",
        "type": "uint128"
      },
      {
        "indexed": false,
        "internalType": "uint128",
        "name": "software_version_old_id",
        "type": "uint128"
      },
      {
        "indexed": false,
        "internalType": "uint128",
        "name": "software_version_new_id",
        "type": "uint128"
      }
    ],
    "name": "Replace",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "dao_delegator_full_id",
        "type": "uint256"
      }
    ],
    "name": "Uninstall",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "dao_delegator_full_id",
        "type": "uint256"
      },
      {
        "indexed": true,
        "internalType": "uint128",
        "name": "software_id",
        "type": "uint128"
      },
      {
        "indexed": false,
        "internalType": "uint128",
        "name": "software_version_old_id",
        "type": "uint128"
      },
      {
        "indexed": false,
        "internalType": "uint128",
        "name": "software_version_new_id",
        "type": "uint128"
      }
    ],
    "name": "Update",
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
    "inputs": [],
    "name": "daoSystemManage",
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
        "name": "",
        "type": "uint128"
      }
    ],
    "name": "delegatorAmount",
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
        "name": "",
        "type": "address"
      }
    ],
    "name": "delegatorToDelegatorFullId",
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
        "name": "",
        "type": "uint256"
      }
    ],
    "name": "garbageCan",
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
        "internalType": "address",
        "name": "delegator",
        "type": "address"
      }
    ],
    "name": "getStatusIsNormal",
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
    "name": "install",
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
        "internalType": "uint128",
        "name": "dao_id",
        "type": "uint128"
      },
      {
        "internalType": "uint128",
        "name": "dao_delegator_id",
        "type": "uint128"
      }
    ],
    "name": "recover",
    "outputs": [],
    "stateMutability": "nonpayable",
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
        "name": "dao_delegator_id",
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
    "name": "replace",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint128",
        "name": "",
        "type": "uint128"
      },
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
    "name": "turnToStaticCall",
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
        "name": "dao_delegator_id",
        "type": "uint128"
      }
    ],
    "name": "uninstall",
    "outputs": [],
    "stateMutability": "nonpayable",
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
        "name": "dao_delegator_id",
        "type": "uint128"
      },
      {
        "internalType": "uint128",
        "name": "software_version_id",
        "type": "uint128"
      }
    ],
    "name": "update",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
]};
 module.exports=DaoPluginManage_abi;