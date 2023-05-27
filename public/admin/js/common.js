   window.login_domain = window.location.host;

  function queryStringFromObject(obj) {
    return Object.keys(obj).map(key => key + '=' + obj[key]).join('&');
  }
 

  function postData(url = ``, data = {}) {   
    return fetch(url, {
        method: "POST", 
        mode: "cors", 
        cache: "no-cache", 
        credentials: "same-origin",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        redirect: "follow", 
        referrer: "no-referrer", 
        body: queryStringFromObject(data),
    })
    .then(response => response.json()); 
  }

  $(function(){
    $('#register_domain').html('@'+login_domain)
  })
  // window.onload=function(){
  //   $('#register_domain').html('@'+login_domain)
  // }

