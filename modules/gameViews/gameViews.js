import { getBoardTemplate } from './template.js'
import { getGame, createNewGame, updateGame } from '../services/pokerhttp.js'
import * as state from '../state.js'

const generateGame = (container, gameId) => {
  container.innerHTML = ''
  container.append(...getBoardTemplate())
  if (typeof gameId !== 'undefined') {
    const getAndDrawGame = () => {
      const uid = localStorage.getItem('uid')
      getGame(uid).then((data) => {
        const gameState = data.gameState
        drawPlayersContent(gameState)
        drawDealInputs(container)
        drawButtons(container, gameState)
      })
    }

    getAndDrawGame()
  }

  return container
}
const generateNewGame = (container) => {
  container.innerHTML = ''
  container.append(...getBoardTemplate())
  const createAndDrawGame = () => {
    const uid = localStorage.getItem('uid')
    const gameState = state.gameState()
    state.giveCardsToPlayers(gameState)
    createNewGame(uid, gameState).then((data) => {
      const gameState = data.gameState
      localStorage.setItem('gameId', data.id)
      drawPlayersContent(gameState)
      drawDealInputs(container)
      drawButtons(container, gameState)
    })
  }
  createAndDrawGame()
  return container
}

export {
  displayMoney,
  displayDealer,
  displayPlayerCards,
  displayTableCards,
  displayCurrentPLayer,
  removeBorderCurrentPlayer, generateGame, generateNewGame
}

const drawDealInputs = (container) => {
  const slider = container.querySelector('#dealRange')
  const dealValue = container.querySelector('#dealValue')
  slider.value = dealValue.value
  slider.addEventListener('input', function () {
    dealValue.value = slider.value
  })
  dealValue.addEventListener('input', function () {
    slider.value = dealValue.value
  })
  dealValue.addEventListener('keydown', (event) => {
    event.preventDefault()
  })
}
const drawPlayersContent = (state) => {
  displayCurrentPLayer(state.playingNow)
  displayMoney(state.players)
  displayDealer(state.whoIsDealer)
  displayPlayerCards(state.players)
  displayTableCards(state.table)
}
const drawButtons = (container, gameState) => {
  const sliderButtons = { slider: container.querySelector('#dealRange'), dealValue: container.querySelector('#dealValue') }
  const currentPlayer = state.getCurrentPlayer(gameState.players)
  if (gameState.minDealValue > currentPlayer.money) {
    setMinValueDealButtons(currentPlayer.money, sliderButtons)
  } else if (gameState.minDealValue - currentPlayer.playerDeal === 0) {
    setMinValueDealButtons(gameState.blinds, sliderButtons)
  } else {
    setMinValueDealButtons(gameState.minDealValue - currentPlayer.playerDeal, sliderButtons)
  }
  setMaxValueDealButtons(currentPlayer.money, sliderButtons)
  const passBtn = container.querySelector('#passBtn')
  checkForEnablingPassBtn(gameState, passBtn)
  document.getElementById('dealBtn').addEventListener('click', async function () {
    gameState.deal += state.deal(parseInt(sliderButtons.dealValue.value), currentPlayer)
    state.checkForPassOrRaise(gameState)
    state.nextPlayer(gameState)
    if (state.checkEndRound(gameState)) {
      state.nextRound(gameState)
    }
    await updateGame(gameState, localStorage.getItem('uid'))
    window.location.hash = `#/game?id=${localStorage.getItem('gameId')}&random=${Math.floor(Math.random() * 1000)}`
  })
  document.querySelector('#outBtn').addEventListener('click', async function () {
    currentPlayer.playerState = 'Out'
    state.nextPlayer(gameState)
    if (state.checkEndRound(gameState)) {
      state.nextRound(gameState)
    }
    await updateGame(gameState, localStorage.getItem('uid'))
    window.location.hash = `#/game?id=${localStorage.getItem('gameId')}&random=${Math.floor(Math.random() * 1000)}`
  })
  passBtn.addEventListener('click', async function () {
    currentPlayer.playerState = 'Pass'
    state.nextPlayer(gameState)
    if (state.checkEndRound(gameState)) {
      state.nextRound(gameState)
    }
    await updateGame(gameState, localStorage.getItem('uid'))
    window.location.hash = `#/game?id=${localStorage.getItem('gameId')}&random=${Math.floor(Math.random() * 1000)}`
  })
  document.querySelector('#homeBtn').addEventListener('click', function () {
    window.location.hash = '#/home'
  })
}
function setMinValueDealButtons (minValue, buttons) {
  buttons.slider.min = minValue
  buttons.dealValue.min = minValue
  buttons.slider.value = minValue
  buttons.dealValue.value = minValue
}
function setMaxValueDealButtons (maxValue, buttons) {
  buttons.slider.max = maxValue
  buttons.dealValue.max = maxValue
}
function checkForEnablingPassBtn (gameState, passBtn) {
  const currentPlayer = state.getCurrentPlayer(gameState.players)
  if (gameState.minDealValue === currentPlayer.playerDeal) passBtn.disabled = false
  else passBtn.disabled = true
}
function displayMoney (players) {
  const infoPlayers = document.querySelectorAll('.container-info')
  let money
  for (let i = 0; i < infoPlayers.length; i++) {
    money = infoPlayers[i].children[0]
    money.textContent = players[i].money + ' Pulas'
    const dealContainer = infoPlayers[i].children[2]
    dealContainer.textContent = players[i].playerDeal
  }
}
/* function updateMoney (playingNow) {
  const playerConainer = getCurrentPlayerContainer(playingNow.id)
  playerConainer.querySelector('.money').textContent = playingNow.money + 'Pulas'
  const dealContainer = playerConainer.querySelector('.deal')
  dealContainer.textContent = playingNow.playerDeal
} */
function displayDealer (indexDealer) {
  const infoPlayers = document.querySelectorAll('.container-info')
  infoPlayers.forEach((node, i) => {
    if (i === indexDealer) {
      node.children[1].textContent = 'Dealer'
    } else {
      node.children[1].textContent = ''
    }
  })
  const playerNodeChildren = infoPlayers[indexDealer].children
  playerNodeChildren[1].textContent = 'Dealer'
}

