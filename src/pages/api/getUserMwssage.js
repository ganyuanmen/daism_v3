import { getUser } from "../../lib/mysql/daism";

export default async function handler(req, res) {
 
  const {newAccount,oldAccount} = req.query


    if (!newAccount && !oldAccount) {return res.status(400).json({errMsg:'Bad request.'});}
    else {
      let re=await getUser({newAccount,oldAccount});
      console.log("========================")
      console.log(re);
      console.log("========================")
      res.json(re);
    }
  }
  