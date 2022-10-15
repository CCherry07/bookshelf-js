import { useQuery } from 'react-query';
import { client } from "../utils/api-client"
import bookPlaceholderSvg from 'assets/book-placeholder.svg'
import { queryCache } from 'react-query';

const loadingBook = {
  title: 'Loading...',
  author: 'loading...',
  coverImageUrl: bookPlaceholderSvg,
  publisher: 'Loading Publishing',
  synopsis: 'Loading...',
  loadingBook: true,
}

const loadingBooks = Array.from({ length: 10 }, (v, index) => ({
  id: `loading-book-${index}`,
  ...loadingBook,
}))
export const setQueryDataForBook = (book) => {
  queryCache.setQueryData(['book', { bookId: book.id }], book)
}
const getBookQuerySearchConfig = (query, user) => ({
  queryKey: ["bookSearch", { query }],
  queryFn: () => client(`books?query=${encodeURIComponent(query)}`, {
    token: user.token,
  }).then(data => data.books),
  config: {
    onSuccess(books) {
      books.forEach(book => {
        setQueryDataForBook(book)
      });
    }
  }
})

export const useBookSearch = (query, user) => {
  const result = useQuery(getBookQuerySearchConfig(query, user))
  return { ...result, books: result.data ?? loadingBooks }
}

export const useBook = (bookId, user) => {
  const result = useQuery({
    queryKey: ['book', { bookId }],
    queryFn: () => client(`books/${bookId}`, { token: user.token }).then(data => data.book)
  })
  return { ...result, book: result.data ?? loadingBook }
}

export const refetchBookSearchQuery = (user) => {
  queryCache.removeQueries("bookSearch")
  queryCache.prefetchQuery(getBookQuerySearchConfig("", user))
}


