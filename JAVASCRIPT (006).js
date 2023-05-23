document.addEventListener('DOMContentLoaded', function () {
  let cells = ['', '', '', '', '', '', '', '', ''];
  let currentPlayer = 'O';
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

  let searchDepth = 5; // Increase this value for a more challenging AI

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
        if (a === 'O') {
          result.innerHTML = 'You Win 🥳!';
          condition.forEach((index) =>
            btns[index].classList.add('win-line-o')
          );
        } else if (a === 'X') {
          result.innerHTML = 'You lose 😭!';
          condition.forEach((index) =>
            btns[index].classList.add('win-line-x')
          );
        }
        btns.forEach((btn) => (btn.disabled = true));
        setTimeout(function () {
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
      setTimeout(function () {
        resetButton.style.display = 'block';
      }, 2000);

      scoreTie++;
      updateScoreboard();
      return;
    }

    currentPlayer = currentPlayer === 'O' ? 'X' : 'O';
    result.innerHTML = `Player ${currentPlayer} Turn`;

    if (currentPlayer === 'X') {
      let availableMoves = cells.reduce((acc, curr, index) => {
        if (curr === '') acc.push(index);
        return acc;
      }, []);

      if (availableMoves.length > 0) {
        // Updated AI strategy starts here
        let bestMove = getBestMove(cells, currentPlayer);
        let computerMove = bestMove.index;
        cells[computerMove] = currentPlayer;
        setTimeout(() => {
          btns[computerMove].value = currentPlayer;
          btns[computerMove].disabled = true;
          ticTacToe(btns[computerMove], computerMove);
        }, 1000);
      }
    }
  };

  function getBestMove(board, player) {
    let bestScore = player === 'X' ? -Infinity : Infinity;
    let bestMove;

    for (let i = 0; i < board.length; i++) {
      if (board[i] === '') {
        board[i] = player;

        let score = minimax(board, 0, false);

        board[i] = '';

        if ((player === 'X' && score > bestScore) || (player === 'O' && score < bestScore)) {
          bestScore = score;
          bestMove = i;
        }
      }
    }

    return { index: bestMove };
  }

  const scores = {
    X: 1,
    O: -1,
    tie: 0,
  };

  function minimax(board, depth, isMaximizing) {
    let result = checkWinner(board);
    if (result !== null) {
      return scores[result];
    }

    if (depth >= searchDepth) {
      return 0; // Modify the score calculation for intermediate nodes at the maximum search depth
    }

    if (isMaximizing) {
      let bestScore = -Infinity;
      for (let i = 0; i < board.length; i++) {
        if (board[i] === '') {
          board[i] = 'X';
          let score = minimax(board, depth + 1, false);
          board[i] = '';
          bestScore = Math.max(score, bestScore);
        }
      }
      return bestScore;
    } else {
      let bestScore = Infinity;
      for (let i = 0; i < board.length; i++) {
        if (board[i] === '') {
          board[i] = 'O';
          let score = minimax(board, depth + 1, true);
          board[i] = '';
          bestScore = Math.min(score, bestScore);
        }
      }
      return bestScore;
    }
  }

  function checkWinner(board) {
    for (let i = 0; i < conditions.length; i++) {
      let [a, b, c] = conditions[i];
      if (board[a] !== '' && board[a] === board[b] && board[a] === board[c]) {
        return board[a];
      }
    }

    if (!board.includes('')) {
      return 'tie';
    }

    return null;
  }

  function reset() {
    cells = ['', '', '', '', '', '', '', '', ''];
    btns.forEach((btn) => {
      btn.value = '';
      btn.classList.remove('win-line-o');
      btn.classList.remove('win-line-x');
      btn.classList.remove('fade-in');
      void btn.offsetWidth;
      btn.classList.add('fade-in');
    });
    currentPlayer = 'O';
    result.innerHTML = `Player O Turn`;
    btns.forEach((btn) => (btn.disabled = false));
    resetButton.style.display = 'none';
  }

  resetButton.style.display = 'none';

  resetButton.addEventListener('click', reset);

  btns.forEach((btn, i) => {
    btn.addEventListener('click', () => ticTacToe(btn, i));
  });

  for (let i = 0; i < conditions.length; i++) {
    const [a, b, c] = conditions[i].map((index) => cells[index]);

    if (a === b && b === c && a !== '') {
      btns.forEach((btn) => (btn.disabled = true));
      setTimeout(function () {
        resetButton.style.display = 'block';
      }, 2000);

      if (a === 'O') {
        result.innerHTML = 'You Win 🥳!';
        conditions[i].forEach((index) =>
          btns[index].classList.add('win-line-o')
        );
      } else if (a === 'X') {
        result.innerHTML = 'You lose 😭!';
        conditions[i].forEach((index) =>
          btns[index].classList.add('win-line-x')
        );
      }

      if (a === 'X') {
        scoreX++;
      } else {
        scoreO++;
      }
      updateScoreboard();

      break;
    } else if (!cells.includes('')) {
      result.innerHTML = "It's a Draw 😐!";
      setTimeout(function () {
        resetButton.style.display = 'block';
      }, 2000);

      scoreTie++;
      updateScoreboard();
    }
  }
});
