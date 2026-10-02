import "dotenv/config";

import express, { Request, Response } from "express";
import session from "express-session";
import passport from "passport";
import path from "path";
import http from "http";
import { Server } from "socket.io";

import connectDB from "./config/db";
import configurePassport from "./config/passport";

import apiBooksRouter from "./routes/api/books";
import apiUserRouter from "./routes/api/user";
import webBooksRouter from "./routes/web/books";

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const PORT = process.env.PORT || 3000;

connectDB();
configurePassport(passport);

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "..", "src", "views"));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  session({
    secret: process.env.SESSION_SECRET || "development-secret",
    resave: false,
    saveUninitialized: false,
  }),
);

app.use(passport.initialize());
app.use(passport.session());

app.use(express.static(path.join(__dirname, "..", "public")));
app.use("/uploads", express.static(path.join(__dirname, "..", "uploads")));

app.use("/api/books", apiBooksRouter);
app.use("/api/user", apiUserRouter);
app.use("/", webBooksRouter);

interface Comment {
  id: string;
  author: string;
  text: string;
  createdAt: string;
}

const commentsByBook = new Map<string, Comment[]>();

io.on("connection", (socket) => {
  socket.on("joinBook", (bookId: string) => {
    socket.join(`book:${bookId}`);

    const comments = commentsByBook.get(bookId) || [];
    socket.emit("comments:init", comments);
  });

  socket.on(
    "comment:add",
    ({
      bookId,
      author,
      text,
    }: {
      bookId: string;
      author?: string;
      text: string;
    }) => {
      if (!bookId || !text || !String(text).trim()) return;

      const comment: Comment = {
        id: Date.now().toString(),
        author: String(author || "Гость").trim(),
        text: String(text).trim(),
        createdAt: new Date().toISOString(),
      };

      const comments = commentsByBook.get(bookId) || [];
      comments.push(comment);
      commentsByBook.set(bookId, comments);

      io.to(`book:${bookId}`).emit("comment:new", comment);
    },
  );
});

app.use((_req: Request, res: Response) => {
  res.status(404).send("404 Not Found");
});

server.listen(PORT, () => {
  console.log(`Library app is running on http://localhost:${PORT}`);
});
