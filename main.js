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
    playerBetPlaced,
    deckID,
    playerCards,
    playerChips,
    computerChips,
    computerCards,
    pot,

} = getInitialState();

function getInitialState() {

    return {
        playerBetPlaced: false,
        deckID: null,
        computerCards: [],
        playerCards: [],
        playerChips: 100,
        computerChips: 100,
        pot: 0,
    }
}
function initializeGame() {

    ({ playerChips, computerChips, pot } = getInitialState());
    betSlider.value = 0;
}
function canBet() {
    return playerCards.length === 2 && playerChips > 0 && playerBetPlaced == false;

}

function renderSlider() {

    if (canBet()) {
        betArea.classList.remove("invisible");
        betSlider.setAttribute("max", playerChips);
        betSliderValue.innerText = betSlider.value;
    } else {
        betArea.classList.add("invisible");
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
function postBlinds() {
    playerChips -= 1;
    computerChips -= 2;
    pot += 3;
    render();
}
function startHand() {
    postBlinds();
    fetch(`https://www.deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1`)
        .then(r => r.json())
        .then(feldolgoz => {
            deckID = feldolgoz.deck_id;
            drawAndRenderPlayerCards();

        })
}
function startGame() {
    initializeGame();
    startHand();

};

function shouldComputerCall() {
    if (computerCards.length !== 2)
        return false;
    const card1Code = computerCards[0].code;
    const card2Code = computerCards[1].code;
    const card1Value = card1Code[0];
    const card2Value = card2Code[1];
    const card1Suit = card1Code[1];
    const card2Suit = card2Code[1];

    return card1Value === card2Value ||
        ['0', 'J', 'Q', 'K', 'A'].includes(card1Value) ||
        ['0', 'J', 'Q', 'K', 'A'].includes(card2Value) ||
        (
            card1Suit === card2Suit &&
            Math.abs(Number(card1Value) - Number(card2Value)) <= 2
        );
}

function computerMoveAfterBet() {
    fetch(`https://www.deckofcardsapi.com/api/deck/${deckID}/draw/?count=2`)
        .then(response => response.json())
        .then(function (response) {
            computerCards = response.cards;
            alert(shouldComputerCall() ? 'Call' : 'Fold');
            console.log(computerCards);
        });
    //render();
}

function performBet() {

    const betValue = Number.parseInt(betSlider.value);
    pot += betValue;
    playerChips -= betValue;
    playerBetPlaced = true;
    render();
    computerMoveAfterBet();
}

BUTTON.addEventListener('click', startGame);
betSlider.addEventListener('change', render);
betButton.addEventListener('click', performBet);
initializeGame();
render();