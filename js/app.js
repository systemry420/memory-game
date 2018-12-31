// dceclare variables
let deck = document.querySelector(".deck");
let opened = [];
let matches = [];
let moves = document.querySelector('#moves');
let move, wrongMoves = 0;
let restart = document.querySelector("#restart");
let time = 0;
let duration = document.querySelector("#duration");
let play = document.querySelector('#play');
let modal = document.querySelector('.modal');
let stars = document.querySelectorAll('.stars li');
let s = 4;
let click = 0;
let x;

// restart game
restart.addEventListener('click', startGame);

deck.addEventListener('click', flip);

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


function startGame() {
    // reset variables
    clearInterval(x);
    click = time = move = wrongMoves = 0;
    matches = [];
    opened = [];
    s = 4;
    deck.innerHTML = "";
    moves.innerHTML = move;
    duration.innerHTML = 0;
    deck.style.opacity = '1';
    modal.style.display = 'none';
    stars.forEach(st => {
        st.style.color = '#000';
    });

    deck.addEventListener('click', flip);

    // shuffle and generate cards
    shuffle(cards);
    cards.forEach(function(card){
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

play.addEventListener('click', function(){
    startGame();
    modal.style.display = 'none';
});

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

function flip(e) {
    let element = e.target;
    ++click;
    let node = e.target.nodeName.toLowerCase();
    if(click == 1){
        x = setInterval(timer, 1000);
    }
    if(node == 'li'){
        moves.innerHTML = ++move;
        opened.push(element);
        element.classList.add('open', 'show');
        if(opened.length == 2){
            // check match
            if(checkMatch(opened)){
                opened[0].classList.add('match');
                opened[1].classList.add('match');
                matches.push(opened[0]);
                matches.push(opened[1]);
                opened = [];
            }
            else{
                wrongMoves+=2;
                if(wrongMoves == 16){
                    stars[s--].style.color = '#aaa';
                }
                else if(wrongMoves == 22){
                    stars[s--].style.color = '#aaa';
                }
                else if(wrongMoves == 26){
                    stars[s--].style.color = '#aaa';
                }
                else if(wrongMoves == 30){
                    stars[s--].style.color = '#aaa';
                }
                else if(wrongMoves == 34){
                    stars[s--].style.color = '#aaa';
                    gameOver();
                }
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
    if(matches.length == 16){
        gameOver();
    }
}

function checkMatch(arr) {
    if(arr[0].dataset.icon === arr[1].dataset.icon){
        return true;
    }
    return false;
}

function timer() {
    time++;
    duration.innerHTML = time;
}

function gameOver() {
    // show modal
    let mod = '';
    clearInterval(x);
    if(s >= 0 ){
        mod = `
        <i class="fa fa-rocket" style="color:green; font-size: 40px;"></i>
        <h3>Congratulations! You won!</h3>
        <p>Your time: <strong>${time}</strong> seconds</p>
        <p>With <strong>${move}</strong> moves and <strong>${++s}</strong> star(s).</p>`;
    }
    else if(s < 0){
        mod = `
        <i class="fa fa-rocket" style="color:red; font-size: 40px;"></i>
        <h3>Bad luck! You loose!</h3>
        <p>Your time: <strong>${time}</strong> seconds</p>
        <p>With <strong>${move}</strong> moves and <strong>${++s}</strong> star(s).</p>`;
    }
    let  modalBody = document.querySelector('#modal-body');
    modalBody.innerHTML = mod;
    deck.style.opacity = '0.6';
    modal.style.display = 'block';
    deck.removeEventListener('click', flip);
}