/*
Comprovacions guanyar:
Escala Real/Royal Flush *
Escala de color/Straight Flush *
Poker/ Four of a kind
Full / Full House
Color / Flush *
Escalera / Straight *
Trio / Three of a kind
Doble parella / Two pair
Parella / Pair
Carta alta
*/
function sortHandByValue (hand) {
  const copyHand = arrangeCardValues(structuredClone(hand))
  return copyHand.sort((a, b) => a.value - b.value)
}
function sortHandByValueDescendant (hand) {
  const copyHand = arrangeCardValues(structuredClone(hand))
  return copyHand.sort((a, b) => b.value - a.value)
}
function sortHandBySuit (hand) {
  const copyHand = structuredClone(hand)
  const lengthHand = hand.length
  for (let i = 0; i < lengthHand - 1; i++) {
    for (let j = i + 1; j < lengthHand; j++) {
      if (copyHand[j].suit < copyHand[i].suit) {
        [copyHand[i].suit, copyHand[j].suit] = [copyHand[j].suit, copyHand[i].suit]
      }
    }
  }
  return copyHand
}
function arrangeCardValues (hand) {
  const copyHand = structuredClone(hand)
  for (const card of copyHand) {
    if (['A', 'J', 'Q', 'K'].includes(card.value)) {
      switch (card.value) {
        case 'A':
          card.value = 14
          break
        case 'J':
          card.value = 11
          break
        case 'Q':
          card.value = 12
          break
        case 'K':
          card.value = 13
          break
      }
    } else {
      card.value = parseInt(card.value)
    }
  }
  return copyHand
}

function isStraight (hand) {
  const sortedHand = sortHandByValue(hand)
  let straightCards = []
  for (let i = 0; i < sortedHand.length - 1; i++) {
    if (sortedHand[i].value === sortedHand[i + 1].value - 1) {
      straightCards.push(sortedHand[i])
    } else if (sortedHand[i].value - sortedHand[i + 1].value !== 0) {
      straightCards = []
    }
  }
  if (sortedHand[sortedHand.length - 2].value === sortedHand[sortedHand.length - 1].value - 1) {
    straightCards.push(sortedHand[sortedHand.length - 1])
  }
  if (straightCards.length >= 5) {
    return {
      value: true,
      highCard: highestCardFinder(straightCards)
    }
  } else return { value: false }
}
function isSameSuit (hand) {
  const sortedHand = sortHandBySuit(hand)
  const suitCounter = {
    hearts: [],
    spades: [],
    diamonds: [],
    clubs: []
  }
  sortedHand.forEach(n => {
    switch (n.suit) {
      case 'hearts':
        suitCounter.hearts.push(n)
        break
      case 'diamonds':
        suitCounter.diamonds.push(n)
        break
      case 'spades':
        suitCounter.spades.push(n)
        break
      case 'clubs':
        suitCounter.clubs.push(n)
        break
    }
  })

  const sameSuitArray = Object.values(suitCounter).find(n => n.length >= 5)
  if (typeof (sameSuitArray) === 'undefined') return { array: [] }
  else {
    return {
      array: sameSuitArray,
      highestFlushCard: highestCardFinder(sameSuitArray)
    }
  }
}
function isRoyalFlush (sameSuitCards) {
  const found10card = sameSuitCards.filter(n => n.value === 10 || n.value === 14)
  if (typeof (found10card) === 'undefined' || found10card.length === 1) return false
  else return true
}
function equalCardsFinder (hand) {
  const copyHand = arrangeCardValues(structuredClone(hand))
  const pairsFound = {}
  copyHand.forEach(card => {
    if (pairsFound[card.value]) pairsFound[card.value].push(card)
    else pairsFound[card.value] = [card]
  })
  const equalCards = Object.values(pairsFound).filter(n => n.length > 1)
  if (equalCards.findIndex(n => n.length === 4) !== -1) return { name: 'Four of a Kind', score: 8, highCard: equalCards[0] }
  if (equalCards.length === 1) {
    if (equalCards[0].length === 3) {
      return {
        name: 'Three of a Kind',
        score: 4,
        highCard: highestCardFinder(equalCards[0])
      }
    }
    return {
      name: 'Pair',
      score: 2,
      highCard: highestCardFinder(equalCards[0])
    }
  } else if (equalCards.length >= 2) {
    equalCards.sort((a, b) => b[0].value - a[0].value)
    if (equalCards.filter(p => p.length > 2).length >= 1) {
      return { name: 'Full House', score: 7, highCard: equalCards[0][0] }
    } else {
      return { name: 'Two Pair', score: 3, highCard: equalCards[0][0] }
    }
  }
  return { name: 'High Card', score: 1, highCard: highestCardFinder(hand) }
}
function highestCardFinder (hand) {
  const highestCard = hand.reduce((maxCard, currentCard) => {
    return currentCard.value > maxCard.value ? currentCard : maxCard
  }, hand[0])
  return highestCard
}
// funcio principal
function handResolver (hand) {
  const sameSuitCards = isSameSuit(hand) // Variable amb totes les cartes de color
  const checkForStraight = isStraight(hand)
  // Escala Real (=palo,10-A), Escala de color, Color
  if (sameSuitCards.array.length >= 5) {
    // Escala Real, Escala de color
    if (checkForStraight.value) {
      // Escala Real, no es pot empatar
      if (isRoyalFlush(sameSuitCards.array)) return { name: 'Royal Flush', score: 10, highCard: { value: 14 } }
      // Escala de color
      else return { name: 'Straight Flush', score: 9, highCard: checkForStraight.highCard }
    } else return { name: 'Flush', score: 6, highCard: sameSuitCards.highestFlushCard } // Color
  }
  // Escala(NO ES DE COLOR)
  if (checkForStraight.value) {
    return {
      name: 'Straight',
      score: 5,
      highCard: checkForStraight.highCard
    }
  }
  // Poker | Full | Trio | Doble Parella | Parella
  return equalCardsFinder(hand)
}

export { isSameSuit, isStraight, sortHandBySuit, isRoyalFlush, handResolver, highestCardFinder, sortHandByValue, sortHandByValueDescendant }
