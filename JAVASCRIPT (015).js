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
  element.classList.remove('fade-in'); // Remove the fade-in animation class
  void element.offsetWidth; // Trigger reflow to remove the animation immediately
    element.classList.add('fade-in'); // Add the fade-in animation class
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
          condition.forEach((index) =>
            btns[index].classList.add('win-line-x')
          );
        } else if (a === 'O') {
          result.innerHTML = 'You lose 😭!';
          condition.forEach((index) =>
            btns[index].classList.add('win-line-o')
          );
        }
        btns.forEach((btn) => (btn.disabled = true));
      setTimeout(function () {
        resetButton.style.display = 'block'; // Show the reset button after 2 seconds
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
        resetButton.style.display = 'block'; // Show the reset button after 2 seconds
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
      let computerMove;
      if (availableMoves.length === 9) {
        computerMove = Math.floor(Math.random() * availableMoves.length);
      } else {
        computerMove = findBestMove();
      }
      
      cells[computerMove] = currentPlayer;
      setTimeout(() => {
        btns[computerMove].value = currentPlayer;
        btns[computerMove].disabled = true;
        ticTacToe(btns[computerMove], computerMove);
      }, 1000); // Delay the O appearance by 1 second (1000 milliseconds)
    }
  };

  function reset() {
    cells = ['', '', '', '', '', '', '', '', ''];
    btns.forEach((btn) => {
      btn.value = '';
      btn.classList.remove('win-line-x');
      btn.classList.remove('win-line-o');
    btn.classList.remove('fade-in'); // Remove the fade-in class
    void btn.offsetWidth; // Trigger reflow to remove the animation immediately
    btn.classList.add('fade-in'); // Add the fade-in animation class
    });
    currentPlayer = 'X';
    result.innerHTML = `Player X Turn`;
    btns.forEach((btn) => (btn.disabled = false));
    resetButton.style.display = 'none'; // Hide the reset button
  }

  // Hide the reset button on page load
 
  resetButton.style.display = 'none'; // Hide the reset button on page load

  resetButton.addEventListener('click', reset);

  btns.forEach((btn, i) => {
    btn.addEventListener('click', () => ticTacToe(btn, i));
  });

  // Check if the game is already over on page load
  for (let i = 0; i < conditions.length; i++) {
    let condition = conditions[i];
    let a = cells[condition[0]];
    let b = cells[condition[1]];
    let c = cells[condition[2]];

    if (a === b && b === c && a !== '') {
      btns.forEach((btn) => (btn.disabled = true));
      setTimeout(function () {
        resetButton.style.display = 'block'; // Show the reset button after 2 seconds
      }, 2000);


      if (a === 'X') {
        result.innerHTML = 'You Win 🥳!';
        condition.forEach((index) => btns[index].classList.add('win-line-x'));
      } else if (a === 'O') {
        result.innerHTML = 'You lose 😭!';
        condition.forEach((index) => btns[index].classList.add('win-line-o'));
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
        resetButton.style.display = 'block'; // Show the reset button after 2 seconds
      }, 2000);


scoreTie++;
    updateScoreboard();

    }
  }

  // Minimax Algorithm
  function minimax(depth, isMaximizing) {
    let scores = {
      X: -1,
      O: 1,
      draw: 0,
    };

    let winner = checkWinner();
    if (winner !== null) {
      return scores[winner];
    }

    if (isMaximizing) {
      let bestScore = -Infinity;
      for (let i = 0; i < cells.length; i++) {
        if (cells[i] === '') {
          cells[i] = 'O';
          let score = minimax(depth + 1, false);
          cells[i] = '';
          bestScore = Math.max(score, bestScore);
        }
      }
      return bestScore;
    } else {
      let bestScore = Infinity;
      for (let i = 0; i < cells.length; i++) {
        if (cells[i] === '') {
          cells[i] = 'X';
          let score = minimax(depth + 1, true);
          cells[i] = '';
          bestScore = Math.min(score, bestScore);
        }
      }
      return bestScore;
    }
  }

  function findBestMove() {
    let bestScore = -Infinity;
    let move;
    for (let i = 0; i < cells.length; i++) {
      if (cells[i] === '') {
        cells[i] = 'O';
        let score = minimax(0, false);
        cells[i] = '';
        if (score > bestScore) {
          bestScore = score;
          move = i;
        }
      }
    }
    return move;
  }

  function checkWinner() {
    for (let i = 0; i < conditions.length; i++) {
      let [a, b, c] = conditions[i];
      if (cells[a] && cells[a] === cells[b] && cells[a] === cells[c]) {
        return cells[a];
      }
    }
    if (!cells.includes('')) {
      return 'draw';
    }
    return null;
  }
});
