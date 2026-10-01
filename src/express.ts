import "reflect-metadata";

import express from "express";
import booksRouter from "./routes/books";

const app = express();

app.use(express.json());

app.use("/books", booksRouter);

const PORT = 3001;

app.listen(PORT, () => {
  console.log(
    `TypeScript Express server is running on http://localhost:${PORT}`,
  );
});
