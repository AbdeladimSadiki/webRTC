
function getUrlVars() {
var vars = {};
var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
vars[key] = value;
});
return vars;
}




myAPIkey = 'c5zlfboe3p5bfbt9';

var myID = getUrlVars()["u"];;
var IlyassId = getUrlVars()["p"];;

console.log(myID);
console.log(IlyassId);

var myPeer = new Peer(myID,{key: myAPIkey, debug: 3});
//var ilyassPeer = new  Peer(IlyassId,{key: myAPIkey, debug: 3});

var receivemsg = "";
var sendmsg = "";


myPeer.on('open', function(id) {
  console.log('My peer ID is: ' + id);
});


/*ilyassPeer.on('open', function(id) {
	console.log('Ilyass Id is: '+ id)
});
*/


function send(text){
  var conn = myPeer.connect(IlyassId);
  conn.on('open', function() {
  // Send messages
  //sendmsg = text;
  conn.send(text);
  console.log('Abdeladim sent to ilyass: ',text);
});

}


// handling chat msgs
(function () {
    var Message;
    Message = function (arg) {
        this.text = arg.text, this.message_side = arg.message_side;
        this.draw = function (_this) {
            return function () {
                var $message;
                $message = $($('.message_template').clone().html());
                $message.addClass(_this.message_side).find('.text').html(_this.text);
                $('.messages').append($message);
                return setTimeout(function () {
                    return $message.addClass('appeared');
                }, 0);
            };
        }(this);
        return this;
    };
    $(function () {
        var getMessageText, message_side, sendMessage;
        message_side = 'right';
        getMessageText = function () {
            var $message_input;
            $message_input = $('.message_input');
            return $message_input.val();
        };
        sendMessage = function (text, message_side) {
            var $messages, message;
            if (text.trim() === '') {
                return;
            }
            $('.message_input').val('');
            $messages = $('.messages');
            //message_side = message_side === 'left' ? 'right' : 'left';
            message = new Message({
                text: text,
                message_side: message_side
            });
            message.draw();
            return $messages.animate({ scrollTop: $messages.prop('scrollHeight') }, 300);
        };
        $('.send_message').click(function (e) {
            send(getMessageText());
            return sendMessage(getMessageText(),'right');
        });
        $('.message_input').keyup(function (e) {
            if (e.which === 13) {
                send(getMessageText());
                return sendMessage(getMessageText(),'right');
            }
        });

        function receive(){
          myPeer.on('connection', function(conn) { 
          conn.on('open', function() {
          // Receive messages
            conn.on('data', function(data) {
            console.log('I receive: ', data);
            sendMessage(data,'left');
          });

          });})
        }

        receive();
        //sendMessage('Hello Philip! :)');
        /*setTimeout(function () {
            return sendMessage('Hi Sandy! How are you?');
        }, 1000);
        return setTimeout(function () {
            return sendMessage('I\'m fine, thank you!');
        }, 2000);*/
    });
}.call(this));


