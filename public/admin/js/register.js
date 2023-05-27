
function register() {
   window.login_name = $('#account').val();
    if(!window.login_name){
        alert('昵称不能为空！')
        return
    }
  
 

    postData('/api/admin/create', {
        actorName:'qwe',
        actorHomeUrl:'https://gym123.loophole.site/u/qwe',
        actorDesc:'descRef.current.getData()',
        selectImg:'',
        daoid:1,
        did:'0x27e7817C09C7B107b3C19e6CF4c68141528Dfb80'
    })
      .then(data => {
         console.log('data', data);
        if (data.msg && data.msg === 'ok') {
            $('#register_domain_show').html(window.login_name+'@'+window.login_domain)
            $('#tdiv1').hide()
            $('#tdiv2').show()
            $('#tdiv3').show()
        }
      }) 
      .catch(error => console.error(error));
  }
  
 