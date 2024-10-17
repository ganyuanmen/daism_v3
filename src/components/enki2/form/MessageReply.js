
import React, {useImperativeHandle,useState,useRef, forwardRef} from "react";
import { Modal,Button} from 'react-bootstrap';
import { ReplySvg,EditSvg } from '../../../lib/jssvg/SvgCollection';
import Editor from './Editor';

  //回复按钮 isd 是否允许回复
  const MessageReply = forwardRef(({isd,pid,t,tc,total,addReplyCallBack,afterEditcall,replyObj,actor,showTip,closeTip,showClipError}, ref) => {
    const [showWin,setShowWin]=useState(false) //回复窗口显示
    const editorRef=useRef()
    useImperativeHandle(ref, () => ({show: ()=>{setShowWin(true)},}));
    
    const submit=async ()=>{

      let textValue=editorRef.current.getData()
      if(!textValue || textValue.length<4 )
      {
          editorRef.current.notValid(t('noEmptyle4'))
          return
      }
      setShowWin(false)
      showTip(t('submittingText'))
      
      const formData = new FormData();
      formData.append('rid', replyObj?replyObj.id:0);  //修改id 
      formData.append('pid', pid); 
      formData.append('content', textValue); //，内容
      formData.append('id', actor.id); 
      fetch(`/api/admin/addCommont`, {
        method: 'POST',
        headers:{encType:'multipart/form-data'},
        body: formData
      })
    .then(async response => {
      closeTip()
      let re=await response.json()
      if(re.errMsg) { showClipError(re.errMsg); return }
      if(replyObj) afterEditcall({id:replyObj.id,content:textValue})
      else  addReplyCallBack.call()
    })
    .catch(error => {
      closeTip()
      showClipError(`${tc('dataHandleErrorText')}!${error}`)
    
    });   
}

   
    return (
        <>
            {(actor?.actor_account && isd==1)?<div>
                <Button onClick={()=>{setShowWin(true)}}  variant="light"><EditSvg size={24} /> {t('replyText')} {total} </Button>
                <Modal size='lg'  className='daism-title' show={showWin} onHide={(e) => {setShowWin(false)}} >
                    <Modal.Header closeButton></Modal.Header>
                    <Modal.Body>
                      <Editor title={t('replyContent')} defaultValue={replyObj?replyObj.content:''} t={t} ref={editorRef} />
                        {/* <RichTextEditor  defaultValue=''  title={t('contenText')}  editorRef={editorRef} /> */}
                        <div className='mt-2 mb-2' style={{textAlign:'center'}} >
                          <Button  onClick={submit}  variant="primary"> <ReplySvg size={16} /> {t('replyText')}</Button> 
                        </div>
                    </Modal.Body>
                </Modal>
                </div>:<div>{t('replyText')} {total}</div>
            }
        </>
    )
});
export default React.memo(MessageReply);
