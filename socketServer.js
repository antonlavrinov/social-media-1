let users = {};

const SocketServer = (socket) => {
  socket.on("joinUser", (id) => {
    console.log("joinUser", id);
    // users.push({ id, socketId: socket.id });
    users[id] = { socketId: socket.id };
    console.log("ONLINE USERS", users);
    for (const user in users) {
      if (user === id) {
        console.log("MEEEEEE", users[user].socketId);
        // continue;
      } else {
        console.log("NOOOT MEEE", users[user].socketId);
      }

      socket.to(`${users[user].socketId}`).emit("joinUserToClient", users);
    }
  });

  socket.on("checkUsersOnline", () => {
    console.log("checkUsersOnline", users);
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
    // users = users.filter((user) => user.socketId !== socket.id);
    console.log("disconnected", users);
    // users.push({ id, socketId: socket.id });
  });

  // socket.on("checkOnlineUsers", ())

  socket.on("createNotification", (notification) => {
    console.log("likePost", notification);

    //test
    // const aa = [{ name: "ant" }, { name: "ton" }];
    // const value = aa.some((a) => a.name === "ant");
    // console.log("VALYE", value);

    let clients = [];
    notification.recipients.forEach((recipient) => {
      // console.log("iterated", users);
      console.log("iterated", recipient._id);
      if (recipient._id === notification.user._id) {
        return;
      }
      if (users[recipient._id]) {
        clients.push(users[recipient._id]);
      }
      // clients = users.filter((user) => user.id === recipient._id);
      // if (users.some((user) => user.id === recipient._id)) {
      //   console.log("SOME TRUE");
      //   clients.push(user);
      // }
    });
    console.log("CLIENTS", clients);
    if (clients.length > 0) {
      clients.forEach((client) => {
        console.log("EMIIIIIIIT notification", client);
        socket
          .to(`${client.socketId}`)
          .emit("createNotificationToClient", notification);
      });
    }
    // console.log("clients", clients);
    // const id = post.user._id;
    // const client = users.find((el) => el.id === id);
    // socket.to(`${client.socketId}`).emit("likePostToClient", post);
  });

  socket.on("createMessageNotification", (notification) => {
    console.log("messageNotification", notification);

    //test
    // const aa = [{ name: "ant" }, { name: "ton" }];
    // const value = aa.some((a) => a.name === "ant");
    // console.log("VALYE", value);

    let clients = [];
    notification.recipients.forEach((recipient) => {
      // console.log("iterated", users);
      console.log("iterated", recipient._id);
      if (recipient._id === notification.user._id) {
        return;
      }
      if (users[recipient._id]) {
        clients.push(users[recipient._id]);
      }
      // clients = users.filter((user) => user.id === recipient._id);
      // if (users.some((user) => user.id === recipient._id)) {
      //   console.log("SOME TRUE");
      //   clients.push(user);
      // }
    });
    console.log("CLIENTS", clients);
    if (clients.length > 0) {
      clients.forEach((client) => {
        console.log("EMIIIIIIIT notification", client);
        socket
          .to(`${client.socketId}`)
          .emit("createMessageNotificationToClient", notification);
      });
    }
    // console.log("clients", clients);
    // const id = post.user._id;
    // const client = users.find((el) => el.id === id);
    // socket.to(`${client.socketId}`).emit("likePostToClient", post);
  });

  socket.on("createMessage", (message) => {
    console.log("createMessage", message);
    console.log("usersssss", users);
    let clients = [];
    message.conversation?.users?.forEach((messageUser) => {
      if (String(messageUser) === String(message.user._id)) {
        return;
      }
      if (users[messageUser]) {
        clients.push(users[messageUser]);
      }
    });
    console.log("CLIENTS", clients);
    if (clients.length > 0) {
      clients.forEach((client) => {
        console.log("EMIIIIIIIT message", client);
        // socket.to(`${client.socketId}`).emit("createMessageToClient", message);
        socket.to(`${client.socketId}`).emit("createMessageToClient", message);
      });
    }
    // console.log("clients", clients);
    // const id = post.user._id;
    // const client = users.find((el) => el.id === id);
    // socket.to(`${client.socketId}`).emit("likePostToClient", post);
  });

  socket.on("createConversation", (conversation) => {
    console.log("createConversation", conversation);

    let clients = [];
    conversation?.users?.forEach((conversationUser, idx) => {
      console.log("conversationUser", conversationUser);
      console.log("users", users);
      console.log("found user", users[conversationUser._id]);
      // if (idx === 0) {
      //   continue;
      // }
      console.log("idx", idx);
      console.log("boolean", !!users[conversationUser._id]);
      if (users[conversationUser._id]) {
        console.log("pushed", clients);
        clients.push(users[conversationUser._id]);
      }
    });
    console.log("CLIENTS", clients);
    if (clients.length > 0) {
      clients.forEach((client) => {
        console.log("EMIIIIIIIT createConversation", client);
        // socket.to(`${client.socketId}`).emit("createMessageToClient", message);
        socket
          .to(`${client.socketId}`)
          .emit("createConversationToClient", conversation);
      });
    }
    // console.log("clients", clients);
    // const id = post.user._id;
    // const client = users.find((el) => el.id === id);
    // socket.to(`${client.socketId}`).emit("likePostToClient", post);
  });

  socket.on("readMessage", (message) => {
    // console.log("readMessage", message);
    let clients = [];
    message.conversation?.users?.forEach((messageUser) => {
      if (String(messageUser) !== String(message.user._id)) {
        return;
      }
      if (users[messageUser]) {
        clients.push(users[messageUser]);
      }
    });
    console.log("CLIENTS", clients);
    if (clients.length > 0) {
      clients.forEach((client) => {
        console.log("EMIIIIIIIT read", client);
        // let d;
        // for (let us in users) {
        //   if ((users[us].socketId = client.socketId)) {
        //     d = us;
        //   }
        // }
        // console.log("d", d);
        // socket.to(client.socketId).emit("readMessageToClient", message);
        socket.to(client.socketId).emit("readConversationToClient", message);
      });
    }
    // socket.emit("readMessageToClient", message);
    // socket.emit("readConversationToClient", message);
    // console.log("clients", clients);
    // const id = post.user._id;
    // const client = users.find((el) => el.id === id);
    // socket.to(`${client.socketId}`).emit("likePostToClient", post);
  });
};

module.exports = SocketServer;
