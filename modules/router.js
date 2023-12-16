import { logout } from './services/users.js'
import { generateGame, generateNewGame } from './gameViews/gameViews.js'
import { loginForm } from './views/loginForm.js'
import { signUpForm } from './views/signUpForm.js'
import { home } from './views/home.js'

export { route }

function route (ruta) {
  let params = ruta.split('?')[1]
  params = params
    ? new Map(params.split('&').map((param) => {
      const paramArray = param.split('=')
      return [paramArray[0], paramArray[1]]
    }))
    : new Map()
  ruta = ruta.split('?')[0]
  const main = document.querySelector('#container')

  switch (ruta) {
    case '#/':
      main.innerHTML = ''
      if (params.get('uid')) {
        window.location.hash = '#/game'
      } else {
        window.location.hash = '#/login'
      }
      break
    case '#/signup':
      main.innerHTML = ''
      main.append(signUpForm())
      break
    case '#/login':
      main.innerHTML = ''
      main.append(loginForm())
      break
    case '#/logout':
      logout()
      window.location.hash = '#/'
      break
    case '#/home':
      if (localStorage.getItem('uid')) {
        main.innerHTML = ''
        main.append(home())
      } else {
        window.location.hash = '#/'
      }
      break
    case '#/game':
      // main.innerHTML = '';
      if (params.get('id')) {
        // generateNewGame(main)
        generateGame(main, localStorage.getItem('gameId'))
      } else if (localStorage.getItem('gameId')) {
        window.location.hash = `#/game?id=${localStorage.getItem('gameId')}`
      } else {
        window.location.hash = '#/'
      }
      break
    case '#/newgame':
      if (localStorage.getItem('uid')) {
        generateNewGame(main)
        window.location.hash = `#/game?id=${localStorage.getItem('gameId')}`
      } else {
        window.location.hash = '#/'
      }

      break
    case '':
      window.location.hash = '#/'
      break
    default:
      window.location.hash = '#/'
  }
}
