(function(){
    'use strict';
    // dceclare variables
    let deck = document.querySelector('.deck');
    let moves = document.querySelector('#moves');
    let restart = document.querySelector('#restart');
    let duration = document.querySelector('#duration');
    let play = document.querySelector('#play');
    let modal = document.querySelector('.modal');
    let stars = document.querySelectorAll('.stars li');
    let opened = [];    // keep track of opened cards
    let matches = [];       //keep track of matched cards
    let arrScores = [];     //array to hold scores
    let move, wrongMoves = 0;       //numebr of moves, and wrong moves
    let time = 0;
    let s = 4;      // control stars
    let click = 0;
    let x;
    let countdown;      //countdown feature

    // restart game
    restart.addEventListener('click', startGame);

    // listen to the whole .deck element
    deck.addEventListener('click', flip);

    /*
    * Create a list that holds all of your cards
    */

    let cards = [
        'fa-diamond', 'fa-diamond',
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
        // reset variables and style
        clearInterval(x);
        click = time = move = wrongMoves = 0;
        matches = [];
        opened = [];
        s = 4;
        deck.innerHTML = '';
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

        // show all cards for 5 seconds to let the user memorize :)
        let p = document.querySelector('.countdown span');
        p.parentNode.style.visibility = 'visible';
        let cd = document.querySelectorAll('.card');
        let a = 5;
        cd.forEach(c => {
            c.classList.add('show', 'open');
        });
        countdown = setInterval(() => {
            p.textContent = --a;
        }, 1000);
        setTimeout(() => {
            cd.forEach(c => {
                c.classList.remove('show', 'open');
            });
            clearInterval(countdown);
            p.parentNode.style.visibility = 'hidden';
        }, 5000);
    }

    function generatCards(card) {
        // set the data-icon attribute
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

    // play again button
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

        // get the clicked node
        let node = e.target.nodeName.toLowerCase();

        // if element being clicked is li(card)
        if(node == 'li'){
            // check if game is launched, and start a timer
            if(click == 1){
                x = setInterval(function () {
                    duration.innerHTML = ++time;
                }, 1000);
            }

            // track and increase move counter
            moves.innerHTML = ++move;

            // push every clicked element to opened array
            opened.push(element);
            element.classList.add('open', 'show');

            // only two cards to be checked
            if(opened.length == 2){

                // check match
                if(checkMatch(opened)){
                    // apply match class
                    opened[0].classList.add('match');
                    opened[1].classList.add('match');

                    // push the 2 matched cards
                    matches.push(opened[0]);
                    matches.push(opened[1]);
                    opened = [];
                }
                else{
                    // cards don't match
                    // the criteria of star rating
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
                    else if(wrongMoves == 28){
                        stars[s--].style.color = '#aaa';
                    }
                    else if(wrongMoves == 30){
                        stars[s--].style.color = '#aaa';
                        gameOver();
                    }
                    opened[0].classList.add('unmatch');
                    opened[1].classList.add('unmatch');

                    // close cards after 1 second
                    setTimeout(() => {
                        opened[0].classList.remove('open', 'show', 'unmatch');
                        opened[1].classList.remove('open', 'show', 'unmatch');
                        opened = [];
                    }, 1000);
                }
            }
        }

        // if there are 16-matched cards, the game is over
        if(matches.length == 16){
            gameOver();
        }
    }

    function checkMatch(arr) {
        // check the two opened cards using data-icon attribute
        if(arr[0].dataset.icon === arr[1].dataset.icon){
            return true;
        }
        return false;
    }

    function gameOver() {
        // show modal containing data about the game, and any previous high scores
        let mod = '';
        clearInterval(x);
        if(s >= 0 ){
            mod = `
                <i class="fa fa-rocket" style="color:green; font-size: 40px;"></i>
                <h3>Congratulations! You won!</h3>`;

            // only save the score if it has 3+ stars
            if(s >= 3)
                saveScores(time, move, s);
        }
        else if(s < 0){
            // if no stars remained, then you lost
            mod = `
                <i class="fa fa-rocket" style="color:red; font-size: 40px;"></i>
                <h3>Bad luck! You lose all stars!</h3>`;
        }

        mod += `<p>Your time: <strong>${time}</strong> seconds</p>
        <p>With <strong>${move}</strong> moves and <strong>${++s}</strong> star(s).</p>`;

        // fetch latest 3 high saved scores
        if(JSON.parse(localStorage.getItem('scores') != null)){
            mod += '<hr><h3>Recent Highest Scores</h3>';
            let arr = JSON.parse(localStorage.getItem('scores'));
            for (let i = 0; i < arr.length; i++) {
                if(i == 3)
                    break;
                const a = arr.pop();
                mod += `<p>Stars: ${a.star} - Moves: ${a.move} - Time: ${a.time} </p>`;
            };
        }

        let  modalBody = document.querySelector('#modal-body');
        modalBody.innerHTML = mod;
        deck.style.opacity = '0.6';
        modal.style.display = 'block';
        deck.removeEventListener('click', flip);
    }

    function saveScores(t, m, s){
        // save score as an object
        let score = {
            time: t,
            move: m,
            star: s
        };

        // test if scores is already set
        if(localStorage.getItem('scores') === null){
            arrScores = [];
            arrScores.push(score);
            localStorage.setItem('scores', JSON.stringify(arrScores));
        }
        else{
            // fetch any found scores, push the current score, and re-store the array
            try{
                let res = localStorage.getItem('scores');
                arrScores = JSON.parse(res);
            } catch (error){
                alert(error);
            }

            arrScores.push(score);
            localStorage.setItem('scores', JSON.stringify(arrScores));
        }
    }
})();