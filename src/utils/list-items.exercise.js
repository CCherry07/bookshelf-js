import { useQuery, useMutation, queryCache } from 'react-query'
import { client } from 'utils/api-client'
import { useBook } from './books.exercise'

export const useListItems = (user) => {
  const result = useQuery({
    queryKey: 'list-items',
    queryFn: () => client('list-items', { token: user.token }).then(data => data.listItems)
  })
  return { ...result, listItems: result.data }
}
export const useListItem = (user, bookId) => {
  const { book } = useBook(bookId, user)
  const { listItems } = useListItems(user)
  const listItem = listItems?.find(li => li.id === book.id) || null
  return listItem
}

const defaultMutationOptions = {
  onError: (err, variables, recover) =>
    typeof recover === 'function' ? recover() : null,
  onSettled: () => queryCache.invalidateQueries('list-items'),
}

export const useCreateListItem = (user) => {
  return useMutation(({ bookId }) => client("list-items", { data: { bookId }, token: user.token }),
    {
      onSettled: () => queryCache.invalidateQueries("list-items")
    })
}

export const useRemoveListItem = (user, ...options) => {
  return useMutation(({ id }) => client(`list-items/${id}`,
    { method: "DELETE", token: user.token }), {
    onMutate: (removedItem) => {
      const previousItems = queryCache.getQueryData('list-items')
      queryCache.setQueryData("list-items", oldData => {
        oldData.filter((item) => {
          return item.id !== removedItem.id
        })
      })
      return () => queryCache.setQueryData('list-items', previousItems)
    },
    ...defaultMutationOptions,
    ...options
  })
}

export const useUpdateListItem = (user, ...options) => {
  return useMutation(
    updates => client(`list-items/${updates.id}`, {
      method: 'PUT',
      data: updates,
      token: user.token,
    }),
    {
      onMutate: (newItem) => {
        const previousItems = queryCache.getQueryData('list-items')
        queryCache.setQueryData("list-items", oldData => {
          oldData.map((item) => {
            return item.id === newItem.id ? { ...item, newItem } : item
          })
        })
        return () => queryCache.setQueryData('list-items', previousItems)
      },
      ...defaultMutationOptions,
      ...options
    },
  )

}
