const DaoLogo_abi={abi:[
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "dao_registrar",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "dao_system_manage",
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
      }
    ],
    "name": "ChangeLogo",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "uint128",
        "name": "dao_id",
        "type": "uint128"
      }
    ],
    "name": "InitLogo",
    "type": "event"
  },
  {
    "inputs": [
      {
        "internalType": "uint128",
        "name": "dao_id",
        "type": "uint128"
      },
      {
        "components": [
          {
            "internalType": "string",
            "name": "fileType",
            "type": "string"
          },
          {
            "internalType": "bytes",
            "name": "fileContent",
            "type": "bytes"
          }
        ],
        "internalType": "struct File",
        "name": "dao_logo",
        "type": "tuple"
      }
    ],
    "name": "changeLogo",
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
    "name": "daoLogos",
    "outputs": [
      {
        "internalType": "string",
        "name": "fileType",
        "type": "string"
      },
      {
        "internalType": "bytes",
        "name": "fileContent",
        "type": "bytes"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "daoRegistrar",
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
    "name": "hasInited",
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
        "components": [
          {
            "internalType": "string",
            "name": "fileType",
            "type": "string"
          },
          {
            "internalType": "bytes",
            "name": "fileContent",
            "type": "bytes"
          }
        ],
        "internalType": "struct File",
        "name": "dao_logo",
        "type": "tuple"
      }
    ],
    "name": "initLogo",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
]};
 module.exports=DaoLogo_abi;