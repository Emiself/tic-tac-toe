document.addEventListener('DOMContentLoaded', function () {
  let cells = ['', '', '', '', '', '', '', '', ''];
  let currentPlayer = 'X';
  let result = document.querySelector('.result');
  let btns = document.querySelectorAll('.btn');
  let resetButton = document.querySelector('#reset');
  let conditions = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  let scoreX = 0;
  let scoreO = 0;
  let scoreTie = 0;
  let scoreXElement = document.getElementById('score-x');
  let scoreOElement = document.getElementById('score-o');
  let scoreTieElement = document.getElementById('score-tie');

  const updateScoreboard = () => {
    scoreXElement.innerText = scoreX > 0 ? scoreX : '';
    scoreOElement.innerText = scoreO > 0 ? scoreO : '';
    scoreTieElement.innerText = scoreTie > 0 ? scoreTie : '';
  };

  const ticTacToe = (element, index) => {
    element.value = currentPlayer;
    element.disabled = true;
    element.classList.remove('fade-in');
    void element.offsetWidth;
    element.classList.add('fade-in');
    cells[index] = currentPlayer;
    result.innerHTML = `Player ${currentPlayer} Turn`;

    for (let i = 0; i < conditions.length; i++) {
      let condition = conditions[i];
      let a = cells[condition[0]];
      let b = cells[condition[1]];
      let c = cells[condition[2]];

      if (a === '' || b === '' || c === '') {
        continue;
      }

      if (a === b && b === c) {
        if (a === 'X') {
          result.innerHTML = 'You Win 🥳!';
          condition.forEach((index) => btns[index].classList.add('win-line-x'));
        } else if (a === 'O') {
          result.innerHTML = 'You lose 😭!';
          condition.forEach((index) => btns[index].classList.add('win-line-o'));
        }
        btns.forEach((btn) => (btn.disabled = true));
        setTimeout(() => {
          resetButton.style.display = 'block';
        }, 2000);

        if (currentPlayer === 'X') {
          scoreX++;
        } else {
          scoreO++;
        }
        updateScoreboard();
        return;
      }
    }

    if (!cells.includes('')) {
      result.innerHTML = "It's a Draw 😐!";
      setTimeout(() => {
        resetButton.style.display = 'block';
      }, 2000);

      scoreTie++;
      updateScoreboard();
      return;
    }

    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    result.innerHTML = `Player ${currentPlayer} Turn`;

    let availableMoves = cells.reduce((acc, curr, index) => {
      if (curr === '') acc.push(index);
      return acc;
    }, []);

    if (availableMoves.length > 0 && currentPlayer === 'O') {
      let computerMove = getComputerMove(cells, currentPlayer);
      cells[computerMove] = currentPlayer;
      setTimeout(() => {
        btns[computerMove].value = currentPlayer;
        btns[computerMove].disabled = true;
        ticTacToe(btns[computerMove], computerMove);
      }, 1000);
    }
  };

  function reset() {
    cells = ['', '', '', '', '', '', '', '', ''];
    btns.forEach((btn) => {
      btn.value = '';
      btn.classList.remove('win-line-x');
      btn.classList.remove('win-line-o');
      btn.classList.remove('fade-in');
      void btn.offsetWidth;
      btn.classList.add('fade-in');
    });
    currentPlayer = 'X';
    result.innerHTML = `Player X Turn`;
    btns.forEach((btn) => (btn.disabled = false));
    resetButton.style.display = 'none';
  }

  resetButton.style.display = 'none';
  resetButton.addEventListener('click', reset);

  btns.forEach((btn, i) => {
    btn.addEventListener('click', () => ticTacToe(btn, i));
  });

  function getComputerMove(cells, player) {
    // Check if computer can win
    for (let i = 0; i < conditions.length; i++) {
      let condition = conditions[i];
      let a = cells[condition[0]];
      let b = cells[condition[1]];
      let c = cells[condition[2]];
      if ((a === player && b === player && c === '') || (a === player && c === player && b === '') || (b === player && c === player && a === '')) {
        if (a === '') {
          return condition[0];
        } else if (b === '') {
          return condition[1];
        } else if (c === '') {
          return condition[2];
        }
      }
    }

    // Check if player can win and block them
    let opponent = player === 'X' ? 'O' : 'X';
    for (let i = 0; i < conditions.length; i++) {
      let condition = conditions[i];
      let a = cells[condition[0]];
      let b = cells[condition[1]];
      let c = cells[condition[2]];

      if ((a === opponent && b === opponent && c === '') || (a === opponent && c === opponent && b === '') || (b === opponent && c === opponent && a === '')) {
        if (a === '') {
          return condition[0];
        } else if (b === '') {
          return condition[1];
        } else if (c === '') {
          return condition[2];
        }
      }
    }

    // Choose a random available move
    let availableMoves = cells.reduce((acc, curr, index) => {
      if (curr === '') acc.push(index);
      return acc;
    }, []);

    // Find the best move to make it harder for the player
    let bestMove = -1;
    let bestScore = -Infinity;
    for (let i = 0; i < availableMoves.length; i++) {
      let move = availableMoves[i];
      cells[move] = player;
      let score = minimax(cells, opponent, false);
      cells[move] = '';
      if (score > bestScore) {
        bestScore = score;
        bestMove = move;
      }
    }

    return bestMove;
  }

  function minimax(cells, player, isMaximizing) {
    let result = checkWinner(cells);
    if (result !== null) {
      if (result === 'X') return -1;
      if (result === 'O') return 1;
      return 0; // Draw
    }

    if (isMaximizing) {
      let bestScore = -Infinity;
      for (let i = 0; i < cells.length; i++) {
        if (cells[i] === '') {
          cells[i] = player;
          let score = minimax(cells, player === 'X' ? 'O' : 'X', false);
          cells[i] = '';
          bestScore = Math.max(score, bestScore);
        }
      }
      return bestScore;
    } else {
      let bestScore = Infinity;
      for (let i = 0; i < cells.length; i++) {
        if (cells[i] === '') {
          cells[i] = player;
          let score = minimax(cells, player === 'X' ? 'O' : 'X', true);
          cells[i] = '';
          bestScore = Math.min(score, bestScore);
        }
      }
      return bestScore;
    }
  }

  function checkWinner(cells) {
    for (let i = 0; i < conditions.length; i++) {
      let [a, b, c] = conditions[i];
      if (cells[a] !== '' && cells[a] === cells[b] && cells[a] === cells[c]) {
        return cells[a];
      }
    }
    if (!cells.includes('')) return 'draw';
    return null;
  }
});
