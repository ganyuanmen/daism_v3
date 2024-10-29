import { useState,forwardRef,useEffect,useImperativeHandle } from 'react';
import {Button,Card,Row,Col,Form} from "react-bootstrap";
import DaismImg from '../../form/DaismImg';
import DaismInputGroup from '../../form/DaismInputGroup';
// import Editor from '../form/Editor';
import { useRef } from 'react';
import { SendSvg } from '../../../lib/jssvg/SvgCollection';
import DateTimeItem from '../../form/DateTimeItem';
import { useSelector,useDispatch} from 'react-redux';
import {setTipText,setMessageText} from '../../../data/valueData';
import dynamic from 'next/dynamic';

const RichTextEditor = dynamic(() => import('../../RichTextEditor'), { ssr: false });

//currentObj 有值表示修改
export default function EnkiCreateMessage({t,tc,user,daoObj,actor,addCallBack,currentObj,afterEditCall={afterEditCall}}) {

    const [showEvent,setShowEvent]=useState(false) //是否活动发文
    const dispatch = useDispatch();
    function showTip(str){dispatch(setTipText(str))}
    function closeTip(){dispatch(setTipText(''))}
    function showClipError(str){dispatch(setMessageText(str))}  

    const titleRef=useRef(); //标题
    const editorRef=useRef(); 
    const imgstrRef=useRef();
    const discussionRef=useRef();
    const sendRef=useRef();
    const startDateRef=useRef()
    const endDateRef=useRef()
    const urlRef=useRef()
    const addressRef=useRef()
    const timeRef=useRef()
    // const videoRef=useRef()

    useEffect(()=>{
      if(currentObj && currentObj.start_time) setShowEvent(true)
    },[currentObj])

    const submit=async ()=>{ 
      const titleText=titleRef.current.getData()
      if (!titleText || titleText.length > 256) {
        titleRef.current.notValid(t('titleValidText'))
        return
      }
      const contentText=editorRef.current.value
      if (!contentText || contentText.length < 10) {
        showClipError(t('contenValidText'))
        return
      }
      
      //处理 内容，有链接的替换成卡片
      // const videoUrl=videoRef.current.getData()
      // if(videoUrl && !/^((https|http)?:\/\/)[^\s]+/.test(videoUrl)){
      //     videoRef.current.notValid(t('uriValidText'))
      //     return
      // }
      let eventUrl=''
      if(showEvent) {  //活动发文检测
        eventUrl=urlRef.current.getData()
        if(eventUrl && !/^((https|http)?:\/\/)[^\s]+/.test(eventUrl)){
            urlRef.current.notValid(t('uriValidText'))
            return
        }
      }
    
      showTip(t('submittingText'))  

      const formData = new FormData();
      formData.append('id', currentObj?currentObj.id:0);  
      formData.append('title', titleText);  //标题
      formData.append('_type', showEvent?1:0);  //活动还是普通 
      formData.append('content', contentText); //，内容
      formData.append('image', imgstrRef.current.getFile()); //图片
      formData.append('fileType',imgstrRef.current.getFileType()); //后缀名
      formData.append('did',user.account); //钱包地址
      formData.append('account',daoObj.manager?daoObj.actor_account:actor?.actor_account); //社交帐号
      formData.append('videoUrl',""); //视频 暂时不用 
      formData.append('isSend',sendRef.current.checked?1:0);
      formData.append('isDiscussion',discussionRef.current.checked?1:0);
      if(showEvent) { //活动参数
        formData.append('startTime',startDateRef.current.getData());
        formData.append('endTime',endDateRef.current.getData());
        formData.append('eventUrl',eventUrl);
        formData.append('eventAddress',addressRef.current.getData());
        formData.append('time_event',timeRef.current.getData());
      }
  
      fetch(`/api/admin/addMessage`, {
        method: 'POST',
        headers:{encType:'multipart/form-data'},
        body: formData
      })
    .then(async response => {
      closeTip()
      let re=await response.json()
      if(re.errMsg) { showClipError(re.errMsg); return }
      if(currentObj) {  //修改回调
          let _obj={...currentObj,...re} 
         afterEditCall.call(this,_obj) 
      }
      else addCallBack.call()  //新增回调
    })
    .catch(error => {
      closeTip()
      showClipError(`${tc('dataHandleErrorText')}!${error}`)
     
    });   
    }
  

    return (
        <Card>
        <Card.Body>
            <DaismImg title={t('selectTopImg')} defaultValue={currentObj?currentObj.top_img:''} ref={imgstrRef}  maxSize={1024*500} fileTypes='svg,jpg,jpeg,png,gif,webp' />
            <DaismInputGroup title={t('titileText')} defaultValue={currentObj?currentObj.title:''}  ref={titleRef} horizontal={true}  />
            {/* <Editor title={t('contenText')} defaultValue='' ref={editorRef} t={t} /> */}
            <RichTextEditor defaultValue={currentObj?currentObj.content:''}  title={t('contenText')}  editorRef={editorRef} />
            {/* <DaismInputGroup title={t('videoText')}   ref={videoRef} horizontal={true}  /> */}
            <Form.Check className='mb-3' type="switch" id="custom-switch" checked={showEvent} onChange={e=>{setShowEvent(!showEvent)}} label={t('eventArtice')} />
            

            {showEvent &&
             <Card className='mb-3'>
                <Card.Body>
                <Row>
                    <Col md><DateTimeItem defaultValue={currentObj?currentObj.start_time:''}  title={t('startDateText')} ref={startDateRef} /></Col>
                    <Col md><DateTimeItem defaultValue={currentObj?currentObj.end_time:''} title={t('endDateText')} ref={endDateRef} /></Col>
                </Row>
                <Row>
                    <Col lg ><DaismInputGroup defaultValue={currentObj?currentObj.event_url:''} title={t('urlText')} ref={urlRef} horizontal={true} /></Col>
                    <Col lg><DaismInputGroup defaultValue={currentObj?currentObj.event_address:''} title={t('addressText')} ref={addressRef} horizontal={true} /></Col>
                </Row>
                <Timedevent ref={timeRef} t={t} currentObj={currentObj} />
                </Card.Body>
            </Card>      
            }
           
            <div className="form-check form-switch mb-3">
                <input ref={discussionRef} className="form-check-input" type="checkbox" id="isSendbox" defaultChecked={currentObj?(currentObj.is_discussion===1?true:false):true} />
                <label className="form-check-label" htmlFor="isSendbox">{t('emitDiscussion')}</label>
            </div>
            <div className="form-check form-switch mb-3">
                <input ref={sendRef} className="form-check-input" type="checkbox" id="isDiscussionbox" defaultChecked={currentObj?(currentObj.is_send===1?true:false):true} />
                <label className="form-check-label" htmlFor="isDiscussionbox">{t('sendToFollow')}</label>
            </div>
         
        </Card.Body>
        <Card.Footer className='d-flex justify-content-center'  >
            <div>
                <Button  onClick={()=>{addCallBack()}}  variant="light">  {t('esctext')} </Button> {' '}
                <Button  onClick={submit}  variant="primary"> <SendSvg size={16} /> {t('submitText')}</Button> 
            </div>
        </Card.Footer>
        </Card>
    );
}



