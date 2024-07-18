require("dotenv").config();
const fs = require("fs");
const cron = require("node-cron");
const path = require("path");
const express = require("express");
const uuid = require("uuid");
const nodemailer = require("nodemailer");
const bcrypt = require("bcrypt");
const session = require("express-session");
const helmet = require("helmet");
const app = express();
const http = require("http").Server(app);
const io = require("socket.io")(http);
// const { Server } = require("socket.io");
const RATE_LIMIT_INTERVAL = 60 * 60 * 1000;
const RATE_LIMIT_COUNT = 2;
const ipCountMap = new Map();

const MAX_CONCURRENT_SESSIONS = 100;
const users = {};
const sessionQueue = [];

const PORT = process.env.PORT || 3000;

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(express.static("public"));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(
  session({
    secret: process.env.SECRET_KEY_ADMIN,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: true,
      httpOnly: true,
      sameSite: "strict",
    },
  })
);

app.use(helmet.hsts());

// const httpServer = require("http").createServer(app);
// const io = new Server(httpServer);
// io.on("connection", (socket) => {
//   console.log("A user connected");

//   socket.on("statusChange", (status) => {
//     io.emit("updateStatus", status);
//   });

//   socket.on("disconnect", () => {
//     console.log("A user disconnected");
//   });
// });

app.get("/", (req, res) => {
  res.render("index");
});

app.post("/", (req, res) => {
  console.log(req.body);
  const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
  const now = Date.now();
  const ipCount = ipCountMap.get(ip) || { count: 0, timestamp: now };
  if (now - ipCount.timestamp < RATE_LIMIT_INTERVAL) {
    if (ipCount.count >= RATE_LIMIT_COUNT) {
      res.status(429).send("Too many requests, Try again later.");

      return;
    }
    ipCount.count++;
  } else {
    ipCount.count = 1;
    ipCount.timestamp = now;
  }
  ipCountMap.set(ip, ipCount);
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    // requireTLS: true,
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_APP_PASSWORD,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });

  let messageHtml = `<link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Teko:wght@400;500;600;700&display=swap" rel="stylesheet">
    <div style="background-color: #151516; color: #f9f9f9;"><center><br><br>
      <a href="mabsrencode.com"><img width="150px" src="https://mabsrencode.com/images/logo-light.png" alt="logo"></a><br>
      <p style="font-family: 'Teko', sans-serif; color: #f9f9f9; font-weight: 700;">Front-End Developer</p><br><br>
      <h3 style="font-family: 'Teko', sans-serif; color: #f9f9f9; font-weight: 400;">A Contact Request from <strong>${req.body.name}.</strong></h3><br><br>
    </center></div><br><br>
    Name: ${req.body.name}<br>Phone Number: ${req.body.phone}<br><br>Message: ${req.body.message}`;

  const mailOptions = {
    from: `Mabsrencode Notification <mabsren@mabsrencode.com>`,
    to: process.env.GMAIL_USER,
    subject: `Message from: ${req.body.email}: ${req.body.subject}`,
    html: messageHtml,
  };
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
      res.send("error");
    } else {
      console.log("Email sent: " + info.response);
      res.send("success");
    }
  });
});

app.post("/feedback", (req, res) => {
  console.log(req.body);
  const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
  const now = Date.now();
  const ipCount = ipCountMap.get(ip) || { count: 0, timestamp: now };
  if (now - ipCount.timestamp < RATE_LIMIT_INTERVAL) {
    if (ipCount.count >= RATE_LIMIT_COUNT) {
      res.status(429).send("Too many requests, Try again later.");

      return;
    }
    ipCount.count++;
  } else {
    ipCount.count = 1;
    ipCount.timestamp = now;
  }
  ipCountMap.set(ip, ipCount);
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    // requireTLS: true,
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_APP_PASSWORD,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });

  let messageHtml = `<link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Teko:wght@400;500;600;700&display=swap" rel="stylesheet">
    <div style="background-color: #151516; color: #f9f9f9;"><center><br><br>
      <a href="mabsrencode.com"><img width="150px" src="https://mabsrencode.com/images/logo-light.png" alt="logo"></a><br>
      <p style="font-family: 'Teko', sans-serif; color: #f9f9f9; font-weight: 700;">Front-End Developer</p><br><br>
      <h3 style="font-family: 'Teko', sans-serif; color: #f9f9f9; font-weight: 400;">A Contact Request from <strong>${req.body.email}.</strong></h3><br><br>
    </center></div><br><br>Feedback: ${req.body.message}`;

  const mailOptions = {
    from: `Mabsrencode Notification <mabsren@mabsrencode.com>`,
    to: process.env.GMAIL_USER,
    subject: `Message from: ${req.body.email}`,
    html: messageHtml,
  };
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
      res.send("error");
    } else {
      console.log("Email sent: " + info.response);
      res.send("success");
    }
  });
});

