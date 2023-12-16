import { isSameSuit, isStraight, sortHandBySuit, isRoyalFlush, handResolver, highestCardFinder, sortHandByValueDescendant } from '../modules/handResolver.js'
import { sameScoreResolver } from '../modules/state.js'
/*eslint-disable*/
describe('Funcions comprovar ma (no resolen la mà del jugador)', function () {
  it('isSameSuit: 5 cartes amb el mateix palo', function () {
    expect(isSameSuit([{value:'A',suit:'hearts'},{value:'A',suit:'spades'},{value:'A',suit:'diamonds'},
    {value:'A',suit:'hearts'},{value:'A',suit:'hearts'},{value:'A',suit:'hearts'},{value:'A',suit:'hearts'}]).array)
    .toEqual([{value:'A',suit:'hearts'}, {value:'A',suit:'hearts'},{value:'A',suit:'hearts'},
    {value:'A',suit:'hearts'},{value:'A',suit:'hearts'}])
  })
  it('sortHandBySuit: Ordenar les cartes per el palo',function(){
    expect(sortHandBySuit([{value:'A',suit:'hearts'},{value:'A',suit:'spades'},{value:'A',suit:'spades'},
    {value:'A',suit:'hearts'},{value:'A',suit:'hearts'},{value:'A',suit:'hearts'},{value:'A',suit:'hearts'}]))
    .toEqual([{value:'A',suit:'hearts'},{value:'A',suit:'hearts'},{value:'A',suit:'hearts'},
    {value:'A',suit:'hearts'},{value:'A',suit:'hearts'},{value:'A',suit:'spades'},{value:'A',suit:'spades'}])
  })
  it('isRoyalFlush: Comprovar si es escala real',function(){
    expect(isRoyalFlush([{value: 8,suit:'hearts'},{value: 9,suit:'hearts'},{value:10,suit:'hearts'},
    {value:11,suit:'hearts'},{value:12,suit:'hearts'},{value:13,suit:'hearts'},{value:14,suit:'hearts'}]))
    .toBe(true)
  })
  it('isStraight: Comprovar si es escala',function(){
    expect(isStraight([{value: 2,suit:'hearts'},{value: 3,suit:'diamonds'},{value:4,suit:'clubs'},
    {value:5,suit:'spades'},{value:6,suit:'hearts'},{value:5,suit:'diamonds'},{value:5,suit:'spades'}]).value)
    .toBe(true)
  })
  it('highestCardFinder: Comprovar la carta més alta',function(){
    expect(highestCardFinder([{value: 8,suit:'hearts'},{value: 9,suit:'hearts'},{value:7,suit:'hearts'},
    {value:11,suit:'hearts'},{value:12,suit:'hearts'},{value:13,suit:'hearts'},{value:14,suit:'hearts'}]))
    .toEqual({value:14,suit:'hearts'})
  })
})
describe('Possibles resultats de handResolver (resoldre la mà del jugador)',function(){
  it('Escala Real',function(){
    expect(handResolver([{value: 8,suit:'hearts'},{value: 9,suit:'hearts'},{value:10,suit:'hearts'},
    {value:11,suit:'hearts'},{value:12,suit:'hearts'},{value:13,suit:'hearts'},{value:14,suit:'hearts'}]).name)
    .toBe('Royal Flush')
  })
  it('Parella',function(){
    expect(handResolver([{value: 8,suit:'hearts'},{value: 8,suit:'diamonds'},{value:9,suit:'clubs'},
    {value:3,suit:'spades'},{value:4,suit:'hearts'},{value:5,suit:'diamonds'},{value:10,suit:'spades'}]).name)
    .toBe('Pair')
  })
  it('Trio',function(){
    expect(handResolver([{value: 8,suit:'hearts'},{value: 8,suit:'diamonds'},{value:8,suit:'clubs'},
    {value:3,suit:'spades'},{value:4,suit:'hearts'},{value:5,suit:'diamonds'},{value:10,suit:'spades'}]).name)
    .toBe('Three of a Kind')
  })
  it('Poker',function(){
    expect(handResolver([{value: 8,suit:'hearts'},{value: 8,suit:'diamonds'},{value:8,suit:'clubs'},
    {value:8,suit:'spades'},{value:4,suit:'hearts'},{value:4,suit:'diamonds'},{value:4,suit:'spades'}]).name)
    .toBe('Four of a Kind')
  })
  it('Doble Parella',function(){
    expect(handResolver([{value: 8,suit:'hearts'},{value: 8,suit:'diamonds'},{value:3,suit:'clubs'},
    {value:3,suit:'spades'},{value:4,suit:'hearts'},{value:4,suit:'diamonds'},{value:10,suit:'spades'}]).name)
    .toBe('Two Pair')
  })
  it('Full',function(){
    expect(handResolver([{value: 8,suit:'hearts'},{value: 8,suit:'diamonds'},{value:8,suit:'clubs'},
    {value:3,suit:'spades'},{value:3,suit:'hearts'},{value:7,suit:'diamonds'},{value:10,suit:'spades'}]).name)
    .toBe('Full House')
  })
  it('Full : Trobar la carta alta',function(){
    expect(handResolver([{value: 3,suit:'hearts'},{value: 8,suit:'diamonds'},{value:8,suit:'clubs'},
    {value:3,suit:'spades'},{value:8,suit:'hearts'},{value:3,suit:'diamonds'},{value:10,suit:'spades'}]).highCard.value)
    .toBe(8)
  })
  it('Doble parella : Trobar la carta alta',function(){
    expect(handResolver([{value: 'A',suit:'hearts'},{value: 'A',suit:'diamonds'},{value:8,suit:'clubs'},
    {value:3,suit:'spades'},{value:7,suit:'hearts'},{value:3,suit:'diamonds'},{value:10,suit:'spades'}]).highCard.value)
    .toBe(14)
  })
  it('Escala',function(){
    expect(handResolver([{value: 2,suit:'hearts'},{value: 3,suit:'diamonds'},{value:4,suit:'clubs'},
    {value:5,suit:'spades'},{value:6,suit:'hearts'},{value:5,suit:'diamonds'},{value:5,suit:'spades'}]).name)
    .toBe('Straight')
  })
})
describe('Funcions que modifiquen els valors de les cartes',function(){
  it('sortHandByValueDescendant(): Ordena les cartes de major a menor',function(){
    expect(sortHandByValueDescendant([{value: 2,suit:'hearts'},{value: 3,suit:'diamonds'}]))
    .toEqual([{value: 3,suit:'diamonds'},{value: 2,suit:'hearts'}])
  })
})
describe('Funcions per a resoldre empats',function(){
  it('sameScoreResolver: Resoldre empat per la carta alta de les mans dels jugadors', function(){
    expect(sameScoreResolver([{id:1,cards:[{value: 2,suit:'hearts'},{value: 12,suit:'hearts'}],},
    {id:2,cards:[{value: 12,suit:'diamonds'},{value: 11,suit:'hearts'}],}])).toBe(2)
  });
})
/* eslint-enable */
