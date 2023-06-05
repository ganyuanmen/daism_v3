
#  道易程前端api（daoapi）

daoapi 是一个专门用于操作道易程dao 合约的api， 封装了与智能合约交互的操作过程。让用户以函数的方式直接调用以太坊的智能合约。

## 安装 daoapi
```js
npm install daoapi --save
或
yarn add daoapi

```

## 安装依赖包
 > daoapi 依赖 ethers.js 和 jszip.js, 需要安装依赖包

```js
npm install ethers --save 或 yarn add ethers
npm install jszip --save 或 yarn add jszip
```

## 引用

 ```js
 import { ethers } from "ethers";
 import { DaoApi } from "daoapi" 
 ```


使用ethers 连接到以太坊服务器后， 执行：
```js
 const ethersProvider = new ethers.providers.Web3Provider(provider);
 let _network="goerli" // 允许取值goerli,ropsten,mainnet,local
 let daoapi = new Daoapi(ethers, ethersProvider,account,_network); //account 用户钱包地址
```

## webpack 项目使用示例
```js
import { ethers } from "ethers";
import { DaoApi } from "daoapi"
import Web3Modal from "web3modal";


//连接钱包
async function connect() {
  const providerOptions = {  // 空对象，默认使用metamask 
     // walletconnect: {
       //   package: WalletConnectProvider,
       //   options: {
        //      infuraId: "9676a35d629d488fb90d7eac1348c838"
        //  }
   //   }
  };

  const web3Modal = new Web3Modal({
      cacheProvider: false,
      providerOptions,
      disableInjectedProvider: false
  });

  const provider = await web3Modal.connect();
  return provider;
}

async function onConnect() {
    const provider=connect()
    let account=provider.selectedAddress
    let _network="goerli" // 允许取值goerli,ropsten,mainnet,local
    let daoapi = new DaoApi(ethers, provider,account,_network)
    console.log(daoapi.version)
 
  //修改地址：
  //daoapi.Commulate.setAddress("0x.....")
  //daoapi.UnitToken.setAddress("0x.....")

  //修改api
  //daoapi.Commulate.setAbi([])
  //daoapi.UnitToken.setAbi([])

  //获限tokenId 为1的代币余额
  let result= await daoapi.dao_erc20s.balanceOf('1',account)
  console.log(result);

}

onConnect()

```
## html 使用示例
```html
<!DOCTYPE html>
<html>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>daoapi demo</title>
        <script src='./dist/daoApi.js'></script>  
		<script src="https://cdn.ethers.io/lib/ethers-5.2.umd.min.js"  type="application/javascript"></script>
        <script>
		  var Daoapi = window.Daoapi.default;	  
		//连接钱包
		async function connect() {
		  const provider = new ethers.providers.Web3Provider(window.ethereum)
		  provider.send("eth_requestAccounts", []).then(accounts=>{
			  console.log(accounts[0])
			  onConnect(provider,accounts[0])
		  })
		}

		async function onConnect(provider,account) {
      let _network="goerli" // 允许取值goerli,ropsten,mainnet,local
			let daoapi = new Daoapi(ethers, provider,account,_network)
			console.log(daoapi.version)
		 
		  //修改地址：
		  //daoapi.Commulate.setAddress("0x.....")
		  //daoapi.UnitToken.setAddress("0x.....")

		  //修改api
		  //daoapi.Commulate.setAbi([])
		  //daoapi.UnitToken.setAbi([])

          //获限tokenId 为1的代币余额
		  let result= await daoapi.dao_erc20s.balanceOf('1',account)
		  console.log(result);
		}

		window.addEventListener('load', async () => {
			 connect()
		});

        </script>   
    </head>
    <body> 
    </body> 
</html>
```
## nodejs 使用示例
```js
 const { ethers } = require("ethers");
 const { DaoApi } = require("DaoApi");
 let privateKey = "113d3edf949820b4c3b91d9311b31f903bb15d1e317b46efe29828f0e3fdb517";

 let provider = ethers.getDefaultProvider('goerli');
 let wallet = new ethers.Wallet(privateKey,provider);
 let _network="goerli" // 允许取值goerli,ropsten,mainnet,local
 let daoapi = new DaoApi(ethers, wallet,wallet.address,_network)
 console.log(daoapi.version)

//修改地址：
//daoapi.Commulate.setAddress("0x.....")
//daoapi.UnitToken.setAddress("0x.....")

//修改api
//daoapi.Commulate.setAbi([])
//daoapi.UnitToken.setAbi([])


 const getInfo=async (daoapi)=>{
    let aa=await wallet.getBalance();
    console.log(aa.toString())
    //获限tokenId 为1的代币余额
    let result= await daoapi.dao_erc20s.balanceOf('1',wallet.address)
    console.log(result);
 }

 getInfo(daoapi)
 
```


