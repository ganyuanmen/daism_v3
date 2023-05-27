const utils = require("../utils");
const eventSum_abi=require('../abi/EventHappenAddress_abi');

 //执行提案事件
class EventSum
{
   //执行提案事件
    async  execEvent(maxBlockNumber,callbackFun) {
        const _this = this;
        if (!this.contract) this.contract = new this.web3.eth.Contract(this.abi, this.address, {from: this.account});
        this.execobj=this.contract.events.Exec({filter: {}, fromBlock: maxBlockNumber+1}, 
            async function (_error, data) {
                if(!data || !data.returnValues) {utils.log("execEvent error");return;}
                callbackFun.call(null,utils.valueFactory(data,
                    {
                        "proHash": data.returnValues['_hash'], //提案hash
                        "voteDel":data.returnValues['system_delegator'], //代理地址
                        "address":await utils.getAccount(_this.web3,data.transactionHash), //执行人
                        "time":await utils.getTime(_this.web3,data.blockNumber) //时间戳
                    },
                    "execEvent")
                )
            }
        )
    }

    //取消订阅
    unsub()
    {
        try{
            if(this.execobj && this.execobj.unsubscribe){this.execobj.unsubscribe();}
            this.execobj=null;
        } catch(e){console.log(e);}
    }
    constructor(_web3,_account,_address) {
        this.web3=_web3;
        this.account=_account;
        this.address=_address;
        this.abi=eventSum_abi.abi
    }
}

module.exports=EventSum