function displayCurrentPLayer (idCurrentPlayer) {
  const classPlayer = 'p' + idCurrentPlayer
  const playerNodes = document.querySelectorAll('.player')
  playerNodes.forEach((nodePlayer) => {
    if (classPlayer === nodePlayer.classList[1]) {
      nodePlayer.style.border = '1px solid yellow'
    } else {
      nodePlayer.style.border = ''
    }
  })
  //
}
function displayPlayerCards (players) {
  let node
  for (let i = 0; i < players.length; i++) {
    if (i === 0) {
      node = document.querySelector('#cards-p1')
      node.innerHTML = ''
      for (const card of players[i].cards) {
        const cardNode = document.createElement('div')
        cardNode.className = 'carta'
        cardNode.innerHTML = '<img src="img/' + card.value + '_of_' + card.suit + '.png" alt="">'
        node.appendChild(cardNode)
      }
    } else {
      node = document.querySelector('#cards-p' + (i + 1))
      node.innerHTML = ''
      players[i].cards.forEach(() => {
        const cardNode = document.createElement('div')
        cardNode.className = 'carta'
        cardNode.innerHTML = '<img src="img/card_back.png" alt="">'
        node.appendChild(cardNode)
      })
    }
  }
}

function displayTableCards (table) {
  const nodeTable = document.querySelector('.mesa')
  nodeTable.innerHTML = ''
  for (const card of table) {
    const cardNode = document.createElement('div')
    cardNode.className = 'carta'
    cardNode.innerHTML = '<img src="img/' + card.value + '_of_' + card.suit + '.png" alt="">'
    nodeTable.appendChild(cardNode)
  }
}

function removeBorderCurrentPlayer (idPlayer) {
  const classPlayer = '.p' + idPlayer
  const nodePlayer = document.querySelector(classPlayer)
  nodePlayer.style.border = ''
}
