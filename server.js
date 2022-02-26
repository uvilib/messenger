const express = require("express");
const http = require("http");
const connect = require("./config/connect");
const mongoose = require("mongoose");
const path = require("path");
const User = require("./models/User");

const app = express();

const { portConst, socketClientHost, mongoUri } = connect;
const server = http.createServer(app);

const io = require("socket.io")(server, {
  cors: {
    origin: socketClientHost,
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  const id = socket.handshake.query.id;
  socket.join(id);

  socket.on("online", async () => {
    await User.findByIdAndUpdate(id, { status: "online" });
  });

  socket.on("send-message", ({ recipient }) => {
    socket.broadcast.to(recipient).emit("receive-message");
  });

  socket.on("disconnect", async () => {
    await User.findByIdAndUpdate(id, { status: "offline" });
  });
});

app.use(express.json({ extended: true }));

app.use("/api/auth", require("./routes/auth.routes"));
app.use("/api/members", require("./routes/members.routes"));
app.use("/api/message", require("./routes/message.routes"));

if (process.env.NODE_ENV === "production") {
  app.use("/", express.static(path.join(__dirname, "frontend", "build")));

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "frontend", "build", "index.html"));
  });
}

const port = process.env.PORT || portConst;

async function start() {
  try {
    await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    server.listen(port, () => console.log(`Server is running on port ${port}`));
  } catch (e) {
    console.log(e.message);
    process.exit(1);
  }
}

start();
