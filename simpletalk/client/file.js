


//   window.addEventListener("load", function() {
        // create websocket instance
//        var mySocket = new WebSocket("ws://localhost:8080/ws");
var mySocket = new WebSocket("ws://ec2-18-222-181-248.us-east-2.compute.amazonaws.com:8080/ws");

        // add event listener reacting when message is received
        mySocket.onmessage = function (event) {
  //          var output = document.getElementById("output");
            // put text into our output div
    //        output.textContent = event.data;
	    var newDiv = document.createElement("div");
		var newP = document.createElement("p");
		var newSpan = document.createElement("span");
		var d = new Date();

		newSpan.className = 'time-right';
		newSpan.textContent = "".concat(d.getHours(), ':', d.getMinutes());

		newP.textContent = event.data;
		newDiv.className = 'recv-container';
		var DivX = document.body.appendChild(newDiv)

		DivX.appendChild(newP);
		DivX.appendChild(newSpan);


        };
//        var form = document.getElementsByClassName("foo");

//-------------------------------

//		document.getElementsByClassName("container").textContent = "<p>here I code</p>";;


	function send_function() {

	    var newDiv = document.createElement("div");
		var newP = document.createElement("p");
		var d = new Date();
		var newSpan = document.createElement("span");
        var input = document.getElementById("input");

		newSpan.className = 'time-left';
		newSpan.textContent = "".concat(d.getHours(), ':', d.getMinutes());
		
        input_text = input.value;
        mySocket.send(input_text);
		newP.textContent = input.value;

		newDiv.className = 'send-container';
		var DivX = document.body.appendChild(newDiv);
		DivX.appendChild(newP);
		DivX.appendChild(newSpan);

	}
	
	document.getElementById("f1").addEventListener("submit", function(event){
    event.preventDefault()});




//------------------------------
//        form[0].addEventListener("submit", function (event) {
            // on forms submission send input to our server
  //          event.preventDefault();
//		  send_function();
    //    });

//  });
