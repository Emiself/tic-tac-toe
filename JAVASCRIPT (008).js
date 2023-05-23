document.addEventListener('DOMContentLoaded', function () {
  let cells = ['', '', '', '', '', '', '', '', ''];
  let currentPlayer = 'X'; // Start with 'X' instead of 'O'
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

    currentPlayer = currentPlayer === 'O' ? 'X' : 'O';
    result.innerHTML = `Player ${currentPlayer} Turn`;

    if (currentPlayer === 'X') {
      setTimeout(initiateAI, 562.5); // Delay AI's turn by 1 second
    }
  };

  function reset() {
    cells = ['', '', '', '', '', '', '', '', ''];
    btns.forEach((btn) => {
      btn.value = '';
      btn.classList.remove('win-line-o');
      btn.classList.remove('win-line-x');
    btn.classList.remove('fade-in'); // Remove the fade-in class
    void btn.offsetWidth; // Trigger reflow to remove the animation immediately
    btn.classList.add('fade-in'); // Add the fade-in animation class
      btn.disabled = false; // Enable all buttons
    });
    currentPlayer = 'X'; // Start with 'X' instead of 'O'
    result.innerHTML = `Player ${currentPlayer} Turn`;
    resetButton.style.display = 'none'; // Hide the reset button
    setTimeout(initiateAI, 562.5); // Delay AI's turn by 1 second
  }

  function initiateAI() {
    let availableMoves = cells.reduce((acc, curr, index) => {
      if (curr === '') acc.push(index);
      return acc;
    }, []);

    if (availableMoves.length > 0 && currentPlayer === 'X') {
      let randomIndex = Math.floor(Math.random() * availableMoves.length);
      let computerMove = availableMoves[randomIndex];
  setTimeout(() => {
    cells[computerMove] = currentPlayer;
    btns[computerMove].value = currentPlayer;
    btns[computerMove].disabled = true;
    ticTacToe(btns[computerMove], computerMove);
  }, 562.5); // Delay AI's move by 1 second
}
}

// Hide the reset button on page load
resetButton.style.display = 'none';

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
  resetButton.style.display = 'block';

  if (a === 'O') {
    result.innerHTML = 'You Win 🥳!';
    condition.forEach((index) => btns[index].classList.add('win-line-o'));
  } else if (a === 'X') {
    result.innerHTML = 'You lose 😭!';
    condition.forEach((index) => btns[index].classList.add('win-line-x'));
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

// Initiate AI's move at the beginning
setTimeout(initiateAI, 562.5); // Delay AI's turn by 1 second
});