import { useSelector, useDispatch } from 'react-redux'
import {setMessageText} from '../data/valueData'
import Modal from 'react-bootstrap/Modal';
import { useTranslations } from 'next-intl'

export default function ShowTip() {
    const messageText = useSelector((state) => state.valueData.messageText)
    const tipImag = useSelector((state) => state.valueData.tipImag)
    const t = useTranslations('Common')
    const dispatch = useDispatch();

    return (
        <Modal className="modal-dialog-scrollable daism-title " centered show={messageText!==''} onHide={(e) => {dispatch(setMessageText(''))}}>
            <Modal.Header closeButton>
                <Modal.Title>{t('tipText')}</Modal.Title>
            </Modal.Header>
            <Modal.Body className="daism-tip-body">
                <img alt="" src={`/${tipImag}`} width={32} height={32} />
                <div className="daism-tip-text">{messageText}</div>
            </Modal.Body>
        </Modal>
    )
}

