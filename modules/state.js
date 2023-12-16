import * as deck from './deck.js'
import { Player } from './player.js'
import {
  displayMoney, displayDealer, displayTableCards, displayPlayerCards, displayCurrentPLayer
} from './gameViews/gameViews.js'
import { handResolver, sortHandByValueDescendant } from './handResolver.js'

const logState = (state) => {

}

const gameState = () => ({
  deal: 0, // Aposta
  players: [new Player({ id: 1, isDealer: true, isPlaying: false, playerState: 'In' }),
    new Player({ id: 2, isDealer: false, isPlaying: true, playerState: 'In' }),
    new Player({ id: 3, isDealer: false, isPlaying: false, playerState: 'In' }),
    new Player({ id: 4, isDealer: false, isPlaying: false, playerState: 'In' })],
  round: 'Preflop', // Ronda
  whoIsDealer: 0, // Qui es dealer
  table: [], // Ma de la taula
  blinds: 10, // Cegues
  deck: deck.newDeck(), // Baralla de cartes
  playingNow: 2, // Index jugador actual
  minDealValue: 10 // Aposta minima per a jugar
})
// Funcions sobre partides i rondes
function newRound (state) {
  resetPlayersDeal(state.players)
  state.deal = 0
  state.round = 'Preflop'
  state.whoIsDealer = nextDealer(state)
  state.table = []
  restartPlayersState(state)
  state.playingNow = getStartingPlayer(state.players, state.whoIsDealer).id
  displayCurrentPLayer(state.playingNow)
  displayTableCards(state.table)
  state.deck = deck.newDeck()
  state.minDealValue = state.blinds
  displayMoney(state.players)
  giveCardsToPlayers(state)
}
function nextRound (state) {
  switch (state.round) {
    case 'Preflop':
      state.round = 'Flop'
      state.table = state.table.concat(deck.giveCards(3, state.deck))
      changePlayersStateIn(state)
      break
    case 'Flop':
      state.round = 'Turn'
      state.table = state.table.concat(deck.giveCards(1, state.deck))
      changePlayersStateIn(state)
      displayTableCards(state.table)
      break
    case 'Turn':
      state.round = 'River'
      state.table = state.table.concat(deck.giveCards(1, state.deck))
      changePlayersStateIn(state)
      displayTableCards(state.table)
      break
    case 'River':
      giveMoneyToPlayer(state, checkForWinner(state.players, state.table))
      newRound(state)
  }
}
/*
function dealBlinds (state) {
  let nextPlayer
  if (state.whoIsDealerId === 4) {
    nextPlayer = state.players[1]
  } else {
    nextPlayer = state.players[state.whoIsDealerId + 1]
  }
  // Small blind
  nextPlayer.deal(state.blinds / 2)
  // Big blind
  if (nextPlayer.id === 4) {
    nextPlayer = state.players[1]
  } else {
    nextPlayer = state.players[nextPlayer.id + 1]
  }
  nextPlayer.deal(state.blinds)
  if (state.playingNow === 3) {
    state.playingNow = 2
  }
} */
// Funcions sobre els jugadors
function getCurrentPlayer (players) {
  return players.find(p => p.isPlaying)
}
function nextDealer (state) {
  let whoIsDealerIndex = state.whoIsDealer
  state.players[whoIsDealerIndex].isDealer = false
  whoIsDealerIndex += 1
  if (whoIsDealerIndex > 3) whoIsDealerIndex = 0
  state.players[whoIsDealerIndex].isDealer = true
  displayDealer(whoIsDealerIndex)
  return whoIsDealerIndex
}
function nextPlayer (state) {
  getCurrentPlayer(state.players).isPlaying = false
  const nextPlayer = state.players.find(p => p.id === findNextPlayer(getPlayersInGame(state.players), state.playingNow))
  state.playingNow = nextPlayer.id
  nextPlayer.isPlaying = true
}
function findNextPlayer (playersIn, playingNowId) {
  let nextPlayerId = playingNowId + 1
  if (nextPlayerId > 4) nextPlayerId = 1
  while (playersIn.find(p => p.id === nextPlayerId) === undefined) {
    nextPlayerId += 1
    if (nextPlayerId > 4) nextPlayerId = 1
  }
  return nextPlayerId
}
function getStartingPlayer (players, dealerId) {
  const nextPlayerId = dealerId + 2
  if (nextPlayerId > 4) return players.find(p => p.id === 1)
  return players.find(p => p.id === nextPlayerId)
}
function giveCardsToPlayers (state) {
  for (const player of state.players) {
    player.cards = deck.giveCards(2, state.deck)
  }
  displayPlayerCards(state.players)
}
function restartPlayersState (state) {
  for (const player of state.players) {
    player.playerState = 'In'
  }
}
function changePlayersStateIn (state) {
  for (const player of state.players) {
    if (player.playerState === 'Pass') player.playerState = 'In'
  }
}
function giveMoneyToPlayer (state, idWinner) {
  const player = state.players.find(p => p.id === idWinner)
  player.money = player.money + state.deal
  state.deal = 0
}
function resetPlayersDeal (players) {
  return players.forEach((p) => { p.playerDeal = 0 })
}
// ¿Quan s'avança de ronda? Tots passen, tots han apostat el mateix (els que juguen)
function checkEndRound (state) {
  if (state.players.filter(p => p.playerState === 'Out').length >= 3 ||
    getPlayersInGame(state.players).every(p => p.playerState === 'AllIn')) {
    state.round = 'River'
    return true
  }
  for (const player of state.players) {
    if (player.playerState !== 'Pass' && player.playerState !== 'AllIn' && player.playerState !== 'Out') {
      return false
    }
  }
  return true
}
function getPlayersWithHighScore (copyPlayers, highestScore) {
  return copyPlayers.filter(p => p.playerScore.score === highestScore.score &&
    p.playerScore.highCard.value === highestScore.highCard.value)
}
function getPlayersInGame (copyPlayers) {
  return copyPlayers.filter(p => p.playerState !== 'Out')
}

