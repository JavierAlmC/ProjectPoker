import { route } from './router.js'

document.addEventListener('DOMContentLoaded', () => {
  route(window.location.hash)
  console.log(window.location.hash)
  window.addEventListener('hashchange', () => {
    route(window.location.hash)
    console.log(window.location.hash)
  })
})
