
#  道易程网站

道易程网站是一个专注于道易程智能合约API使用和信息发布的平台。我们的合约API涵盖了道易程各种代币和兑换的功能，以及用户的各种统计信息，为用户提供便捷的交易和转换服务。同时，我们采用了activityPub协议来支持信息发布，这使得其他联邦软件可以方便地订阅并获取道易程发布的信息。我们致力于为用户提供高效、安全和便利的智能合约服务和信息共享平台。在道易程网站上，您可以轻松地使用智能合约API进行代币交易和兑换，并获取关于您的统计信息。我们的平台使用activityPub协议，让您的信息能够被其他联邦软件方便地订阅和获取。我们致力于为用户提供高效、安全和便利的智能合约服务和信息共享平台。

## 网站的部署

采用 docker compose 部署, 
```js

docker compose up -d

```

## 配置文件

config 目录下

- web_config.json 网站配置

```js
{
  # 0 表示不使用https协议， 1 表示使用https协议
  "HTTPS": "1",  

  #域名
  "DOMAIN": "nngym.cn",

  #网站端口号， 注：该端口号要与docker-compose.yml 中的网站端口号一致。
  "PORT": "443",

  # https 证书的相关文件
  "PRIVKEY_PATH": "config/private.key",
  "CERT_PATH": "config/public.crt",
  "CA_PATH": "config/ca.crt"
}

```

::: tip HTTPS 配置说明
设置HTTPS为0时，表示不使用https协议。网站无法与其它联邦宇宙软件通讯，因为其它联邦宇宙软件使用的是https协议，而https协议的网站是无法访问http协议的网站。使用http协议可以使用道易程和智能合约接口，但无法使用activityPub协议。如果要完整的使用网站的功能，建议使用https证书。
:::

- mysql_config.json 连接数据库及其它参数配置


```js
{
  # 数据库主机名
  "host":"daism-mysql",

  #帐户
  "user":"root",

  #密码 注 要与docker-compose.yml 中的MYSQL_ROOT_PASSWORD 一致。
  "password":"Dao..123",

  #数据库名称，固定值， 不要修改
  "database":"dao_db",

  #端口号
  "port":"3306",

  #智能合约新部署的网络  sepolia(测试网络) ，goerli(测试网络)，mainnet(主网)
  "network":"sepolia",

  # 0 打印调试信息 1 不打印
  "debugger_level":"1"
}


```

- redis_config.json 连接redis数据库参数配置


```js

{
  #主机
  "host":"daism-redis",
  "password":"222333",
  "port":"6379"
}

```


 > 

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


