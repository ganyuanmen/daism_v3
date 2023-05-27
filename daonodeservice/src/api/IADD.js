const iadd_abi=require('../abi/_IADD_abi');
const utils = require("../utils");

/**
 * IADD 兑换事件
 */
class IADD
{
        //utoken 兑换 token事件 
    utokenTotokenEvent(maxBlockNumber,callbackFun) {
        const _this = this;
        if (!this.contract) this.contract = new this.web3.eth.Contract(this.abi, this.address, {from: this.account});
        this.u2tObj=this.contract.events.UnitTokenToDaoToken({filter: {},fromBlock: maxBlockNumber+1},
            async function (_error, data) {
                if(!data || !data.returnValues) {utils.log("utokenTotokenEvent error");return;}
                callbackFun.call(null,utils.valueFactory(data,{
                        "from": data.returnValues.spender, //兑换人
                        "to": data.returnValues.to, //目标人
                        "swap_time":await utils.getTime(_this.web3,data.blockNumber), //兑换时间戳
                        "tokenId":data.returnValues.id,
                        "utokenWei":data.returnValues.input_amount,
                        "tokenWei":data.returnValues.output_amount,
                        "utoken":(parseFloat(_this.web3.utils.fromWei(data.returnValues.input_amount,'ether'))/(9995/10000)).toFixed(4),
                        "token":parseFloat(_this.web3.utils.fromWei(data.returnValues.output_amount,'ether')).toFixed(4)
                    },
                    "utokenTotokenEvent")
                )
            }
        )
    }

    //token 兑换 utoken
    tokenToUtokenEvent(maxBlockNumber,callbackFun) {
        const _this = this;
        if (!this.contract) this.contract = new this.web3.eth.Contract(this.abi, this.address, {from: this.account});
        this.t2uObj=this.contract.events.DaoTokenToUnitToken({filter: {}, fromBlock: maxBlockNumber+1}, 
            async function (_error, data) {  
                if(!data || !data.returnValues) {utils.log("tokenToUtokenEvent error");return;}   
                callbackFun.call(null,utils.valueFactory(data,
                    {
                        "from": data.returnValues.spender,
                        "to": data.returnValues.to,
                        "swap_time":await utils.getTime(_this.web3,data.blockNumber),
                        "tokenId":data.returnValues.id,
                        "utokenWei":data.returnValues.output_amount,
                        "tokenWei":data.returnValues.input_amount,
                        "utoken":parseFloat(_this.web3.utils.fromWei(data.returnValues.output_amount,'ether')).toFixed(4),
                        "token":(parseFloat(_this.web3.utils.fromWei(data.returnValues.input_amount,'ether'))/(9985/10000)).toFixed(4)
                        // "token":parseFloat(_this.web3.utils.fromWei(data.returnValues.input_amount,'ether')).toFixed(4)
                    },
                    "tokenToUtokenEvent")
                )
            }
        )
    }

    //eth 兑换 token 同时触发eth to utoken  和utoken to token 事件
    ETHToDaoToken(maxBlockNumber,callbackFun) {
        const _this = this;
        if (!this.contract) this.contract = new this.web3.eth.Contract(this.abi, this.address, {from: this.account});
        this.t2tObj=this.ethtotokenObj=this.contract.events.ETHToDaoToken({filter: {}, fromBlock: maxBlockNumber+1},
            async function (_error, data) {  
                if(!data || !data.returnValues) {utils.log("ETHToDaoToken error");return;}   
                callbackFun.call(null,utils.valueFactory(data, 
                    {
                        "from": data.returnValues.spender,
                        "to": data.returnValues.to,
                        "swap_time":await utils.getTime(_this.web3,data.blockNumber),
                        "input_amount":parseFloat(_this.web3.utils.fromWei(data.returnValues.input_amount,'ether')).toFixed(4),
                        "output_amount":parseFloat(_this.web3.utils.fromWei(data.returnValues.output_amount,'ether')).toFixed(4)
                    },
                    "ETHToDaoToken")
                )
            }
        )
    }

    // //取消后置0
    // getReal(v){
    //     var b=v.split('');
    //     for(var i=1;i<b.length;i++)
    //          {
    //              if(b[i]!='0')
    //              break               
    //          }
    //     return v.substr(i);

    // }

    //获dao流动池中的币值(utoken)
    async getPool(_id) {
        if(!this.contract)  this.contract=new this.web3.eth.Contract(this.abi,this.address , {from: this.account});
        let result= await this.contract.methods.pools(_id).call({from: this.account});
        return {utoken: this.web3.utils.fromWei(result.unit_token_supply,'ether'),utokenWei:result.unit_token_supply};
    
    }
       
    //取消订阅
    unsub()
    {
        try{
            if(this.u2tObj && this.u2tObj.unsubscribe){this.u2tObj.unsubscribe();}
            if(this.t2uObj && this.t2uObj.unsubscribe){this.t2uObj.unsubscribe();}
            if(this.t2tObj && this.t2tObj.unsubscribe){this.t2tObj.unsubscribe();}
            if(this.ethtotokenObj && this.ethtotokenObj.unsubscribe){this.ethtotokenObj.unsubscribe();}
            
            this.u2tObj=null;this.t2uObj=null;this.t2tObj=null;
        }catch(e){console.log(e);}
    }

    constructor(_web3,_account,_address) {
        this.web3=_web3;
        this.account=_account;
        this.address=_address;
        this.abi=iadd_abi.abi
       }
   }
   
   module.exports=IADD