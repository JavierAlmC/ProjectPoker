export { home }
function home () {
  const divLogin = document.createElement('div')
  divLogin.classList.add('welcomeCard')

  divLogin.innerHTML = `
    <div class="home-row">
        <h1 class="title">Welcome to Poker Simulator</h1>
    </div>
    <div class="home-row">
        <div class="form_submit"><a href='#/newgame'>New Game</a></div>
        <div class="form_submit"><a href='#/game'>Load Game</a></div>
    </div>`

  return divLogin
}
