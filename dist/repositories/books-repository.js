"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BooksRepository = void 0;
const inversify_1 = require("inversify");
let BooksRepository = class BooksRepository {
    constructor() {
        this.books = [];
    }
    createBook(book) {
        this.books.push(book);
    }
    getBook(id) {
        return this.books.find((book) => book.id === id) || null;
    }
    getBooks() {
        return this.books;
    }
    updateBook(id, updatedBook) {
        const index = this.books.findIndex((book) => book.id === id);
        if (index !== -1) {
            this.books[index] = updatedBook;
        }
    }
    deleteBook(id) {
        this.books = this.books.filter((book) => book.id !== id);
    }
};
exports.BooksRepository = BooksRepository;
exports.BooksRepository = BooksRepository = __decorate([
    (0, inversify_1.injectable)()
], BooksRepository);
