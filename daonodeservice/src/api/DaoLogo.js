const logo_abi=require('../abi/DaoLogo_abi');
const utils = require("../utils");
const JSZip= require('jszip')

//logo 事件
 class DaoLogo {

     /**根据daoId获取logo图片
     * @param {int} id daoId
     * @returns 
     */
    async getLogo(id) {
        let re = await this.contract.methods.daoLogos(id).call({ from: this.account });
        let result = await this.get_async_file(re[0], re[1]);
        return { src: result };
    }

   /** 异步处理文件，根据后缀名还原图片的base64编码
    * @param {string} file_type 图片文件后缀名
    * @param {string} bytesStr 图片16进制编码
    * @returns 
    */
    get_async_file(file_type, bytesStr) {
        return new Promise(function (resolve, reject) {
            //16进制的文件编码 转成 Uint8Array格式的数组
            let len = bytesStr.length / 2 - 1;
            let array = new Uint8Array(len);
            for (let k = 0; k < len; k++) {
                array[k] = parseInt(bytesStr.slice(2 + k * 2, 2 + k * 2+2), 16);
            }

            if (file_type == 'zip') { //解压
                let new_zip = new JSZip();
                new_zip.loadAsync(Buffer.from(array.buffer))
                .then(function (mzip) {
                    //文件名
                    let fileName = Object.keys(mzip.files)[0];
                    mzip.file(fileName).async("nodebuffer").then(blob => {
                        let fileNames = fileName.split('.');
                        let fileType = fileNames[fileNames.length - 1];
                        if (fileType == 'svg') 
                            resolve('data:image/svg+xml;base64,' + blob.toString('base64'))
                        else 
                            resolve('data:image/' + fileType + ';base64,' + blob.toString('base64'))
                    });
                });
            } else {
                resolve('data:image/' + file_type + ';base64,' + Buffer.from(array.buffer).toString('base64'))
            }
        });
    }
   
   
    //创建logo事件
    setLogoEvent(maxBlockNumber,callbackFun) {
        const _this = this;
        if (!this.contract) this.contract = new this.web3.eth.Contract(this.abi, this.address, { from: this.account });
        this.eventObj1=this.contract.events.InitLogo({filter: {},fromBlock: maxBlockNumber+1},
            async function (_error, data) {  
                if(!data || !data.returnValues) {utils.log("setLogoEvent error"); return;}
                let img=await _this.getLogo(data.returnValues['dao_id'])
                callbackFun.call(null, utils.valueFactory(data,
                     {
                        "daoId": data.returnValues['dao_id'],
                        "src": img.src, //带data:image的字串
                        "timestamp": await utils.getTime(_this.web3,data.blockNumber),
                    },
                    "setLogoEvent")
                )   
            }
        )
    }

    //修改logo事件
    changeLogoEvent(maxBlockNumber,callbackFun) {
        const _this = this
        if (!this.contract) this.contract = new this.web3.eth.Contract(this.abi, this.address, { from: this.account });
        this.eventObj2=this.contract.events.ChangeLogo({filter: {},fromBlock: maxBlockNumber+1}, 
            async function (_error, data) { 
                // console.log(data)
                if(!data || !data.returnValues) {utils.log("changeLogoEvent error");return;}
                let img=await _this.getLogo(data.returnValues['dao_id'])
                callbackFun.call(null,utils.valueFactory(data, 
                    {
                        "daoId": data.returnValues.dao_id,
                        "src": img.src, //带data:image的字串
                        "timestamp": await utils.getTime(_this.web3,data.blockNumber),
                    },
                    "changeLogoEvent")
                )        
            }
        )
    } 

    //取消订阅
    unsub(){
        try{
            if(this.eventObj2 && this.eventObj2.unsubscribe){this.eventObj2.unsubscribe()}
            if(this.eventObj1 && this.eventObj1.unsubscribe){this.eventObj1.unsubscribe()}
            this.eventObj2=null;this.eventObj1=null;
        }catch(e){console.log(e);}
    }
 
    constructor(_web3,_account,_address) {
        this.web3=_web3;
        this.account=_account;
        this.address = _address;
        this.abi=logo_abi.abi
    }
}

module.exports=DaoLogo