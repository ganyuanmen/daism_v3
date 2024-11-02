// import { useTranslations } from 'next-intl'
// import { useState } from "react"
import PageLayout from '../../../components/PageLayout'
// import ShowErrorBar from "../../components/ShowErrorBar";
// import Loadding from "../../components/Loadding";
// import DaosPage from "../../components/home/DaosPage";
// import useDaoList from '../../hooks/useDaoList';
// import CreateDao from '../../components/my/CreateDao';


export default function mySC() {
//   const t = useTranslations('Common')
//   const [currentPageNum, setCurrentPageNum] = useState(1) //当前页
//   const [orderIndex, setOrderIndex] = useState(0)
//   const [orderField, setOrderField] = useState("dao_time") //排序字段
//   const [searchText, setSearchText] = useState("") //模糊查询内容
//   const [orderType, setOrderType] = useState(false) //排序类型
//   const daosData =useDaoList({currentPageNum, orderField, searchText, orderType})

//   const setRefresh=()=>{setOrderIndex(1)}
let aa=[]
for(let i=0;i<600;i++)
{aa[i]=i}

  return (
    <PageLayout>
       
       <div style={{width:'100%'}} className="clearfix">
		   <div className="scleft">
		     
		   111111111111111111111<br/>
		      q<br/> q<br/> q<br/> q<br/> q<br/> q<br/> q<br/> q<br/> 我是最后一行<br/>  
              111111111111111111111<br/>
		      q<br/> q<br/> q<br/> q<br/> q<br/> q<br/> q<br/> q<br/> 我是最后一行<br/>  
            
		   </div> 
          <div className="scright">
             wwwwwww<br/> wwwwwww<br/> wwwwwww<br/> wwwwwww<br/> wwwwwww<br/> wwwwwww<br/> 
             wwwwwww<br/> wwwwwww<br/> wwwwwww<br/> wwwwwww<br/> wwwwwww<br/> wwwwwww<br/> 
             wwwwwww<br/> wwwwwww<br/> wwwwwww<br/> wwwwwww<br/> wwwwwww<br/> wwwwwww<br/> 
             wwwwwww<br/> wwwwwww<br/> wwwwwww<br/> wwwwwww<br/> wwwwwww<br/> wwwwwww<br/> 
             wwwwwww<br/> wwwwwww<br/> wwwwwww<br/> wwwwwww<br/> wwwwwww<br/> wwwwwww<br/> 
             wwwwwww<br/> wwwwwww<br/> wwwwwww<br/> wwwwwww<br/> wwwwwww<br/> wwwwwww<br/>  
             wwwwwww<br/> wwwwwww<br/> wwwwwww<br/> wwwwwww<br/> wwwwwww<br/> wwwwwww<br/> 
             wwwwwww<br/> wwwwwww<br/> wwwwwww<br/> wwwwwww<br/> wwwwwww<br/> wwwwwww<br/> 
             wwwwwww<br/> wwwwwww<br/> wwwwwww<br/> wwwwwww<br/> wwwwwww<br/> wwwwwww<br/> 
             wwwwwww<br/> wwwwwww<br/> wwwwwww<br/> wwwwwww<br/> wwwwwww<br/> wwwwwww<br/> 
             wwwwwww<br/> wwwwwww<br/> wwwwwww<br/> wwwwwww<br/> wwwwwww<br/> wwwwwww<br/> 
             wwwwwww<br/> wwwwwww<br/> wwwwwww<br/> wwwwwww<br/> wwwwwww<br/> wwwwwww<br/> 
             wwwwwww<br/> wwwwwww<br/> wwwwwww<br/> wwwwwww<br/> wwwwwww<br/> wwwwwww<br/> 
             wwwwwww<br/> wwwwwww<br/> wwwwwww<br/> wwwwwww<br/> wwwwwww<br/> wwwwwww<br/> 
             wwwwwww<br/> wwwwwww<br/> wwwwwww<br/> wwwwwww<br/> wwwwwww<br/> wwwwwww<br/> 
             wwwwwww<br/> wwwwwww<br/> wwwwwww<br/> wwwwwww<br/> wwwwwww<br/> wwwwwww<br/> 
             wwwwwww<br/> wwwwwww<br/> wwwwwww<br/> wwwwwww<br/> wwwwwww<br/> wwwwwww<br/> 
             wwwwwww<br/> wwwwwww<br/> wwwwwww<br/> wwwwwww<br/> wwwwwww<br/> wwwwwww<br/> 
             wwwwwww<br/> wwwwwww<br/> wwwwwww<br/> wwwwwww<br/> wwwwwww<br/> wwwwwww<br/>       
             wwwwwww<br/> 
         </div>  
       
      </div> 
    
    
     
    </PageLayout>
  )
}

export const getStaticProps  = ({ locale }) => {
 
  
    return {
      props: {
        messages: {
            ...require(`../../../messages/shared/${locale}.json`),
            ...require(`../../../messages/federation/${locale}.json`),
        },locale
      }
    }
  }



  