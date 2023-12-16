// Constants per a crear les cartes
const palos = ['hearts', 'diamonds', 'clubs', 'spades']
const values = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K']

// Crear Carta
function createCard (suit, value) {
  return {
    value,
    suit
  }
}
function newDeck () {
  const deck = []
  for (const palo of palos) {
    for (const value of values) {
      const carta = createCard(palo, value)
      deck.push(carta)
    }
  }

  return shuffleDeck(deck)
}
function shuffleDeck (deck) {
  const copyDeck = [...deck]
  for (let i = copyDeck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    const aux = copyDeck[i]
    copyDeck[i] = copyDeck[j]
    copyDeck[j] = aux
  }
  return copyDeck
}
function giveCards (nCards, deck) {
  let givenCards = []
  console.log(deck)
  givenCards = deck.splice(0, nCards)
  return givenCards
}
export { newDeck, giveCards }
