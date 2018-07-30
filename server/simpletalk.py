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
        partner = None

        for client_key in self.clients:
            if client.peer == client_key:
                partner = self.clients[client.peer]["partner"] 

        self.clients.pop(client.peer)
        
        if partner:
            self.clients.pop(partner.peer)
            self.register(partner)
            self.findPartner(partner)
		
 
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
        password="1234"
        message = payload.split("@#$%")
        if (message[0]==password):
            c["validated"] = "yes"
            if not c["partner"]:
                self.findPartner(client)
            payload=message[1]
        """
        Send message if client is registered and if it has a partned.
        """

        if not c["validated"]:
			return
        elif not c["partner"]:
            c["object"].sendMessage("Sorry you dont have a partner yet, check back in a minute")
            self.findPartner(c["object"])
        elif message[1]:
            c["partner"].sendMessage(message[1])

if __name__ == "__main__":
    log.startLogging(sys.stdout) 

	# Server set up and running on AWS instance
    URL = "ec2-18-216-50-181.us-east-2.compute.amazonaws.com" # or localhost = 
    root = File(".")
 
    factory = ChatFactory(u"ws://"+URL+":8080")
    factory.protocol = MyServerProtocol
    resource = WebSocketResource(factory)

    root.putChild(u"ws", resource)
    site = Site(root)
    reactor.listenTCP(8080, site)
    reactor.run()

