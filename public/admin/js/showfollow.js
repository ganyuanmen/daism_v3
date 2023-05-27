function show_followers()
{
  postData('/api/admin/getUser', {name:`${window.login_name}@${window.login_domain}`,type:'follower'})
  .then(data => {
     console.log('data', data);
    if (data.msg && data.msg === 'ok') {
      let ui=$('#following_ui');
     JSON.parse(data.followers).map(item=>{
          let li= $('<li class="list-group-item"></li>').html(item).appendTo(ui)
          $('<button>取消关注</button>').on('click',function(){
              $(this).parent().remove()
          }).appendTo(li)
      })
     
      $('#following_modal').modal('show')
    }
  }) 
  .catch(error => console.error(error));
}

function show_following()
{
    postData('/api/admin/getUser', {name:`${window.login_name}@${window.login_domain}`,type:'followee'})
    .then(data => {
       console.log('data', data);
      if (data.msg && data.msg === 'ok') {
        let ui=$('#following_ui');
       JSON.parse(data.followers).map(item=>{
            let li= $('<li class="list-group-item"></li>').html(item).appendTo(ui)
            $('<button>取消关注</button>').on('click',function(){
                $(this).parent().remove()
            }).appendTo(li)
        })
       
        $('#following_modal').modal('show')
      }
    }) 
    .catch(error => console.error(error));

  
}


// <li class="list-group-item">An item</li>
// <li class="list-group-item">A second item</li>
// <li class="list-group-item">A third item</li>
// <li class="list-group-item">A fourth item</li>
// <li class="list-group-item">And a fifth one</li>