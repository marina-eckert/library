require('dotenv').config();

const express = require('express');
const session = require('express-session');
const passport = require('passport');
const path = require('path');
const http = require('http');
const { Server } = require('socket.io');

const connectDB = require('./config/db');
const configurePassport = require('./config/passport');

const apiBooksRouter = require('./routes/api/books');
const apiUserRouter = require('./routes/api/user');
const webBooksRouter = require('./routes/web/books');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const PORT = process.env.PORT || 3000;

connectDB();
configurePassport(passport);

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  session({
    secret: process.env.SESSION_SECRET || 'development-secret',
    resave: false,
    saveUninitialized: false
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use(express.static(path.join(__dirname, '..', 'public')));
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

app.use('/api/books', apiBooksRouter);
app.use('/api/user', apiUserRouter);
app.use('/', webBooksRouter);

const commentsByBook = new Map();

io.on('connection', (socket) => {
  socket.on('joinBook', (bookId) => {
    socket.join(`book:${bookId}`);

    const comments = commentsByBook.get(bookId) || [];
    socket.emit('comments:init', comments);
  });

  socket.on('comment:add', ({ bookId, author, text }) => {
    if (!bookId || !text || !String(text).trim()) return;

    const comment = {
      id: Date.now().toString(),
      author: String(author || 'Гость').trim(),
      text: String(text).trim(),
      createdAt: new Date().toISOString()
    };

    const comments = commentsByBook.get(bookId) || [];
    comments.push(comment);
    commentsByBook.set(bookId, comments);

    io.to(`book:${bookId}`).emit('comment:new', comment);
  });
});

app.use((req, res) => {
  res.status(404).send('404 Not Found');
});

server.listen(PORT, () => {
  console.log(`Library app is running on http://localhost:${PORT}`);
});