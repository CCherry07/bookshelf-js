// 🐨 you'll need to import react and createRoot from react-dom up here
import React, { useState } from 'react'
import { createRoot } from 'react-dom'
import '@reach/dialog/styles.css'
import { Dialog } from '@reach/dialog'
import { Logo } from './components/logo'



// 🐨 you'll also need to import the Logo component from './components/logo'
function LoginForm({ setOpenModal, title, handleSubmit }) {
  function submit(e) {
    e.preventDefault()
    const { username, password } = e.target.elements
    handleSubmit({
      username: username.value,
      password: password.value
    })
  }
  return (
    <div>
      <button onClick={() => setOpenModal("none")}>close</button>
      <form onSubmit={submit}>
        <h1> {title} </h1>
        <div>
          <label htmlFor="username">
            <input type="text" name="" id="username" />
          </label>
        </div>
        <div>
          <label htmlFor="password">
            <input type="password" name="" id="password" />
          </label>
        </div>
        <button type='submit'> submit </button>
      </form>
    </div>
  )
}

function App() {
  const [openModal, setOpenModal] = useState(null)
  function handleSubmit(loginform) {
    console.log(loginform);
  }
  return (
    <div>
      <Logo width='80' height='80' />
      <h1>Bookshelf</h1>
      <button onClick={() => setOpenModal("login")}>login</button>
      <button onClick={() => setOpenModal("register")}>register</button>

      <Dialog aria-label='login from' isOpen={openModal === "login"}>
        <LoginForm title={'login'} setOpenModal={setOpenModal} handleSubmit={handleSubmit} />
      </Dialog>
      <Dialog aria-label='register from' isOpen={openModal === "register"}>
        <LoginForm title={'register'} setOpenModal={setOpenModal} handleSubmit={handleSubmit} />
      </Dialog>
    </div>
  )
}
// 🐨 create an App component here and render the logo, the title ("Bookshelf"), a login button, and a register button.
// 🐨 for fun, you can add event handlers for both buttons to alert that the button was clicked

createRoot(document.getElementById('root')).render(<App />)
// 🐨 use createRoot to render the <App /> to the root element
// 💰 find the root element with: document.getElementById('root')
