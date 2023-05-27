const uToken_abi=require('../abi/UnitToken_abi');
const utils = require("../utils");

 // utoken事件
 class UnitToken
{
    //eth 兑换 token事件
    swapEvent(maxBlockNumber,callbackFun) {
        const _this = this;
        if (!this.contract) this.contract = new this.web3.eth.Contract(this.abi, this.address, {from: this.account});
        this.swapObj1=this.contract.events.Swap({filter: {},fromBlock: maxBlockNumber+1}, 
          async  function (_error, data) {
                if(!data || !data.returnValues) {utils.log("swapEvent error");return;}
                callbackFun.call(null,utils.valueFactory(data,
                    {
                        "address": data.returnValues[0], //兑换地址
                        "ethAmount":parseFloat(_this.web3.utils.fromWei(data.returnValues[1],'ether')).toFixed(4), 
                        "utokenAmount":parseFloat(_this.web3.utils.fromWei(data.returnValues[2],'ether')).toFixed(4),
                        "swapTime": await utils.getTime(_this.web3,data.blockNumber)
                    },
                    "swapEvent")
                )
            }
        )
    }

    //deth 兑换utoken 事件
    swapByGasToken(maxBlockNumber,callbackFun) {
        const _this = this;
        if (!this.contract) this.contract = new this.web3.eth.Contract(this.abi, this.address, {from: this.account});
        this.swapObj2=this.contract.events.SwapByGasToken({filter: {}, fromBlock: maxBlockNumber+1}, 
            async function (_error, data) {
                if(!data || !data.returnValues) {utils.log("swapByGasToken error"); return;}
                callbackFun.call(null,utils.valueFactory(data,
                    {
                        "fromAddress": data.returnValues[0],
                        "toAddress": data.returnValues[1],
                        "ethAmount":parseFloat(_this.web3.utils.fromWei(data.returnValues[2],'ether')).toFixed(4),
                        "utokenAmount":parseFloat(_this.web3.utils.fromWei(data.returnValues[3],'ether')).toFixed(4),
                        "swapTime":await utils.getTime(_this.web3,data.blockNumber)
                    },
                "swapByGasToken")
                )
            }
        )
    }
      
    //取消订阅
    unsub()
    {
        try{
            if(this.swapObj1 && this.swapObj1.unsubscribe) this.swapObj1.unsubscribe();
            if(this.swapObj2 && this.swapObj2.unsubscribe) this.swapObj2.unsubscribe();
            this.swapObj1=null; this.swapObj2=null;   
        }
        catch(e){ console.log(e); }
    }

   
    constructor(_web3,_account,_address) {
        utils.log("utoken start....");
        this.web3=_web3;
        this.account=_account;
        this.address=_address;
        this.abi=uToken_abi.abi
      }
  }
  
  module.exports=UnitToken