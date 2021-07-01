let users = {};

const SocketServer = (socket) => {
  socket.on("joinUser", (id) => {
    users[id] = { socketId: socket.id };

    for (const user in users) {
      socket.to(`${users[user].socketId}`).emit("joinUserToClient", users);
    }
  });

  socket.on("checkUsersOnline", () => {
    socket.emit("checkUsersOnlineToMe", users);
  });
  socket.on("disconnect", () => {
    for (const id in users) {
      if (users[id].socketId === socket.id) {
        delete users[id];
      }
    }
    for (const id in users) {
      socket.to(`${users[id].socketId}`).emit("disconnectUserToClient", users);
    }
  });

  socket.on("createNotification", (notification) => {
    let clients = [];
    notification.recipients.forEach((recipient) => {
      if (recipient._id === notification.user._id) {
        return;
      }
      if (users[recipient._id]) {
        clients.push(users[recipient._id]);
      }
    });

    if (clients.length > 0) {
      clients.forEach((client) => {
        socket
          .to(`${client.socketId}`)
          .emit("createNotificationToClient", notification);
      });
    }
  });

  socket.on("createMessageNotification", (notification) => {
    let clients = [];
    notification.recipients.forEach((recipient) => {
      if (recipient._id === notification.user._id) {
        return;
      }
      if (users[recipient._id]) {
        clients.push(users[recipient._id]);
      }
    });

    if (clients.length > 0) {
      clients.forEach((client) => {
        socket
          .to(`${client.socketId}`)
          .emit("createMessageNotificationToClient", notification);
      });
    }
  });

  socket.on("createMessage", (message) => {
    let clients = [];
    message.conversation?.users?.forEach((messageUser) => {
      if (String(messageUser) === String(message.user._id)) {
        return;
      }
      if (users[messageUser]) {
        clients.push(users[messageUser]);
      }
    });

    if (clients.length > 0) {
      clients.forEach((client) => {
        socket.to(`${client.socketId}`).emit("createMessageToClient", message);
      });
    }
  });

  socket.on("createConversation", (conversation) => {
    let clients = [];
    conversation?.users?.forEach((conversationUser, idx) => {
      if (users[conversationUser._id]) {
        clients.push(users[conversationUser._id]);
      }
    });
    if (clients.length > 0) {
      clients.forEach((client) => {
        socket
          .to(`${client.socketId}`)
          .emit("createConversationToClient", conversation);
      });
    }
  });

  socket.on("readMessage", (message) => {
    let clients = [];
    message.conversation?.users?.forEach((messageUser) => {
      if (String(messageUser) !== String(message.user._id)) {
        return;
      }
      if (users[messageUser]) {
        clients.push(users[messageUser]);
      }
    });

    if (clients.length > 0) {
      clients.forEach((client) => {
        socket.to(client.socketId).emit("readConversationToClient", message);
      });
    }
  });
};

module.exports = SocketServer;
