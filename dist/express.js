"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const express_1 = __importDefault(require("express"));
const books_1 = __importDefault(require("./routes/books"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use("/books", books_1.default);
const PORT = 3001;
app.listen(PORT, () => {
    console.log(`TypeScript Express server is running on http://localhost:${PORT}`);
});
