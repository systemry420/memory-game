// dceclare variables
let deck = document.querySelector(".deck");
let opened = [];
let matches = 0;
let moves = document.querySelector('#moves');
let move = 0;
/*
 * Create a list that holds all of your cards
 */

let cards = ['fa-diamond', 'fa-diamond',
             'fa-paper-plane-o', 'fa-paper-plane-o',
             'fa-anchor', 'fa-anchor',
             'fa-bolt', 'fa-bolt',
             'fa-cube', 'fa-cube',
             'fa-leaf', 'fa-leaf',
             'fa-bicycle', 'fa-bicycle',
             'fa-bomb', 'fa-bomb'
            ];

/*
* Display the cards on the page
*   - shuffle the list of cards using the provided "shuffle" method below
*   - loop through each card and create its HTML
*   - add each card's HTML to the page
*/

shuffle(cards);

function startGame() {
    let grid = cards.map(function(card){
        return generatCards(card);
    });
}

function generatCards(card) {
    let att = card.slice(3);
    let cardTemp = `<li class="card" data-icon="${att}"><i class="fa ${card}"></i></li>`;
    deck.innerHTML += cardTemp;
}

startGame();

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}


/*
 * set up the event listener for a card. If a card is clicked:
 *  - display the card's symbol (put this functionality in another function that you call from this one)
 *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
 *  - if the list already has another card, check to see if the two cards match
 *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
 *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
 *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
 *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
 */
deck.addEventListener('click', flip);

function flip(e) {
    let element = e.target;
    let node = e.target.nodeName.toLowerCase();
    if(node == 'li'){
        moves.innerHTML = move++;
        opened.push(element);
        element.classList.add('open', 'show');
        if(opened.length == 2){
            // check match
            if(checkMatch(opened)){
                // TODO: pop
                opened[0].classList.add('match');
                opened[1].classList.add('match');
                opened = [];
                matches++;
            }
            else{
                // TODO: shake
                opened[0].classList.add('unmatch');
                opened[1].classList.add('unmatch');
                setTimeout(() => {
                    opened[0].classList.remove('open', 'show', 'unmatch');
                    opened[1].classList.remove('open', 'show', 'unmatch');
                    opened = [];
                }, 1000);
            }
        }
    }
    if(matches == 6){
        alert("finish")
    }
}

function checkMatch(arr) {
    if(arr[0].dataset.icon === arr[1].dataset.icon){
        return true;
    }
    return false;
}