// import { getData } from "../../lib/mysql/common";
import { messagePageData } from "../../lib/mysql/message";


export default async function handler(req, res) {
    let account = req.query.account;
    let pi=req.query.pi;

    if (!account) {return res.status(400).json({errMsg:'Bad request.'});}
    else {
      let re=await messagePageData({ps:10,pi:pi,w:4,v:account});
      res.json(re);
    }
  }
  