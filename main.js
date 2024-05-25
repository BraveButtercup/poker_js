const CONTAINER = document.querySelector(".js-container");
const BUTTON = document.querySelector(".js-btn");
const chipContainer = document.querySelector(".js-chip-count-container")
const potContainer = document.querySelector(".js-pot-container")

//program state

let deckID = null;
let playerCards = [];
let playerChips = 100;
let computerChips = 100;
let pot = 0;


function renderPlayerCards() {

    let html = "";
    for (let card of playerCards) {
        html += `<img src="${card.image}" alt="${card.code}"/>`;
    }
    CONTAINER.innerHTML = html;
}
function renderChips() {
    chipContainer.innerHTML = `
    <div class="js-chip-count-container"> Player: ${playerChips}</div>
    <div class="js-chip-count-container"> Computer:  ${computerChips}</div>
    `
}
function renderPot() {
    potContainer.innerHTML = `
    <div class="js-pot-container"> Pot: ${pot}</div>
    `
}
function render() {
    renderPlayerCards();
    renderChips();
    renderPot();
}
async function drawAndRenderPlayerCards() {
    if (deckID == null) return;
    try {
        let response = await fetch(`https://www.deckofcardsapi.com/api/deck/${deckID}/draw/?count=2`);
        let data = await response.json();

        playerCards = data.cards;
        render();
    } catch (error) {
        console.error('Error drawing and rendering player cards:', error);
    }

}
function startGame() {

    fetch(`https://www.deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1`)
        .then(r => r.json())
        .then(feldolgoz => {
            deckID = feldolgoz.deck_id;
            drawAndRenderPlayerCards();

        })
};


BUTTON.addEventListener('click', startGame);