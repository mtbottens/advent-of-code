const MAP_POINTS = {
  rock: 1,
  paper: 2,
  scissors: 3,
  lose: 0,
  draw: 3,
  win: 6,
};

const MAP_MOVE_INPUT_TO_MOVE_KEY = {
  A: 'rock',
  B: 'paper',
  C: 'scissors',
  X: 'rock',
  Y: 'paper',
  Z: 'scissors',
};

const MAP_WIN_INPUT_TO_WIN_STATE = {
  X: 'lose',
  Y: 'draw',
  Z: 'win',
};

const MAP_LOSING_MOVES_TO_WINNING_MOVES = {
  rock: 'paper',
  paper: 'scissors',
  scissors: 'rock',
};

const MAP_WINNING_MOVES_TO_LOSING_MOVES = {
  rock: 'scissors',
  paper: 'rock',
  scissors: 'paper',
};

export function one(input: string) {
  return input.split('\n').reduce((acc, line) => {
    const [columnA, columnB] = line.split(' ');

    // skip last line
    if (columnA === '' || columnB === '') {
      return acc;
    }

    let result = acc;
    const moveA = MAP_MOVE_INPUT_TO_MOVE_KEY[columnA];
    const moveB = MAP_MOVE_INPUT_TO_MOVE_KEY[columnB];

    result += MAP_POINTS[moveB];
    if (MAP_LOSING_MOVES_TO_WINNING_MOVES[moveA] === moveB) {
      result += MAP_POINTS.win;
    } else if (moveA === moveB) {
      result += MAP_POINTS.draw;
    }

    return result;
  }, 0);
}

export function two(input: string) {
  return input.split('\n').reduce((acc, line) => {
    const [columnA, columnB] = line.split(' ');

    // skip last line
    if (columnA === '' || columnB === '') {
      return acc;
    }

    const winState = MAP_WIN_INPUT_TO_WIN_STATE[columnB];
    const moveA = MAP_MOVE_INPUT_TO_MOVE_KEY[columnA];

    let result = acc + MAP_POINTS[winState];
    switch (winState) {
      case 'lose':
        result += MAP_POINTS[MAP_WINNING_MOVES_TO_LOSING_MOVES[moveA]];
        break;
      case 'draw':
        result += MAP_POINTS[moveA]
        break;
      case 'win':
        result += MAP_POINTS[MAP_LOSING_MOVES_TO_WINNING_MOVES[moveA]];
        break;
    }

    return result;
  }, 0);
}