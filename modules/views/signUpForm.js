import { registerUser } from '../services/users.js'

export { signUpForm }

function signUpForm () {
  const divLogin = document.createElement('div')
  divLogin.classList.add('card')

  divLogin.innerHTML = `
  <h1 class="title">Sign up</h1>
  <form class="form">
    <div class="form_field">
      <label for="email" class="form_label">Email</label>
      <input type="email" id="signupemail" class="form_input" />
    </div>
    <div class="form_field">
      <label for="password" class="form_label">Password</label>
      <input type="password" id="signuppassword" class="form_input" />
    </div>
    <div class="form_field">
        <p id='errors'></p>
    </div>
    <button type="button" class="form_submit" id="signupbutton">Send</button>
    <p class='link'>Already with an account?<a href="#/login">Log in</a></p>
  </form>`

  divLogin.querySelector('#signupbutton').addEventListener('click', async (event) => {
    event.preventDefault()
    const email = divLogin.querySelector('#signupemail').value
    const password = divLogin.querySelector('#signuppassword').value
    registerUser(email, password).then((status) => {
      if (status.success) window.location.hash = '#/'
      else {
        divLogin.querySelector('#errors').innerHTML = status.errorText
      }
    })
  })

  return divLogin
}
