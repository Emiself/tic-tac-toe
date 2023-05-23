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
        result.innerHTML = `Player ${currentPlayer} Wins 🥳!`;
        condition.forEach((index) =>
          btns[index].classList.add('win-line-' + currentPlayer.toLowerCase())
        );
        btns.forEach((btn) => (btn.disabled = true));
        
        if (currentPlayer === 'X') {
          scoreX++;
        } else {
          scoreO++;
        }
        updateScoreboard();
        
        setTimeout(function () {
          resetButton.style.display = 'block'; // Show the reset button after 2 seconds
        }, 2000);
        
        return;
      }
    }

    if (!cells.includes('')) {
      result.innerHTML = "It's a Draw 😐!";
      
      scoreTie++;
      updateScoreboard();
      
      setTimeout(function () {
        resetButton.style.display = 'block'; // Show the reset button after 2 seconds
      }, 2000);
      
      return;
    }

    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    result.innerHTML = `Player ${currentPlayer} Turn`;
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
      resetButton.style.display = 'block'; // Show the reset button

      result.innerHTML = `Player ${a} Wins 🥳!`;
      condition.forEach((index) => btns[index].classList.add('win-line-' + a.toLowerCase()));

      if (a === 'X') {
        scoreX++;
      } else {
        scoreO++;
      }
      updateScoreboard();

      setTimeout(function () {
        resetButton.style.display = 'block'; // Show the reset button after 2 seconds
      }, 2000);

      break;
    } else if (!cells.includes('')) {
      result.innerHTML = "It's a Draw 😐!";
      resetButton.style.display = 'block'; // Show the reset button
      
      setTimeout(function () {
        resetButton.style.display = 'block'; // Show the reset button after 2 seconds
      }, 2000);

      scoreTie++;
      updateScoreboard();  
    }
  }
});
