const app_abi={abi:[
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "enum SoftwareType",
        "name": "software_type",
        "type": "uint8"
      },
      {
        "indexed": true,
        "internalType": "uint128",
        "name": "software_id",
        "type": "uint128"
      }
    ],
    "name": "AddSoftware",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "enum SoftwareType",
        "name": "software_type",
        "type": "uint8"
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
    "name": "AddSoftwareVersion",
    "type": "event"
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
        "internalType": "enum SoftwareType",
        "name": "software_type",
        "type": "uint8"
      },
      {
        "internalType": "string",
        "name": "software_name",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "software_desc",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "software_version_desc",
        "type": "string"
      },
      {
        "internalType": "address",
        "name": "software_proxytarget",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "software_plugin_manager",
        "type": "address"
      }
    ],
    "name": "addSoftware",
    "outputs": [
      {
        "internalType": "uint128",
        "name": "software_id",
        "type": "uint128"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "enum SoftwareType",
        "name": "software_type",
        "type": "uint8"
      },
      {
        "internalType": "string",
        "name": "software_version_desc",
        "type": "string"
      },
      {
        "internalType": "uint128",
        "name": "software_id",
        "type": "uint128"
      },
      {
        "internalType": "address",
        "name": "software_proxytarget",
        "type": "address"
      }
    ],
    "name": "addSoftwareVersion",
    "outputs": [
      {
        "internalType": "uint128",
        "name": "software_version_id",
        "type": "uint128"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "enum SoftwareType",
        "name": "software_type",
        "type": "uint8"
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
    "inputs": [],
    "name": "next_software_plugin_id",
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
    "inputs": [],
    "name": "next_software_system_id",
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
        "internalType": "uint128",
        "name": "",
        "type": "uint128"
      }
    ],
    "name": "softwarePluginInfos",
    "outputs": [
      {
        "internalType": "address",
        "name": "manager",
        "type": "address"
      },
      {
        "internalType": "string",
        "name": "name",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "desc",
        "type": "string"
      },
      {
        "internalType": "uint128",
        "name": "latestVersion",
        "type": "uint128"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "",
        "type": "string"
      }
    ],
    "name": "softwarePluginNameToInfo",
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
    "name": "softwarePluginVersions",
    "outputs": [
      {
        "internalType": "string",
        "name": "desc",
        "type": "string"
      },
      {
        "internalType": "address",
        "name": "proxyTarget",
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
    "name": "softwareSystemInfos",
    "outputs": [
      {
        "internalType": "string",
        "name": "name",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "desc",
        "type": "string"
      },
      {
        "internalType": "uint128",
        "name": "latestVersion",
        "type": "uint128"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "",
        "type": "string"
      }
    ],
    "name": "softwareSystemNameToInfo",
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
    "name": "softwareSystemVersions",
    "outputs": [
      {
        "internalType": "string",
        "name": "desc",
        "type": "string"
      },
      {
        "internalType": "address",
        "name": "proxyTarget",
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
        "name": "newOwner",
        "type": "address"
      }
    ],
    "name": "transferOwnership",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
]};
 module.exports=app_abi;