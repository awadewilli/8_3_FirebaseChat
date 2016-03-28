var $ = require('jquery');

$.fn.serializeObject = function() {
  return this.serializeArray().reduce(function(acum, i) {
    acum[i.name] = i.value;
    return acum;
  }, {});
};

$(function(){
  var myFirebaseRef = new Firebase('https://obstackles.firebaseio.com');
  var auth;
  var user;
  $('#signup').on('submit', function(event){
    event.preventDefault();
    var $form = $(this);
    var formData = $form.serializeObject();
      console.log(formData);
      myFirebaseRef.createUser(formData, function(error, userData) {
        var one = 1;
        if (error) {
          console.log("Error creating user:", error);
        } else {
        console.log("Successfully created user account with uid:", userData.uid);
      }
    });
  });
  $('#login').on('submit',function(event){
    event.preventDefault();
    var $form = $(this);
    var formData = $form.serializeObject();

    myFirebaseRef.authWithPassword(formData,function(error,authData){
        if (error) {
        console.log("Login Failed!", error);
        alert('Login Failed User does not exist');
      } else {
        console.log("Authenticated successfully with payload:", authData);
        auth = authData.token;
        user = formData.email;
        $('.chat-container').toggleClass('hidden');
        $('.login-feilds').toggleClass('hidden');
        console.log(user);
      }
    });
  $('#logout').on('submit',function(event){
    event.preventDefault();
    myFirebaseRef.unauth();
    $('.chat-container').addClass('hidden');
    $('.login-feilds').removeClass('hidden');
    console.log("successfully loged out");
  });
  });

  var myChatRef = new Firebase('https://obstackles.firebaseio.com/chat');
  $('#messageInput').keypress(function (e) {
        if (e.keyCode == 13) {
          var name = user;
          var text = $('#messageInput').val();
          myChatRef.push({name: name, text: text});
          $('#messageInput').val('');
        }
      });
      myChatRef.on('child_added', function(chats) {
        var message = chats.val();
        displayChatMessage(message.name, message.text);
      });

      function displayChatMessage(name, text) {
        $('<div/>').text(text).prepend($('<em/>').text(name+': ')).appendTo($('#chatdisplay'));
        // $('#messagesDiv')[0].scrollTop = $('#messagesDiv')[0].scrollHeight;
      }
});
