const getBoardTemplate = () => {
  const template = `<div class='gameContainer'>
      <div class="player p1">
        <div class="cartes" id="cards-p1"></div>
        <div class="container-info inf1">
          <div class="money">0 Pulas</div>
          <div class="isDealer"></div>
          <div class="deal"></div>
        </div>
      </div>
      <div class="player p2">
        <div class="cartes" id="cards-p2"></div>
        <div class="container-info inf2" id="info-p2">
          <div class="money">0 Pulas</div>
          <div class="isDealer"></div>
          <div class="deal"></div>
        </div>
      </div>
      <div class="mesa"></div>
      <div class="player p3">
        <div class="cartes" id="cards-p3"></div>
        <div class="container-info inf3" id="info-p3">
          <div class="money">0 Pulas</div>
          <div class="isDealer"></div>
          <div class="deal"></div>
        </div>
      </div>
      <div class="player p4">
        <div class="cartes" id="cards-p4"></div>
        <div class="container-info inf4" id="info-p4">
          <div class="money">0 Pulas</div>
          <div class="isDealer"></div>
          <div class="deal"></div>
        </div>
      </div>
      <div class="playerActions">
          <div class="row">
            <input type="range" id="dealRange" />
            <input type="number" name="" id="dealValue" />
          </div>
          <div class="row">
            <button type="button" id="dealBtn">Deal</button>
            <button type="button" id="passBtn">Check</button>
          </div>
          <div class="row">
            <button type="button" id="outBtn">Out</button>
            <button type="button" id="homeBtn">Home</button>
          </div>
      </div>
    </div>
  `

  const wrapper = document.createElement('div')
  wrapper.innerHTML = template
  return wrapper.childNodes.values()
}
export { getBoardTemplate }
