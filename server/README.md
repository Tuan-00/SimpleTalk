# Python server

Simple implementation of Twisted and Autobahn to connect pairs of websocket-speaking applications.


# Installation

**Requirements**:  In order to start the server you will need Python2.7 and pip, preferably, either on Unix or Windows based systems.

Also, change the URL variable in the simpletalk.py file to the URL where you want to run the SimpleTalk server. 
To run it locally, set URL="localhost".

```
$ pip install -r ./../requeriments.txt

$ python setup.py build

$ python setup.py install
```
Then you can start SimpleTalk's server with
```
$ python ./simpletalk.py
```

# Try it now!

You can start off right now. Click [here](http://ec2-52-14-35-162.us-east-2.compute.amazonaws.com/index.html) and connect to a chatroom (server) running on AWS instances.



