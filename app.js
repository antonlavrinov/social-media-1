const express = require("express");
const mongoose = require("mongoose");
const path = require("path");

// const morgan = require("morgan");
// const bodyParser = require("body-parser");
var cookieParser = require("cookie-parser");
const cors = require("cors");
const SocketServer = require("./socketServer");
// const { readdirSync } = require("fs");

//чтобы считывал файлы .env
require("dotenv").config();

// app
const app = express();

//socket
const http = require("http").createServer(app);
const io = require("socket.io")(http);

io.on("connection", (socket) => {
  console.log(socket.id + "connected");
  SocketServer(socket);
});

// middlewares
// app.use(morgan("dev"));
app.use(express.json({ limit: "50mb" }));
app.use(
  cors({
    origin: ["http://localhost:3000"],
    credentials: true,
  })
);
app.use(cookieParser());

//router - это тоже Middleware

app.use("/api", require("./routes/auth.routes"));
app.use("/api", require("./routes/user.routes"));
app.use("/api", require("./routes/search.routes"));
app.use("/api", require("./routes/friend-request.routes"));
app.use("/api", require("./routes/post.routes"));
app.use("/api", require("./routes/comment.routes"));
app.use("/api", require("./routes/upload-image.routes"));
app.use("/api", require("./routes/message.routes"));
app.use("/api", require("./routes/conversation.routes"));
app.use("/api", require("./routes/friends.routes"));
app.use("/api", require("./routes/notification.routes"));
// routes middleware
// readdirSync("./routes").map((r) => app.use("/api", require("./routes/" + r)));
// app.use();
// console.log(process.env.PORT);
// port
const port = process.env.PORT || 5000;

// const db =
//   "mongodb+srv://anton:OZoNamhYQYBZ7f6v@cluster0.ifqtj.mongodb.net/app?retryWrites=true&w=majority";
console.log("process", process.env.NODE_ENV);
if (process.env.NODE_ENV === "production") {
  app.use(express.static("client/build"));
  app.get("*", (req, res) => {
    res.send(path.resolve(__dirname, "./client/build", "index.html"));
  });
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "./client/build", "index.html"));
  });
} else {
  // app.get("/", (req, res) => {
  //   res.send("App in development");
  // });
}
// console.log(process.env.DATABASE);
const start = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useCreateIndex: true,
      useFindAndModify: false,
      useUnifiedTopology: true,
    });
    http.listen(port, () => console.log(`Server is running on port ${port}`));
  } catch (e) {
    console.log(e);
  }
};

start();
