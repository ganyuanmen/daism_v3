const utils = require("../utils");
const register_abi=require('../abi/DaoRegistrar_abi');

//dao注册事件
class DaoRegistrar
{
    //dao 注册事件
    daoCreateEvent(maxBlockNumber,callbackFun) {
        const _this = this;
        if (!this.contract) this.contract = new this.web3.eth.Contract(this.abi, this.address, { from: this.account });
        this.installobj=this.contract.events.CreateDao({filter: {},fromBlock: maxBlockNumber+1}, 
            async function (_error, data) {
                if(!data || !data.returnValues) {utils.log("daoCreateEvent error:"+_error);return;}
                const dao_id=data['returnValues']['dao_id']
                const _info=await  _this.infos.getDaoInfo(dao_id)
                
                console.log(_info)

                const _accounts_votes= await _this.infos.getAccount_Votes(dao_id)
             //   console.log(_accounts_votes)
                callbackFun.call(null,utils.valueFactory(data,
                    {
                        "daoId": dao_id,
                        "manager":_info[0]['manager'], //管理员
                        // "isToken":_info[0]['hasToken'], // 是否发布token
                        "name":_info[0]['name'], //dao 名称 
                        "symbol":_info[0]['symbol'], // dao 符号
                        "describe":_info[0]['desc'], // dao 描述
                        "accounts_votes":_accounts_votes, //成员及票权
                        "creator":_info[1],
                        "delegator":_info[2]['delegator'],
                        "time":await utils.getTime(_this.web3,data.blockNumber),
                        "address":_info[1] //执行人
                    },
                "daoCreateEvent")
                )
            }
        )
    }

   unsub()
   {
       try{
           if(this.installobj && this.installobj.unsubscribe) {this.installobj.unsubscribe();}
           this.installobj=null;
       } catch(e){console.log(e);}
   }

    constructor(_web3,_account,_infos,_address) {
        this.web3=_web3;
        this.infos=_infos;
        this.account=_account;     
        this.address=_address;
        this.abi=register_abi.abi
    }
}
module.exports=DaoRegistrar