import { User1Svg } from "../../../lib/jssvg/SvgCollection";
import ShowAddress from "../../ShowAddress";

//islocal 是否本地帐号， 有钱包地址可以显示 hw 图片宽高，
export default function EnkiMember({messageObj,isLocal,hw=48})
{
    return( 
    <a href={messageObj.actor_url || messageObj.url} className="daism-a"  target="_blank"  >
        <div className="d-inline-flex align-items-center" >
           
                {messageObj.avatar?
                <img src={messageObj.avatar} alt='' width={hw} height={hw} style={{borderRadius:'10px'}} />
                :<User1Svg size={hw} />
                }
           
        
            <div style={{paddingLeft:'10px'}} >
                <div>{messageObj.actor_account || messageObj.account}</div>
                {isLocal && <ShowAddress address={messageObj.manager} />}
            </div>
        </div>
    </a>
    );
}

