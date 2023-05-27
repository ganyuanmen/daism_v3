const erc20s_abi=require('../abi/DaoToken_abi');
const utils = require("../utils");
/**
 * token 事件
 */
class DaoToken
{
    //发布token事件
    publishTokenEvent(maxBlockNumber,callbackFun) {
        const _this = this;  
        if (!this.contract) this.contract = new this.web3.eth.Contract(this.abi, this.address, { from: this.account });
        this.tObj=this.contract.events.Issue({filter: {},fromBlock: maxBlockNumber+1},
            async function (_error, data) {   
                if(!data || !data.returnValues) {utils.log("publishTokenEvent error");return;}        
                callbackFun.call(null, utils.valueFactory(data,
                    { 
                        "tokenId": data.returnValues['eip3712_id'], 
                        "daoId": data.returnValues['dao_id'],
                        "timestamp": await utils.getTime(_this.web3,data.blockNumber)
                    },
                    "publishTokenEvent")
                )
            }
        )
    }
    async balanceOf(_id,_address) {
        if (!this.contract) this.contract = new this.web3.eth.Contract(this.abi, this.address, { from: this.account });
        let val= await this.contract.methods.balanceOf(_id,_address).call({ from: this.account })
        return parseFloat(this.web3.utils.fromWei(val,'ether')).toFixed(4)
    }

    //取消订阅
    unsub()
    {
        try{
            if(this.tObj && this.tObj.unsubscribe){this.tObj.unsubscribe();}
            this.tObj=null;
        }catch(e){console.log(e);}
    }

    constructor(_web3,_account,_address) {
        this.web3=_web3;
        this.account=_account;
        this.address=_address;
        this.abi=erc20s_abi.abi
    }
}

module.exports=DaoToken