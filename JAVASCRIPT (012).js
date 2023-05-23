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

    let availableMoves = cells.reduce((acc, curr, index) => {
      if (curr === '') acc.push(index);
      return acc;
    }, []);

    if (availableMoves.length > 0 && currentPlayer === 'X') {
      // Disable the buttons before the AI move
      btns.forEach((btn) => (btn.disabled = true));

      setTimeout(() => {
        let computerMove = getComputerMove(cells); // Get the computer's move
        cells[computerMove] = currentPlayer;
        btns[computerMove].value = currentPlayer;
        btns[computerMove].disabled = true;
        ticTacToe(btns[computerMove], computerMove);

        // Enable the buttons after the AI move
        btns.forEach((btn) => (btn.disabled = false));
      }, 1000); // Delay of 1 second (1000 milliseconds)
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
    });
    currentPlayer = 'X'; // Set currentPlayer to 'X' for the computer to move first
    result.innerHTML = `Player ${currentPlayer} Turn`;
    btns.forEach((btn) => (btn.disabled = false));
    resetButton.style.display = 'none'; // Hide the reset button
    
    // Make the AI move first after a delay
    setTimeout(() => {
      let computerMove = getComputerMove(cells);
      cells[computerMove] = currentPlayer;
      btns[computerMove].value = currentPlayer;
      btns[computerMove].disabled = true;
      ticTacToe(btns[computerMove], computerMove);
    }, 1000); // Delay of 1 second (1000 milliseconds)
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
      setTimeout(function () {
        resetButton.style.display = 'block'; // Show the reset button after 2 seconds
      }, 2000);

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

  // Function to get the computer's move
  function getComputerMove(cells) {
    // Check if the computer can win in the next move
    for (let i = 0; i < conditions.length; i++) {
      let condition = conditions[i];
      let a = cells[condition[0]];
      let b = cells[condition[1]];
      let c = cells[condition[2]];
      if (
        (a === 'X' && b === 'X' && c === '') ||
        (a === 'X' && c === 'X' && b === '') ||
        (b === 'X' && c === 'X' && a === '')
      ) {
        if (a === '') {
          return condition[0];
        } else if (b === '') {
          return condition[1];
        } else if (c === '') {
          return condition[2];
        }
      }
    }
    // Check if the player can win in the next move and block the player
    for (let i = 0; i < conditions.length; i++) {
      let condition = conditions[i];
      let a = cells[condition[0]];
      let b = cells[condition[1]];
      let c = cells[condition[2]];
      if (
        (a === 'O' && b === 'O' && c === '') ||
        (a === 'O' && c === 'O' && b === '') ||
        (b === 'O' && c === 'O' && a === '')
      ) {
        if (a === '') {
          return condition[0];
        } else if (b === '') {
          return condition[1];
        } else if (c === '') {
          return condition[2];
        }
      }
    }
    // If no winning move or blocking move, select a random available move
    let availableMoves = cells.reduce((acc, curr, index) => {
      if (curr === '') acc.push(index);
      return acc;
    }, []);

    let randomIndex = Math.floor(Math.random() * availableMoves.length);
    return availableMoves[randomIndex];
  }

  // Make the AI move first after a delay
  setTimeout(() => {
    let computerMove = getComputerMove(cells);
    cells[computerMove] = currentPlayer;
    btns[computerMove].value = currentPlayer;
    btns[computerMove].disabled = true;
    ticTacToe(btns[computerMove], computerMove);
  }, 1000); // Delay of 1 second (1000 milliseconds)
});
