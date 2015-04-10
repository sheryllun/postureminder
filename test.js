document.addEventListener('DOMContentLoaded',function(){
    document.getElementById('message').addEventListener('click',function(){
      
      if(! ('Notification' in window) ){
        alert('Web Notification is not supported');
        return;
      } 
      
      Notification.requestPermission(function(permission){
        var notification = new Notification("Hi there!",{body:'I am here to talk about HTML5 Web Notification API',icon:'icon.png',dir:'auto'});
        setTimeout(function(){
          notification.close();
        },2000);
      });
    });
  });