import {
  signUpSupabase, loginSupabase, logoutSupabase
} from './supaConnection.js'
export { isLogged, loginUser, logout, registerUser }

async function registerUser (email, password) {
  const status = { success: false }
  try {
    const dataSignUp = await signUpSupabase(email, password)
    console.log(dataSignUp)
    status.success = true
  } catch (err) {
    console.log(err)
    status.success = false
    status.errorText = err.msg
  }
  return status
}
function expirationDate (expiresIn) {
  return Math.floor(Date.now() / 1000) + expiresIn
}
async function loginUser (email, password) {
  const status = { success: false }
  try {
    const dataLogin = await loginSupabase(email, password)
    localStorage.setItem('access_token', dataLogin.access_token)
    localStorage.setItem('uid', dataLogin.user.id)
    localStorage.setItem('email', dataLogin.user.email)
    localStorage.setItem('expirationDate', expirationDate(dataLogin.expires_in))
    status.success = true
  } catch (err) {
    console.log(err)
    status.success = false
    status.errorText = err.error_description
  }

  return status
}

function isLogged () {
  if (localStorage.getItem('access_token')) {
    if (localStorage.getItem('expirationDate') > Math.floor(Date.now() / 1000)) {
      return true
    }
  }
  return false
}

function logout () {
  logoutSupabase(localStorage.getItem('access_token')).then((lOData) => {
    console.log(lOData)
  })
  localStorage.removeItem('access_token')
  localStorage.removeItem('uid')
}
