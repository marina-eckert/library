"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const container_1 = require("../container");
const books_repository_1 = require("../repositories/books-repository");
const router = express_1.default.Router();
router.get("/", (req, res) => {
    const repo = container_1.container.get(books_repository_1.BooksRepository);
    const books = repo.getBooks();
    res.json(books);
});
router.get("/:id", (req, res) => {
    const repo = container_1.container.get(books_repository_1.BooksRepository);
    const id = Number(req.params.id);
    const book = repo.getBook(id);
    if (!book) {
        res.status(404).json({
            message: "Book not found",
        });
        return;
    }
    res.json(book);
});
exports.default = router;
