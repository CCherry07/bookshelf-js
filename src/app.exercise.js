/** @jsx jsx */
import { jsx } from '@emotion/core'

import * as React from 'react'
import { useEffect } from 'react';
import * as auth from 'auth-provider'
import { AuthenticatedApp } from './authenticated-app'
import { UnauthenticatedApp } from './unauthenticated-app'
import { FullPageSpinner } from 'components/lib';
import { useAsync } from 'utils/hooks';
import { client } from './utils/api-client';
import * as colors from './styles/colors';
async function getUser() {
  const token = await auth.getToken()
  console.log(token);
  if (!token) return
  const data = await client('me', { token })
  return data.user ?? ""
}
function App() {
  const { setData: setUser, data: user, run, isLoading, isIdle, error, isError, isSuccess } = useAsync()
  useEffect(() => {
    run(getUser())
  }, [run]);
  if (isLoading || isIdle) {
    return <FullPageSpinner />
  }

  if (isError) {
    return (
      <div
        css={{
          color: colors.danger,
          height: '100vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <p>Uh oh... There's a problem. Try refreshing the app.</p>
        <pre>{error.message}</pre>
      </div>
    )
  }

  const login = form => auth.login(form).then(u => setUser(u))
  const register = form => auth.register(form).then(u => setUser(u))
  const logout = () => auth.logout().finally(() => setUser(null))
  if (isSuccess) {
    return user ? <AuthenticatedApp user={user} logout={logout} /> : <UnauthenticatedApp login={login} register={register} />
  }
}

export { App }

/*
eslint
  no-unused-vars: "off",
*/
