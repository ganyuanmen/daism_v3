const GetInfos_abi={abi:[
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_delegator_manage_system",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "_dao_registrar",
        "type": "address"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "constructor"
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
    "name": "delegator_manage_system",
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
        "name": "dao_id",
        "type": "uint256"
      }
    ],
    "name": "getAccount_Votes",
    "outputs": [
      {
        "components": [
          {
            "internalType": "address",
            "name": "account",
            "type": "address"
          },
          {
            "internalType": "uint32",
            "name": "vote",
            "type": "uint32"
          }
        ],
        "internalType": "struct AccountInfo[20]",
        "name": "account_infos",
        "type": "tuple[20]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "dao_id",
        "type": "uint256"
      }
    ],
    "name": "getDaoInfo",
    "outputs": [
      {
        "components": [
          {
            "internalType": "string",
            "name": "name",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "symbol",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "desc",
            "type": "string"
          },
          {
            "internalType": "address",
            "name": "manager",
            "type": "address"
          },
          {
            "internalType": "bool",
            "name": "hasToken",
            "type": "bool"
          }
        ],
        "internalType": "struct DaoInfo",
        "name": "",
        "type": "tuple"
      },
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      },
      {
        "components": [
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
        "internalType": "struct SoftwareInstallInfo",
        "name": "",
        "type": "tuple"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  }
]};
 module.exports=GetInfos_abi;