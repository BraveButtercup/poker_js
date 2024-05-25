const CONTAINER = document.querySelector(".js-container");
const BUTTON = document.querySelector(".js-btn");


/* const lapok = function fetchLapok() {
    fetch(`https://www.deckofcardsapi.com/api/deck/1fr3jasjwh6r/draw/?count=2`)
        .then(r => r.json())
        .then(feldolgoz)
};

function feldolgoz(response) {
    return response.cards
};


 */
//program state

let deckID = null;
let playerCards = [];
let playerChips = 100;
let computerChips = 100;
let pot = 0;




function render() {
    let html = "";
    for (let card of playerCards) {
        html += `<img src="${card.image}" alt="${card.code}"/>`;
    }
    CONTAINER.innerHTML = html;
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