//定时活动
const Timedevent = forwardRef((props, ref) => {
    const [onLine,setOnLine]=useState(false) //开启定时事
    const [vstyle,setVtyle]=useState({}) //开启定时事

    useEffect(()=>{
      if(props.currentObj && props.currentObj.time_event>-1) {
        setOnLine(true)
        document.getElementById(`inlineRadio${props.currentObj.time_event}`).checked=true
      }else 
      {
        document.getElementById(`inlineRadio7`).checked=true
      }
     },[props.currentObj])
  
    // useEffect(()=>{
    //   document.getElementById(`inlineRadio7`).checked=true
    // },[])
    
    useEffect(()=>{
      setVtyle(onLine?{}:{display:'none'})
    },[onLine,setVtyle])
    let t = props.t
  
    const getData = () => {
      if(!onLine) return -1
      
      for(var i=1;i<=7;i++)
      {
        if(document.getElementById(`inlineRadio${i}`).checked) break
      }
      return i>7?7:i;
    }
  
    useImperativeHandle(ref, () => ({
      getData: getData
    }));
  
    const handleChange=()=>{
        setOnLine(!onLine)
  
    }
   
  
    return (
        <>
            <div className="form-check form-switch ">
                <input className="form-check-input" type="checkbox" id="onLineBox" checked={onLine} onChange={handleChange}/>
                <label className="form-check-label" htmlFor="onLineBox">{t('timeText')}</label>
            </div>     
            <div  style={vstyle} >
            {[1,2,3,4,5,6,7].map((idx)=>(
                     <div key={idx} className="form-check form-check-inline">
                        <input className="form-check-input" type="radio" name='inlineRadioOptions' id={`inlineRadio${idx}`} value={idx} />
                        <label className="form-check-label" htmlFor={`inlineRadio${idx}`}> {t('weekText').split(',')[idx-1]}</label>
                   </div>
                  ))
            }
  
            </div> 
            <br/>
      </>
    );
  });
  