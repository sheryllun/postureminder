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

function notifyMe() {
  // Let's check if the browser supports notifications
  if (!("Notification" in window)) {
    alert("This browser does not support desktop notification");
  }

  // Let's check if the user is okay to get some notification
  else if (Notification.permission === "granted") {
    // If it's okay let's create a notification
    var notification = new Notification("Hi there!");
  }

  // Otherwise, we need to ask the user for permission
  else if (Notification.permission !== 'denied') {
    Notification.requestPermission(function (permission) {
      // If the user is okay, let's create a notification
      if (permission === "granted") {
        var notification = new Notification("Hi there!");
      }
    });
  }

  // At last, if the user already denied any notification, and you 
  // want to be respectful there is no need to bother them any more.
}