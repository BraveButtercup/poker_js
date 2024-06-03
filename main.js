const CONTAINER = document.querySelector(".js-container");
const BUTTON = document.querySelector(".js-new-game-btn");
const chipContainer = document.querySelector(".js-chip-count-container");
const potContainer = document.querySelector(".js-pot-container");
const betArea = document.querySelector(".js-bet-area");
const betSlider = document.querySelector("#bet-amount");
const betSliderValue = document.querySelector(".js-slider-value");
const betButton = document.querySelector(".js-bet-button")

//program state

// let deckID = null;
// let playerCards = [];
// let playerChips = 100;
// let computerChips = 100;
// let pot = 0;

let {
    deckID,
    playerCards,
    playerChips,
    computerChips,
    pot
} = getInitialState();

function getInitialState() {
    debugger;
    return {
        deckID: null,
        playerCards: [],
        playerChips: 100,
        computerChips: 100,
        pot: 0,
    };
}

function canBet() {
    return playerCards.length === 2 && playerChips > 0 && pot === 0;

}

function renderSlider() {
    debugger;
    if (canBet()) {
        betArea.classList.remove(".invisible");
        betSlider.setAttribute("max", playerChips);
        betSliderValue.innerText = betSlider.value;
    } else {
        betArea.classList.add(".invisible");
    }
}

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
    debugger;
    renderPlayerCards();
    renderChips();
    renderPot();
    renderSlider();
};

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

};

function startGame() {

    fetch(`https://www.deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1`)
        .then(r => r.json())
        .then(feldolgoz => {
            deckID = feldolgoz.deck_id;
            drawAndRenderPlayerCards();

        })
};

function performBet() {
    debugger;
    const betValue = betSliderValue;
    pot += betValue;
    playerChips -= betValue;
    render();
}

BUTTON.addEventListener('click', startGame);
betSlider.addEventListener('change', render);
betButton.addEventListener('click', performBet);
getInitialState();
render();