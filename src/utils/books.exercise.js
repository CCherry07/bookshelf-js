import { useQuery } from 'react-query';
import { client } from "../utils/api-client"
import bookPlaceholderSvg from 'assets/book-placeholder.svg'

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
export const useQueryBookSearch = (query, user) => {
  const result = useQuery({
    queryKey: ["book", { query }],
    queryFn: () => client(`books?query=${encodeURIComponent(query)}`, {
      token: user.token,
    }).then(data => data.books),
  })
  return { ...result, books: result.data ?? loadingBooks }
}
