function fetchLapok() {
    fetch(`https://www.deckofcardsapi.com/api/deck/1fr3jasjwh6r/draw/?count=2`)
        .then(r => r.json())
        .then(feldolgoz)
};

function feldolgoz(response) {
    console.log("lapok", response)
};

fetchLapok();