// Jugadors
class Player {
  constructor (obj) {
    obj.money = 1000
    obj.cards = []
    obj.playerDeal = 0
    obj.playerScore = {}
    obj && Object.assign(this, obj)
  }

  deal (ammount) {
    if (ammount === this.money) {
      this.money = 0
      this.playerState = 'AllIn'
      this.playerDeal += ammount
      return ammount
    } else if (ammount < this.money) {
      this.money -= ammount
      this.playerDeal += ammount
      return ammount
    }
  }

  resetDeal () {
    this.playerDeal = 0
  }
}
export { Player }
/* Attr player
cartes(array)
dealer(boolean)
diners(int)
estat(string)
nom_ma(string)
score(int)

Accions player
Passar
Apostar(Distingir entre muntar i all-in)
Anar-se'n
*/