function checkForPassOrRaise (state) {
  const currentPlayer = getCurrentPlayer(state.players)
  if (currentPlayer.playerState !== 'AllIn') {
    if (currentPlayer.playerDeal > state.minDealValue) {
      currentPlayer.playerState = 'Raise'
      state.minDealValue = currentPlayer.playerDeal
    } else {
      currentPlayer.playerState = 'Pass'
    }
  } else {
    state.minDealValue = currentPlayer.playerDeal
  }
}
function deal (ammount, player) {
  if (ammount === player.money) {
    player.money = 0
    player.playerState = 'AllIn'
    player.playerDeal += ammount
    return ammount
  } else if (ammount < player.money) {
    player.money -= ammount
    player.playerDeal += ammount
    return ammount
  }
}
// Funcions per a saber el guanyador
function checkForWinner (players, table) {
  const copyPlayers = getPlayersInGame(structuredClone(players))
  copyPlayers.forEach(p => {
    const playerHand = p.cards.concat(table)
    p.playerScore = handResolver(playerHand)
  })
  const highestScore = copyPlayers.reduce((maxPlayer, thisPlayer) => {
    if (thisPlayer.playerScore.score > maxPlayer.playerScore.score) return thisPlayer
    else if (thisPlayer.playerScore.score === maxPlayer.playerScore.score && thisPlayer.playerScore.highCard.value > maxPlayer.playerScore.highCard.value) return thisPlayer
    else return maxPlayer
  }, copyPlayers[0])
  const playersWithHighScore = getPlayersWithHighScore(copyPlayers, highestScore.playerScore)
  if (playersWithHighScore.length === 1) {
    return highestScore.id
  } else {
    return sameScoreResolver(playersWithHighScore)
  }
}
function sameScoreResolver (players) {
  const copyPlayers = structuredClone(players)
  let playersRemaining = copyPlayers.map(p => ({
    idPlayer: p.id,
    sortedHand: sortHandByValueDescendant(p.cards)
  }))
  while (playersRemaining.length > 1) {
    const highestCardValue = Math.max(...playersRemaining.map(p => p.sortedHand[0].value))
    const playersWithHighestCard = playersRemaining.filter(p => p.sortedHand[0].value === highestCardValue)
    // Sols un jugador amb la carta mes alta, retornam la seua id
    if (playersWithHighestCard.length === 1) return playersWithHighestCard[0].idPlayer
    else {
      playersRemaining = playersWithHighestCard.map(p => ({
        idPlayer: p.idPlayer,
        sortedHand: p.sortedHand.slice(1)
      }))
    }
  }
  return playersRemaining[0].idPlayer
}

// Funcions sobre els botons

/*
Accions state
Crear state(nouJoc)
Pasar el torn
Canviar el dealer
Avançar Ronda
  Mirar si s'ha acabat la ronda (sen van tots)
    Donar aposta al guanyador
    Nova ronda
  Mirar si es la ultima ronda (all-in o river)
    Comprovar qui es el guanyador
    Nova ronda
  Si no, passar de ronda

*/
export {
  checkForWinner, sameScoreResolver, gameState, logState, checkForPassOrRaise, getCurrentPlayer, nextPlayer, deal, checkEndRound, nextRound,
  giveCardsToPlayers
}
