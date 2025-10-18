(function () {
    // --- Data ---
    var emojiPools = {
        "Animals 🐾": ["🐶", "🐱", "🐭", "🐹", "🐰", "🦊", "🐻", "🐼", "🦁", "🐮", "🐷", "🐸", "🐵", "🐔", "🦄", "🐨", "🐯", "🐨"],
        "Faces 😀": ["😀", "😁", "😂", "🤣", "😊", "😎", "😍", "🤩", "🤔", "😴", "😅", "🙃", "😇", "😬", "🤪", "🤗", "🤓", "🤤"],
        "Plants 🌿": ["🌱", "🌿", "🍀", "🌵", "🎍", "🌴", "🌳", "🌺", "🌻", "🌷", "🌹", "🌸", "🍁", "🍂", "🍃", "🪴", "🌾", "🌼"],
        "Food 🍔": ["🍎", "🍊", "🍌", "🍉", "🍇", "🍓", "🍒", "🍍", "🥑", "🍔", "🍟", "🍕", "🌭", "🥪", "🍣", "🍩", "🍪", "🧁"]
    };

    var triviaPools = {
        "Science 🔬": [
            { q: "What planet is known as the Red Planet?", a: "Mars" },
            { q: "H2O is the chemical formula for what?", a: "Water" },
            { q: "What gas do plants breathe in?", a: "Carbon Dioxide" },
            { q: "What organ pumps blood?", a: "Heart" },
            { q: "Light speed approx in vacuum (km/s)?", a: "300000" },
            { q: "What force keeps us on Earth?", a: "Gravity" },
            { q: "Basic unit of life?", a: "Cell" },
            { q: "Tool to look at stars", a: "Telescope" },
            { q: "What does DNA stand for?", a: "Deoxyribonucleic Acid" },
            { q: "Particles smaller than protons?", a: "Quarks" }
        ],
        "Math ➕": [
            { q: "5 + 7 = ?", a: "12" },
            { q: "Square root of 81?", a: "9" },
            { q: "10 * 10 = ?", a: "100" },
            { q: "12 / 3 = ?", a: "4" },
            { q: "2^5 = ?", a: "32" },
            { q: "7 + 6 = ?", a: "13" },
            { q: "What is π (approx)?", a: "3.14" },
            { q: "Factorial 4 (4!) = ?", a: "24" },
            { q: "What is 0 * 5 ?", a: "0" },
            { q: "How many sides triangle has?", a: "3" }
        ],
        "Geography 🌍": [
            { q: "Capital of France?", a: "Paris" },
            { q: "Largest ocean?", a: "Pacific" },
            { q: "Mount Everest is in which range?", a: "Himalayas" },
            { q: "Capital of Japan?", a: "Tokyo" },
            { q: "The Nile primarily flows through which continent?", a: "Africa" },
            { q: "Country with Great Barrier Reef?", a: "Australia" },
            { q: "City: Big Apple?", a: "New York" },
            { q: "Longest river? (contested)", a: "Nile" },
            { q: "Capital of India?", a: "New Delhi" },
            { q: "Which continent is Argentina in?", a: "South America" }
        ],
        "History 🏺": [
            { q: "Year WW2 ended?", a: "1945" },
            { q: "Who discovered America (commonly)?", a: "Columbus" },
            { q: "Ancient writing system of Egypt?", a: "Hieroglyphs" },
            { q: "US Declaration year?", a: "1776" },
            { q: "Who led India to independence?", a: "Gandhi" },
            { q: "First man on moon?", a: "Neil Armstrong" },
            { q: "Revolution in Russia year?", a: "1917" },
            { q: "Wall in Germany that fell (year)?", a: "1989" },
            { q: "Roman Empire capital?", a: "Rome" },
            { q: "Who was Cleopatra?", a: "Egyptian queen" }
        ]
    };

    var levelSettings = {
        easy: { cols: 2, rows: 2, pairs: 2, time: 60 },
        medium: { cols: 4, rows: 4, pairs: 8, time: 120 },
        hard: { cols: 6, rows: 6, pairs: 18, time: 240 }
    };

    // --- DOM ---
    var board = document.getElementById('board');
    var timerEl = document.getElementById('timer');
    var scoreEl = document.getElementById('score');
    var movesEl = document.getElementById('moves');
    var twoplayerPanel = document.getElementById('twoplayer-panel');
    var scoreSingleBox = document.getElementById('score-single');
    var p1ScoreEl = document.getElementById('p1-score');
    var p2ScoreEl = document.getElementById('p2-score');
    var turnIndicator = document.getElementById('turn-indicator');
    var subInfo = document.getElementById('sub-info');
    var resultModal = document.getElementById('result-modal');
    var resultTitle = document.getElementById('result-title');
    var resultText = document.getElementById('result-text');
    var playAgainBtn = document.getElementById('play-again');
    var dashboardBtn = document.getElementById('go-dashboard');
    var notif = document.getElementById('notif');
    var p1RevealBtn = document.getElementById('p1-reveal');
    var p2RevealBtn = document.getElementById('p2-reveal');
    var p1FreezeBtn = document.getElementById('p1-freeze');
    var p2FreezeBtn = document.getElementById('p2-freeze');

    // --- State ---
    var user = JSON.parse(localStorage.getItem('memoryUser') || 'null');
    var selectedMode = localStorage.getItem('selectedMode') || 'single';
    var selectedDifficulty = localStorage.getItem('selectedDifficulty') || 'medium';
    var selectedTheme = localStorage.getItem('selectedTheme') || 'emoji';
    var selectedCategory = localStorage.getItem('selectedCategory') || '';

    var state = {
        cards: [],
        flipped: [],
        matchedCount: 0,
        totalPairs: 0,
        timeLeft: 0,
        timerId: null,
        busy: false,
        currentPlayer: 1,
        scores: { 1: 0, 2: 0 },
        moves: { 1: 0, 2: 0, single: 0 },
        frozenUntil: 0,
        usedPowerup: { p1Reveal: false, p2Reveal: false, p1Freeze: false, p2Freeze: false }
    };

    if (!user) {
        window.location.href = "../pages/register.html";
        return;
    }

    // --- Helpers ---
    function shuffle(arr) {
        for (var i = arr.length - 1; i > 0; i--) {
            var j = Math.floor(Math.random() * (i + 1));
            var tmp = arr[i];
            arr[i] = arr[j];
            arr[j] = tmp;
        }
        return arr;
    }

    function showNotif(text, timeout) {
        if (!timeout) timeout = 1600;
        notif.textContent = text;
        notif.classList.remove('hidden');
        setTimeout(function () { notif.classList.add('hidden'); }, timeout);
    }

    function formatTime(s) {
        var mm = Math.floor(s / 60);
        var ss = s % 60;
        if (mm < 10) mm = '0' + mm;
        if (ss < 10) ss = '0' + ss;
        return mm + ":" + ss;
    }

    // --- Build Deck ---
    function buildDeck() {
        var lvl = levelSettings[selectedDifficulty] || levelSettings.medium;
        state.totalPairs = lvl.pairs;
        state.timeLeft = lvl.time;
        state.matchedCount = 0;
        state.flipped = [];
        state.cards = [];

        var pool = [];
        if (selectedTheme == 'emoji') {
            if (selectedCategory && emojiPools[selectedCategory]) pool = emojiPools[selectedCategory].slice();
            else {
                for (var k in emojiPools) { pool = pool.concat(emojiPools[k]); }
            }
            pool = shuffle(pool).slice(0, lvl.pairs);
            for (var i = 0; i < pool.length; i++) {
                state.cards.push({ id: 'e-' + i + 'a', pair: i, value: pool[i], type: 'emoji' });
                state.cards.push({ id: 'e-' + i + 'b', pair: i, value: pool[i], type: 'emoji' });
            }
            state.cards = shuffle(state.cards);
        } else {
            if (selectedCategory && triviaPools[selectedCategory]) pool = triviaPools[selectedCategory].slice();
            else {
                for (var k in triviaPools) { pool = pool.concat(triviaPools[k]); }
            }
            pool = shuffle(pool).slice(0, lvl.pairs);
            for (var i = 0; i < pool.length; i++) {
                state.cards.push({ id: 't-' + i + 'q', pair: i, value: pool[i].q, side: 'q', type: 'trivia' });
                state.cards.push({ id: 't-' + i + 'a', pair: i, value: pool[i].a, side: 'a', type: 'trivia' });
            }
            state.cards = shuffle(state.cards);
        }
    }

    // --- Render Board ---
    function renderBoard() {
        var lvl = levelSettings[selectedDifficulty] || levelSettings.medium;
        board.className = 'board';
        if (lvl.cols == 2) board.classList.add('size-2');
        else if (lvl.cols == 4) board.classList.add('size-4');
        else board.classList.add('size-6');

        board.innerHTML = '';
        for (var i = 0; i < state.cards.length; i++) {
            var c = state.cards[i];
            var el = document.createElement('div');
            el.className = 'card';
            el.dataset.index = i;
            if (c.side) el.dataset.side = c.side;
            el.innerHTML = '<div class="card-inner"><div class="front">?</div><div class="back">' + c.value + '</div></div>';
            el.onclick = function () { clickCard(this); };
            board.appendChild(el);
        }
    }

    function clickCard(card) {
        if (state.busy) return;
        if (state.flipped.indexOf(card) >= 0) return;
        if (card.classList.contains('matched')) return;
        if (Date.now() < state.frozenUntil) { showNotif("Board frozen!"); return; }

        card.classList.add('flipped');
        state.flipped.push(card);

        if (state.flipped.length == 2) checkMatch();
    }

    function checkMatch() {
        state.busy = true;
        var a = state.flipped[0];
        var b = state.flipped[1];
        var ca = state.cards[a.dataset.index];
        var cb = state.cards[b.dataset.index];

        var match = false;
        if (ca.pair == cb.pair) {
            if (ca.type == 'trivia') match = (ca.side != cb.side);
            else match = true;
        }

        if (selectedMode == 'multi') state.moves[state.currentPlayer] += 1;
        else state.moves.single += 1;
        updateScoreAndMovesUI();

        if (match) {
            setTimeout(function () {
                a.classList.add('matched');
                b.classList.add('matched');
                state.matchedCount += 1;
                if (selectedMode == 'multi') state.scores[state.currentPlayer] += 10;
                else state.scores[1] += 10;
                state.flipped = [];
                state.busy = false;
                updateScoreAndMovesUI();
                if (state.matchedCount >= state.totalPairs) endGame(true);
                else showNotif("Nice! Match found.");
            }, 450);
        } else {
            setTimeout(function () {
                a.classList.remove('flipped');
                b.classList.remove('flipped');
                state.flipped = [];
                state.busy = false;
                if (selectedMode == 'multi') {
                    state.currentPlayer = (state.currentPlayer == 1 ? 2 : 1);
                    updateTurnUI();
                }
            }, 700);
        }
    }

    // --- Timer ---
    function startTimer() {
        clearInterval(state.timerId);
        updateTimerUI();
        state.timerId = setInterval(function () {
            state.timeLeft -= 1;
            updateTimerUI();
            if (state.timeLeft <= 0) {
                clearInterval(state.timerId);
                endGame(false);
            }
        }, 1000);
    }

    function updateTimerUI() { timerEl.textContent = formatTime(Math.max(0, state.timeLeft)); }

    function updateScoreAndMovesUI() {
        if (selectedMode == 'multi') {
            p1ScoreEl.textContent = 'P1: ' + state.scores[1] + ' pts (' + (state.moves[1] || 0) + ' moves)';
            p2ScoreEl.textContent = 'P2: ' + state.scores[2] + ' pts (' + (state.moves[2] || 0) + ' moves)';
            scoreSingleBox.classList.add('hidden'); twoplayerPanel.classList.remove('hidden');
        } else {
            scoreSingleBox.classList.remove('hidden'); twoplayerPanel.classList.add('hidden');
            scoreEl.textContent = state.scores[1] || 0;
            movesEl.textContent = state.moves.single || 0;
        }
    }

    function updateTurnUI() {
        turnIndicator.textContent = 'Turn: Player ' + state.currentPlayer;
        var p1 = document.getElementById('player1-card');
        var p2 = document.getElementById('player2-card');
        if (p1) p1.style.opacity = state.currentPlayer == 1 ? '1' : '0.6';
        if (p2) p2.style.opacity = state.currentPlayer == 2 ? '1' : '0.6';
    }

    // --- End Game ---
    function endGame(win) {
        clearInterval(state.timerId);
        var title = ''; var text = '';
        if (selectedMode == 'multi') {
            var p1 = state.scores[1] || 0; var p2 = state.scores[2] || 0;
            if (!win && state.timeLeft <= 0 && state.matchedCount < state.totalPairs) {
                if (p1 == p2) { title = "Time's Up — It's a Tie!"; text = "Both tied " + p1; }
                else if (p1 > p2) { title = "Player 1 Wins!"; text = "P1 " + p1 + " — P2 " + p2; }
                else { title = "Player 2 Wins!"; text = "P2 " + p2 + " — P1 " + p1; }
            } else {
                if (p1 == p2) { title = "Tie!"; text = "Both " + p1; }
                else if (p1 > p2) { title = "Congrats P1!"; text = "P1 " + p1 + " — P2 " + p2; }
                else { title = "Congrats P2!"; text = "P2 " + p2 + " — P1 " + p1; }
            }
        } else {
            if (win) { title = "Congrats!"; text = "All pairs matched " + state.moves.single + " moves, " + state.scores[1] + " pts"; }
            else { title = "Game Over"; text = "Time up, matched " + state.matchedCount + "/" + state.totalPairs; }
        }
        resultTitle.textContent = title; resultText.textContent = text;
        resultModal.classList.remove('hidden'); resultModal.classList.add('show');
    }

    // --- Powerups ---
    function revealAll(temp) {
        if (!temp) temp = 2500;
        if (state.busy) return;
        state.busy = true;
        var cards = board.getElementsByClassName('card');
        for (var i = 0; i < cards.length; i++) {
            if (!cards[i].classList.contains('matched')) cards[i].classList.add('flipped');
        }
        setTimeout(function () {
            for (var i = 0; i < cards.length; i++) {
                cards[i].classList.remove('flipped');
            }
            state.busy = false;
        }, temp);
    }

    function freezeOpponent(dur) {
        if (!dur) dur = 6000;
        state.frozenUntil = Date.now() + dur;
        showNotif("Board frozen for " + Math.ceil(dur / 1000) + "s");
    }

    if (p1RevealBtn) p1RevealBtn.onclick = function () { if (!state.usedPowerup.p1Reveal) { revealAll(3000); state.usedPowerup.p1Reveal = true; p1RevealBtn.disabled = true; } };
    if (p2RevealBtn) p2RevealBtn.onclick = function () { if (!state.usedPowerup.p2Reveal) { revealAll(3000); state.usedPowerup.p2Reveal = true; p2RevealBtn.disabled = true; } };
    if (p1FreezeBtn) p1FreezeBtn.onclick = function () { if (!state.usedPowerup.p1Freeze) { freezeOpponent(6000); state.usedPowerup.p1Freeze = true; p1FreezeBtn.disabled = true; } };
    if (p2FreezeBtn) p2FreezeBtn.onclick = function () { if (!state.usedPowerup.p2Freeze) { freezeOpponent(6000); state.usedPowerup.p2Freeze = true; p2FreezeBtn.disabled = true; } };

    // --- Init ---
    function initGame() {
        state.flipped = []; state.matchedCount = 0; state.timerId = null; state.busy = false;
        state.currentPlayer = 1; state.scores = { 1: 0, 2: 0 }; state.moves = { 1: 0, 2: 0, single: 0 }; state.frozenUntil = 0;
        state.usedPowerup = { p1Reveal: false, p2Reveal: false, p1Freeze: false, p2Freeze: false };

        subInfo.textContent = (selectedMode == 'multi' ? 'Two Player' : 'Single Player') + ' • ' + selectedDifficulty.toUpperCase() + ' • ' + selectedTheme + (selectedCategory ? ' • ' + selectedCategory : '');
        buildDeck();
        renderBoard();
        updateScoreAndMovesUI();
        updateTurnUI();
        startTimer();

        if (p1RevealBtn) p1RevealBtn.disabled = false;
        if (p2RevealBtn) p2RevealBtn.disabled = false;
        if (p1FreezeBtn) p1FreezeBtn.disabled = false;
        if (p2FreezeBtn) p2FreezeBtn.disabled = false;

        resultModal.classList.remove('show'); resultModal.classList.add('hidden');
    }

    playAgainBtn.onclick = function () { resultModal.classList.remove('show'); resultModal.classList.add('hidden'); initGame(); };
    dashboardBtn.onclick = function () { window.location.href = "../pages/dashboard.html"; };

    initGame();
})();
