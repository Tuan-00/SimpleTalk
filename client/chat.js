

var last_message = "";
var Username = "";
var Pwd = "";
var registered = false;
// Secrecy for registering not implemented. Password goes open.
var password="1234";

// Server set up and running on AWS instance
var URL = "ec2-52-14-35-162.us-east-2.compute.amazonaws.com"; // or "localhost"
var PORT = "8080";

	// create websocket instance
var mySocket = new WebSocket("ws://".concat(URL, ":", PORT, "/ws"));

	function register(){		
	//Read form input data (UserId and Password) via url query
		Username = getParameterByName("UserId", window.location.href);
		Pwd = getParameterByName("Pwd", window.location.href);

		if (Pwd == password){
	// Password is sent as regular message.
			mySocket.send(Pwd);
			registered = true;
	// Returns text to be placed on "status button"
			return "Send Message"; 
		} else {
			return "Your registration didnt pass. Please go back to the sign in page.";
		}
	};

	// Manages receiving of data from partner
	mySocket.onmessage = function (event) {

	    var newDiv = document.createElement("div");
		var newP = document.createElement("p");
		var newSpan = document.createElement("span");
		var d = new Date();
		var newImg = document.createElement("img");
	
		newImg.src = "./images/avatar-you.jpg";
		newImg.className = "right";

		newSpan.className = 'time-left';
		newSpan.textContent = "".concat(d.getHours(), ':', d.getMinutes());
		newP.textContent = event.data;
		
	// If an error occur, remove div holding next message to be sent to partner
		if (newP.textContent == "Sorry you dont have a partner yet, check back in a minute" || newP.textContent == ""){
			var divs = document.getElementsByTagName("div");
			divs[divs.length-1].remove();
			if (last_message == newP.textContent || newP.textContent == ""){
				return;
			} else {
		// prepare div indicating error
				newDiv.className = 'empty-room';
				newImg.src = "./images/error.png";
				newImg.className = "right";

				document.body.appendChild(newDiv);
				newDiv.appendChild(newP);
				newDiv.appendChild(newSpan);
				newDiv.appendChild(newImg);
				last_message = newP.textContent;
				return;
			}
		} else { 
		// If previous message was an error but not present, clear screen. 
		// [do not remove first 2 to body's children, thei're button and input ]
			if (last_message == "Sorry you dont have a partner yet, check back in a minute"){
				while (document.body.children[2]) {
					document.body.removeChild(document.body.children[2]);
				}
				last_message = "";	
			}
		}
		// Prepare and append placeholder for receiving message
		newDiv.className = 'recv-container';
		document.body.appendChild(newDiv);
		newDiv.appendChild(newP);
		newDiv.appendChild(newSpan);
		newDiv.appendChild(newImg);
        };

	function send_function() {

	// Befor sendind, check if client has already registered
		if (!registered){
			status = register();
			if (status != "Send Message"){
				document.getElementById("but").textContent = status;
				return;
			}
		}
		document.getElementById("but").textContent = status;
		document.getElementById("f1").addEventListener("submit", function(event){

	// Prepare sending of message in case an 'enter' hit submited the form, instead of a button press.

	    var newDiv = document.createElement("div");
		var newP = document.createElement("p");
		var d = new Date();
		var newSpan = document.createElement("span");
        var input = document.getElementById("input");
		var newImg = document.createElement("img");
	
		newImg.src = "./images/avatar-me.jpg";
		newImg.className = "left";	
		newSpan.className = 'time-right';
	
	//to show the time a message was sent
		newSpan.textContent = "".concat(d.getHours(), ':', d.getMinutes(), ' - ', Username);
		
	/* For some reason the form in some cases was submitting twice. 
	To prevent this a check empty string was put in place */
		if(input.value != ""){
			mySocket.send(input.value);
			newP.textContent = input.value;
			input.value = "";
	
			newDiv.className = 'send-container';
			document.body.appendChild(newDiv);
			newDiv.appendChild(newP);
			newDiv.appendChild(newSpan);
			newDiv.appendChild(newImg);
		}
	// Prevent page reload subsequent of form submition
	    event.preventDefault();
		return;	
	});

    var input = document.getElementById("input");

	// Trick to get user to press the button first before hitting enter to submit first message.
	// Only shows input box after first click
	if (input.type == "hidden"){
		input.type = "text";
		return;
	}

	/* Prepare sending of message in case the send button was pressed
	 instead of an enter hit. */
	    var newDiv = document.createElement("div")
		var newP = document.createElement("p");
		var d = new Date();
		var newSpan = document.createElement("span");

		newSpan.className = 'time-left';
		newSpan.textContent = "".concat(d.getHours(), ':', d.getMinutes(), ' - ', Username);
		
		if(input.value != ""){
	        mySocket.send(input.value);
			newP.textContent = input.value;
			input.value = "";

			newDiv.className = 'send-container';
			var DivX = document.body.appendChild(newDiv);
			DivX.appendChild(newP);
			DivX.appendChild(newSpan);
		}
    };

	//Parse url query in order to get the submitted form information
	function getParameterByName(name, url) {
		if (!url) url = window.location.href;
		name = name.replace(/[\[\]]/g, '\\$&');
		var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
		    results = regex.exec(url);
		if (!results) return null;
		if (!results[2]) return '';
		return decodeURIComponent(results[2].replace(/\+/g, ' '));
	}


