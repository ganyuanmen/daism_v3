import React, { useState } from 'react';
import { Form, InputGroup } from 'react-bootstrap';
import {client} from '../../../lib/api/client'
import { useDispatch} from 'react-redux';
import {setTipText} from '../../../data/valueData'

const SearchInput = ({t,searchCall,actor}) => {
  const [query, setQuery] = useState('');

  const dispatch = useDispatch();
  function showTip(str){dispatch(setTipText(str))}
  function closeTip(){dispatch(setTipText(''))}
  // function showClipError(str){dispatch(setMessageText(str))}

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      performSearch();
    }
  };

  const performSearch = () => {
    showTip(t('submittingText'))   
    client.get(`/api/getData?actor_account=${query.trim()}&user_account=${actor?.actor_account}`,'fromAccount').then(res =>{ 
      if(res.status===200) {
        if(res.data.account){ //找到帐号
          searchCall(res.data)
        }else { //没找到
          searchCall({desc:`<h3 style="color:red;"> ${noFindText} </h3>`})
        }
      }
      else console.error(res.statusText)
      closeTip()
  })
  };

  return (
    <InputGroup style={{minWidth:'300px'}}>
      <Form.Control 
        type="text"
        placeholder={t('findandaddressText')}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyPress={handleKeyPress}
      />
    </InputGroup>
  );
};

export default SearchInput;
