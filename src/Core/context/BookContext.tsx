import React, { useState } from 'react';
import { Book } from '../../Books/List/interfaces/Book';
import { requestGetAllBooks } from '../../Books/state/fetchBooks';

interface BooksContext {
  books: Book[];
  loading: boolean;
  getAllBooks: () => void;
}

const Context = React.createContext<BooksContext | undefined>(undefined);

export function BooksProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<BooksContext>({
    books: [],
    loading: true,
    getAllBooks: () => {},
  });

  const addBook = (newBook: Book) => {
    setState(({ books, ...rest }) => ({
      books: [...books, newBook],
      ...rest,
    }));
  };

  const getAllBooks = async () => {
    const books = await requestGetAllBooks();
    if (books) {
      setState(({ books: _, ...rest }) => ({
        books,
        ...rest,
      }));
    }
  };

  const value = { ...state, addBook, getAllBooks };

  return <Context.Provider value={value}>{children}</Context.Provider>;
}

export function useBooks() {
  const context = React.useContext(Context);
  if (!context) {
    throw new Error('useBooks must be used within a BooksProvider');
  }
  return context;
}