// updated
function authenticate(req, res, next) {
  const { username, password } = req.query;

  if (
    username === process.env.ADMIN_USER_DASHBOARD &&
    bcrypt.compareSync(password, process.env.ADMIN_PASSWORD_DASHBOARD)
  ) {
    next();
  } else {
    res.redirect("/admin");
  }
}

app.get("/admin", (req, res) => {
  res.render("admin", { error: false });
});

app.get("/feedback", (req, res) => {
  res.render("feedback");
});

app.get("/privacy", (req, res) => {
  res.render("privacy");
});
app.get("/terms", (req, res) => {
  res.render("terms");
});

app.get("/success", (req, res) => {
  res.render("success");
});

app.get("/blog-post", (req, res) => {
  const filePath = path.join(__dirname, "data", "posts.json");
  const fileData = fs.readFileSync(filePath);
  const storedBlogPost = JSON.parse(fileData);
  res.render("blog-post", {
    numberOfBlogPost: storedBlogPost.length,
    blogPosts: storedBlogPost,
  });
});

app.get("/blog-post/:id", (req, res) => {
  const blogsId = req.params.id;
  const filePath = path.join(__dirname, "data", "posts.json");
  const fileData = fs.readFileSync(filePath);
  const storedBlogPost = JSON.parse(fileData);

  for (const blogPost of storedBlogPost) {
    if (blogPost.id === blogsId) {
      return res.render("blog-post-detail", { blogPost: blogPost });
    }
  }

  res.status(404).render("404");
});

app.get("/blog-post-admin", authenticate, (req, res) => {
  res.render("blog-post-admin");
});

app.post("/blog-post-admin", (req, res) => {
  const { title, description, link, embed } = req.body;

  if (
    containsScriptTags(title) ||
    containsScriptTags(description) ||
    containsScriptTags(link) ||
    containsScriptTags(embed)
  ) {
    return res
      .status(400)
      .send("Invalid input. Script tags are not allowed Bitch!");
  }

  const blogPost = { id: uuid.v4(), title, description, link, embed };
  const filePath = path.join(__dirname, "data", "posts.json");
  const fileData = fs.readFileSync(filePath);
  const storedBlogPosts = JSON.parse(fileData);
  storedBlogPosts.push(blogPost);
  fs.writeFileSync(filePath, JSON.stringify(storedBlogPosts));

  res.redirect("/success");
});
function containsScriptTags(input) {
  const scriptRegex = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi;
  const pyscriptRegex =
    /<py-script\b[^<]*(?:(?!<\/py-script>)<[^<]*)*<\/py-script>/gi;
  const pyConfigRegex =
    /<py-config\b[^<]*(?:(?!<\/py-config>)<[^<]*)*<\/py-config>/gi;
  const phpRegex = /<?php\b[^<]*(?:(?!<\?>)<[^<]*)*<\?>/gi;
  return (
    scriptRegex.test(input) ||
    pyscriptRegex.test(input) ||
    pyConfigRegex.test(input) ||
    phpRegex.test(input)
  );
}
app.get("/success", (req, res) => {
  res.render("success");
});

//updated
app.post("/admin", (req, res) => {
  const { username, password } = req.body;

  if (
    username === process.env.ADMIN_USER_DASHBOARD &&
    password === process.env.ADMIN_PASSWORD_DASHBOARD
  ) {
    res.render("blog-post-admin", { status: "offline", error: false });
  } else {
    res.status(401).render("admin", { error: true });
  }
});

app.use(function (req, res) {
  res.status(404).render("404");
});

app.use(function (err, req, res, next) {
  console.error(err.stack);
  res.status(500).render("500");
});

io.on("connection", (socket) => {
  socket.on("ping", (callback) => {
    callback();
  });

  console.log(`user: ${socket.id} connected`);

  socket.on("admin:message", (message) => {
    io.emit("admin:message", message);
  });

  socket.on("user:message", (message) => {
    if (sessionQueue.length < MAX_CONCURRENT_SESSIONS) {
      sessionQueue.push(socket.id);
      users[socket.id] = true;
      io.emit("user:message", message);
    } else {
      socket.emit("user:message", "Chat session limit reached. Please wait...");
    }
  });

  socket.on("disconnect", () => {
    console.log("A user disconnected");
    delete users[socket.id];
    const sessionIndex = sessionQueue.indexOf(socket.id);
    if (sessionIndex > -1) {
      sessionQueue.splice(sessionIndex, 1);
    }
  });
});
const pingServer = () => {
  http
    .get("https://mabsrencode-portfolio-official.onrender.com", (res) => {
      console.log("Pinged server, status code:", res.statusCode);
    })
    .on("error", (err) => {
      console.error("Error pinging server:", err.message);
    });
};
http.listen(PORT, () => {
  console.log(`Server running on port ${PORT} localhost:3000`);
  cron.schedule("*/5 * * * *", pingServer);
});
