import sys
import random
 
from twisted.web.static import File
from twisted.python import log
from twisted.web.server import Site
from twisted.internet import reactor
 
from autobahn.twisted.websocket import WebSocketServerFactory, \
    WebSocketServerProtocol
 
from autobahn.twisted.resource import WebSocketResource


class MyServerProtocol(WebSocketServerProtocol):
    def onOpen(self):
        """
        Connection from client is opened. Fires after opening
        websockets handshake has been completed and we can send
        and receive messages.
        """   
        self.factory.register(self)
        self.factory.findPartner(self)
 
    def connectionLost(self, reason):
        """
        Client lost connection, either disconnected or some error.
        Remove client from list of tracked connections.
        """
        self.factory.unregister(self)
 
    def onMessage(self, payload, isBinary):
        """
        Message sent from client, communicate this message to its conversation partner,
        """
        self.factory.communicate(self, payload, isBinary)
 
class ChatFactory(WebSocketServerFactory):
    def __init__(self, *args, **kwargs):
        super(ChatFactory, self).__init__(*args, **kwargs)
        self.clients = {}
        password="1234"
 
    def register(self, client):
        """
        Add client to list of managed connections. 'validated' indicates if 
        client has provided correct password.
        """
        self.clients[client.peer] = {"object": client, "partner": None, "validated": None}

 
    def unregister(self, client):
        """
        Remove client from list of managed connections.
        """
        self.clients.pop(client.peer)
 
    def findPartner(self, client):
        """
        Find chat partner for a client. Check if there any of tracked clients
        is idle. If there is no idle client just exit quietly. If there is
        available partner assign ig to our client.
        """
        available_partners = [c for c in self.clients if c != client.peer and not self.clients[c]["partner"] and self.clients[c]["validated"] == "yes"] 
        if not available_partners:
            print("no partners for {} check in a moment".format(client.peer))
        else:
            partner_key = random.choice(available_partners)
            self.clients[partner_key]["partner"] = client
            self.clients[client.peer]["partner"] = self.clients[partner_key]["object"]
 
    def communicate(self, client, payload, isBinary):
        """
        Try to send message from client to its partner. 
        """
        c = self.clients[client.peer]
        """   
        Unsecure registering. A preliminary payload is checked against an open password.  
        """
        if (payload==password):
            c["validated"] = "yes";
            payload=""
        """
        Send message if client is registered and if it has a partned.
        """
        if not c["validated"]:
			return
        elif not c["partner"]:
            c["object"].sendMessage("Sorry you dont have a partner yet, check back in a minute")
        else:
            c["partner"].sendMessage(payload)


if __name__ == "__main__":
    log.startLogging(sys.stdout) 

	# Server set up and running on AWS instance
    URL = "ec2-18-222-181-248.us-east-2.compute.amazonaws.com" # or localhost = "127.0.0.1"
    root = File(".")
 
    factory = ChatFactory(u"ws://"+URL+":8080")
    factory.protocol = MyServerProtocol
    resource = WebSocketResource(factory)

    root.putChild(u"ws", resource)
    site = Site(root)
    reactor.listenTCP(8080, site)
    reactor.run()

