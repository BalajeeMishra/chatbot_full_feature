const express = require("express");
const app = express();
const cors = require("cors");
const { Server } = require("socket.io");
const { createServer } = require("http");
const httpServer = createServer(app);
const redis = require("redis");
const client = redis.createClient();

const { v4: uuidv4 } = require("uuid");
const sessionId = uuidv4();
const session = require("express-session");
const { Console } = require("console");
const RedisStore = require("connect-redis").default;

const sessionMiddleware = session({
  name: "my-session",
  store: new RedisStore({ client }),
  secret: "Hello My Name Is Balajee Mishra",
  resave: false,
  saveUninitialized: true,
  cookie: {
    secure: false,
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 24 // 1 day
  }
});
app.use(sessionMiddleware);
app.use(cors({ credentials: true, origin: "http://localhost:3000" }));
app.use(express.json());

const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:3000"
  }
});

const userSocketMap = {};
io.on("connection", (socket) => {
  console.log(socket.id,"last time ")
  // socket.join()
  const userId = socket.handshake.query.userId;
  if (userId != "undefined") userSocketMap[userId] = socket.id;

  socket.on("sendMessage", ({authUser,userToChat,message}) => {
    const sender = authUser;
    const receiver = userToChat;
    if(userSocketMap[receiver]){
    io.to(userSocketMap[receiver]).emit('receiveMessage',{sender,message});
    }
  });
  socket.on("disconnect", () => {
    delete userSocketMap[userId];
    console.log("disconnected");
  });
});

const redisConnect = async () => {
  await client.connect();
};
redisConnect();

client.on("connect", function () {
  console.log("Connected!");
});

app.post("/login", async (req, res) => {
  const { userName } = req.body;
  await client.SADD("userName", userName);
  req.session.userName = userName;
  return res.status(200).json({ message: "user signed in successfully" });
});

const protected = async (req, res, next) => {
  if (req.session.userName) {
    return next();
  }
  return res.status(401).json({ message: "unauthorized user okayy" });
};

app.get("/alluser", [protected], async (req, res) => {
  const allUser = await client.SMEMBERS("userName");
  return res.status(200).json({ allUser });
});

app.get("/checklogin", [protected], async (req, res) => {
  return res.status(200).json({ user: req.session.userName });
});

app.get("/", async (_, res) => {
  await client.set("123", "hii okayy donne doneee");
  const reply = await client.get("123");
  return res.status(200).json({ message: "hello world" });
});

httpServer.listen(5000, () => {
  console.log("connection establisheddd");
});
