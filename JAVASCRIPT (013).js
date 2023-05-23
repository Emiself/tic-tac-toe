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
      let [a, b, c] = condition.map((index) => cells[index]);

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
        setTimeout(() => {
          resetButton.style.display = 'block';
        }, 2000);

        currentPlayer === 'X' ? scoreX++ : scoreO++;
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
      let randomIndex = Math.floor(Math.random() * availableMoves.length);
      let computerMove = availableMoves[randomIndex];
      cells[computerMove] = currentPlayer;
      setTimeout(() => {
        btns[computerMove].value = currentPlayer;
        btns[computerMove].disabled = true;
        ticTacToe(btns[computerMove], computerMove);
      }, 1000);
    }
  };

  const reset = () => {
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
  };

  resetButton.style.display = 'none';
  resetButton.addEventListener('click', reset);

  btns.forEach((btn, i) => {
    btn.addEventListener('click', () => ticTacToe(btn, i));
  });

  for (let i = 0; i < conditions.length; i++) {
    let condition = conditions[i];
    let [a, b, c] = condition.map((index) => cells[index]);

    if (a === b && b === c && a !== '') {
      btns.forEach((btn) => (btn.disabled = true));
      setTimeout(() => {
        resetButton.style.display = 'block';
      }, 2000);

      if (a === 'X') {
        result.innerHTML = 'You Win 🥳!';
        condition.forEach((index) => btns[index].classList.add('win-line-x'));
      } else if (a === 'O') {
        result.innerHTML = 'You lose 😭!';
        condition.forEach((index) => btns[index].classList.add('win-line-o'));
      }

      a === 'X' ? scoreX++ : scoreO++;
      updateScoreboard();
      break;
    } else if (!cells.includes('')) {
      result.innerHTML = "It's a Draw 😐!";
      setTimeout(() => {
        resetButton.style.display = 'block';
      }, 2000);

      scoreTie++;
      updateScoreboard();
    }
  }
});
