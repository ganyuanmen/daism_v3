'use strict';
const GetInfos = require('./api/GetInfos');
const DaoRegistrar = require('./api/DaoRegistrar');
const App = require('./api/App');
const DaoToken = require('./api/DaoToken');
const DaoLogo = require('./api/DaoLogo');
const IADD = require('./api/IADD');
const UnitToken = require('./api/UnitToken');
const EventSum = require('./api/EventSum');
const DaoPluginManage=require("./api/DaoPluginManage")
const daismAddress = require('./abi/address');

class DaoApi {
    unsub() {
        this.DaoRegistrar.unsub();
        this.App.unsub();
        this.DaoLogo.unsub();
        this.DaoToken.unsub();
        this.IADD.unsub();
        this.UnitToken.unsub();
        this.EventSum.unsub();

    } 
 
    get GetInfos() { if (!this.dao_getInfos_obj) this.dao_getInfos_obj = new GetInfos(this.web3, this.account,daismAddress[this.network]['GetInfos']); return this.dao_getInfos_obj; }
    get DaoRegistrar() { if (!this.dao_register_obj) this.dao_register_obj = new DaoRegistrar(this.web3, this.account,this.GetInfos,daismAddress[this.network]['DaoRegistrar']); return this.dao_register_obj; }
    get App() { if (!this.dao_app_obj) this.dao_app_obj = new App(this.web3, this.account,daismAddress[this.network]['app']); return this.dao_app_obj; }
    get DaoLogo() { if (!this.dao_logo_obj) this.dao_logo_obj = new DaoLogo(this.web3, this.account,daismAddress[this.network]['DaoLogo']); return this.dao_logo_obj; }
    get DaoToken() { if (!this.dao_token_obj) this.dao_token_obj = new DaoToken(this.web3, this.account,daismAddress[this.network]['DaoToken']); return this.dao_token_obj; }
    get IADD() { if (!this.dao_iadd_obj) this.dao_iadd_obj = new IADD(this.web3, this.account,daismAddress[this.network]['_IADD']); return this.dao_iadd_obj; }
    get UnitToken() { if (!this.dao_uToken_obj) this.dao_uToken_obj = new UnitToken(this.web3, this.account,daismAddress[this.network]['UnitToken']); return this.dao_uToken_obj; }
    get EventSum() { if (!this.dao_eventSum_obj) this.dao_eventSum_obj = new EventSum(this.web3, this.account,daismAddress[this.network]['EventHappenAddress']); return this.dao_eventSum_obj; }
    get DaoPluginManage() { if (!this.dao_plugn_obj) this.dao_plugn_obj = new DaoPluginManage(this.web3, this.account,daismAddress[this.network]['DaoPluginManage']); return this.dao_plugn_obj; }
 
    constructor(_web3, _account,_network) {
        this.web3 = _web3;
        this.account = _account;
        this.network=_network
    }
}

if (typeof window === 'object') {
    window.Daoapi = function (_web3, _account,_network) {
        return new DaoApi(_web3, _account,_network)
    }
    window.Daoapi.default = window.Daoapi;
}

module.exports = DaoApi