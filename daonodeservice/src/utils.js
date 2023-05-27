class Utils{
 
   async getTime(web3,blockNumber)
    {
     
        let _timestamp=(new Date()).getTime().toString().substring(0,10)
        if(!blockNumber) return _timestamp
        let timeObj= await web3.eth.getBlock(blockNumber);
        if(!timeObj)  timeObj= await web3.eth.getBlock(blockNumber);
        if(timeObj && timeObj.timestamp) _timestamp=timeObj.timestamp;
        return _timestamp;
    }

    async getAccount(web3,transactionHash)
    {
        if(!transactionHash) return ""
        let _from='';
        let addressObj=await  web3.eth.getTransactionReceipt(transactionHash);
        if(!addressObj) addressObj=await  web3.eth.getTransactionReceipt(transactionHash);
        if(!addressObj) addressObj=await  web3.eth.getTransactionReceipt(transactionHash);
        if(addressObj && addressObj.from) _from=addressObj.from;
        return _from;
    }

    valueFactory(obj,data,event)
    {
        const {address,blockHash,blockNumber,transactionHash,transactionIndex}=obj
        return {address,blockHash,blockNumber,transactionHash,transactionIndex,data,event}
    }

    log(str) {
        var myDate = new Date();
        console.log(myDate.getFullYear() + '-' + (myDate.getMonth() + 1) + '-' + myDate.getDate() + ' ' + myDate.getHours() + ":" + myDate.getMinutes() + ":" + myDate.getSeconds() + "-->" + str)
    }

//  toWei(v) {
//     let a = v + '';
//     let _a = a.split('.');
//     if (_a.length == 1) {
//         for (let i = 0; i < 18; i++) {
//             a += '0';
//         }

//     }
//     else {

//         a = _a[0] + '' + '' + _a[1] + '';

//         let _b = _a[1].length;
//         for (let i = 0; i < 18 - _b; i++) {
//             a += '0'
//         }

//     }
//     return a;
// }

//  fromWei(v) {
//     if (typeof v == 'string') {
//         let _a = v.split('').reverse();
//         let _b = _a.length
//         if (_a.length < 18) {
//             for (let i = 0; i < 18 - _b; i++) {
//                 _a.push('0');
//             }
//         }
//         _a.splice(18, 0, ".")
//         if (_a[_a.length - 1] == '.') {
//             _a.push('0')
//         }
//         let _c = _a.reverse().join('');
//         return _c;
//     }
//     else console.error(v + " not string !")
// }

}

module.exports= new Utils();    