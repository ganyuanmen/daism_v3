const EventHappenAddress_abi={abi:[
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "system_delegator",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "bytes32",
        "name": "_hash",
        "type": "bytes32"
      }
    ],
    "name": "Exec",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "address",
        "name": "system_delegator",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint16",
        "name": "index",
        "type": "uint16"
      },
      {
        "indexed": false,
        "internalType": "address",
        "name": "_account",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint32",
        "name": "_vote",
        "type": "uint32"
      }
    ],
    "name": "SetAccount",
    "type": "event"
  },
  {
    "inputs": [
      {
        "internalType": "bytes32",
        "name": "_hash",
        "type": "bytes32"
      }
    ],
    "name": "exec",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint16",
        "name": "index",
        "type": "uint16"
      },
      {
        "internalType": "address",
        "name": "_account",
        "type": "address"
      },
      {
        "internalType": "uint32",
        "name": "_vote",
        "type": "uint32"
      }
    ],
    "name": "setAccount",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
]};
 module.exports=EventHappenAddress_abi;