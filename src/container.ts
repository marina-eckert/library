import "reflect-metadata";
import { Container } from "inversify";
import { BooksRepository } from "./repositories/books-repository";

const container = new Container();

container.bind(BooksRepository).toSelf().inSingletonScope();

export { container };
