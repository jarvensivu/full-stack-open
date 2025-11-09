import { ALL_AUTHORS, ALL_BOOKS } from "./queries";

const uniqueBooks = (books, newBook) => {
    const titles = books.map(book => book.title);
    if (!titles.includes(newBook.title)) {
        return [...books, newBook];
    }
    return books;
}

export const updateBooks = (cache, book) => {
    const allBooks = cache.readQuery({ query: ALL_BOOKS })
    if (allBooks) {
        const uniqueBooksList = uniqueBooks(allBooks.allBooks, book)
        cache.writeQuery({
            query: ALL_BOOKS,
            data: {
                allBooks: uniqueBooksList
            }
        })
    }

    const bookGenres = [... book.genres, ""]
    bookGenres.forEach(bookGenre => {
        const allBooksByGenre = cache.readQuery({ query: ALL_BOOKS, variables: { genre: bookGenre } })
        if (allBooksByGenre) {
            const uniqueBooksList = uniqueBooks(allBooksByGenre.allBooks, book)
            cache.writeQuery({
                query: ALL_BOOKS,
                variables: { genre: bookGenre },
                data: {
                    allBooks: uniqueBooksList
                }
            })
        }
    })
}

export const updateAuthors = (cache, book) => {
    if (!book.author) {
        return
    }
    const allAuthors = cache.readQuery({ query: ALL_AUTHORS })
    if (allAuthors?.allAuthors) {
        const updatedAuthors = [...allAuthors.allAuthors]
        const findAuthorIndex = allAuthors.allAuthors.findIndex(a => a.name === book.author.name)
        if (findAuthorIndex === -1) {
            updatedAuthors.push(book.author)
        } else {
            updatedAuthors[findAuthorIndex] = { ...updatedAuthors[findAuthorIndex], bookCount: book.author.bookCount }
        }
        cache.writeQuery({
            query: ALL_AUTHORS,
            data: {
                allAuthors: updatedAuthors
            }
        })
    }
}