import { loginUser } from '../services/users.js'

export { loginForm }
function loginForm () {
  const divLogin = document.createElement('div')
  divLogin.classList.add('card')

  divLogin.innerHTML = `
  <h1 class="title">Login</h1>
  <form class="form">
    <div class="form_field">
      <label for="email" class="form_label">Email</label>
      <input type="email" id="loginemail" class="form_input" />
    </div>
    <div class="form_field">
      <label for="password" class="form_label">Password</label>
      <input type="password" id="loginpassword" class="form_input" />
    </div>
    <div class="form_field">
        <p id='errors'></p>
    </div>
    <button type="button" class="form_submit" id="loginbutton">Send</button>
    <p class='link'>Without an account? <a href="#/signup">Sign Up</a></p>
  </form>`

  divLogin.querySelector('#loginbutton').addEventListener('click', async (event) => {
    event.preventDefault()
    const email = divLogin.querySelector('#loginemail').value
    const password = divLogin.querySelector('#loginpassword').value
    loginUser(email, password).then((status) => {
      if (status.success) window.location.hash = '#/home'
      else {
        divLogin.querySelector('#errors').innerHTML = status.errorText
      }
    })
  })

  return divLogin
}
