// 🐨 create and export a React context variable for the AuthContext
// 💰 using React.createContext

import React, { useContext } from 'react';
import * as auth from 'auth-provider';
import { useAsync } from 'utils/hooks';
import { queryCache } from 'react-query';
import { client } from 'utils/api-client';
import { FullPageSpinner, FullPageErrorFallback } from '../components/lib'
const AuthContext = React.createContext()
async function getUser() {
  let user
  const token = await auth.getToken()
  if (token) {
    const data = await client('me', { token })
    user = data.user
  }
  return user
}
function AuthProvider({ children }) {
  const {
    data: user,
    error,
    isLoading,
    isIdle,
    isError,
    isSuccess,
    run,
    setData,
    status
  } = useAsync()

  React.useEffect(() => {
    run(getUser())
  }, [run])

  const login = form => auth.login(form).then(user => setData(user))
  const register = form => auth.register(form).then(user => setData(user))
  const logout = () => {
    auth.logout()
    queryCache.clear()
    setData(null)
  }

  if (isLoading || isIdle) {
    return <FullPageSpinner />
  }

  if (isError) {
    return <FullPageErrorFallback error={error} />
  }
  const value = {
    user,
    login,
    register,
    logout
  }
  if (isSuccess) return (<AuthContext.Provider value={value}>
    {children}
  </AuthContext.Provider>)
  throw new Error(`Unhandled status: ${status}`)
}

function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error(`useAuth must be used within a AuthProvider`)
  return context
}

export { AuthProvider, useAuth }

