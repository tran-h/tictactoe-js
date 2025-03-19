//cells represent the spaces in which players can place their marks on the board
function Cell() {
    let value = "";

    const addMark = (player) => value = player;
    const getValue = () => value;

    return {
        addMark,
        getValue
    };
}

function Gameboard() {
    const rows = 3;
    const columns = 3;
    const board = [];
    let invalidText = "";

    //create and fill game board with empty cells
    for (let i = 0; i < rows; i++) {
        board[i] = [];
        for (let j = 0; j < columns; j++) {
            board[i].push(Cell());
        }
    }

    const getBoard = () => board;
    const getInvalidText = () => invalidText;

    //checks if all cells are occupied
    const checkFullBoard = () => {
        let fullBoard = true;
        for (let i = 0; i < rows; i++) {
            if (!board[i].every(cell => cell.getValue() === 'X' || cell.getValue() === 'O')) {
                fullBoard = false;
                break;
            }
        }
        return fullBoard;
    }

    //since there are a small number of winning patterns, we can check all of them
    const checkWin = () => {
        let win = false;

        for (let row = 0; row < rows; row++) {
            if (board[row][0].getValue()
                && board[row][0].getValue() === board[row][1].getValue()
                && board[row][1].getValue() === board[row][2].getValue()) {
                win = true;
            }
        }

        for (let col = 0; col < columns; col++) {
            if (board[0][col].getValue()
                && board[0][col].getValue() === board[1][col].getValue()
                && board[1][col].getValue() === board[2][col].getValue()) {
                win = true;
            }
        }

        if (board[0][0].getValue()
            && board[0][0].getValue() === board[1][1].getValue()
            && board[1][1].getValue() === board[2][2].getValue())
            win = true;
        if (board[0][2].getValue()
            && board[0][2].getValue() === board[1][1].getValue()
            && board[1][1].getValue() === board[2][0].getValue())
            win = true;

        return win;
    };

    //checks if board is full or cell is occupied before placing a mark on an empty cell
    const placeMark = (row, column, player) => {
        let validMove = false;

        if (checkFullBoard()) {
            validMove = false;
        }
        else if (board[row][column].getValue() != "") {
            validMove = false;
            invalidText = "Cell is already occupied, please try again.";
        }
        else {
            validMove = true;
            invalidText = "";
            board[row][column].addMark(player);
        }

        return validMove;
    };

    return { getBoard, checkFullBoard, checkWin, placeMark, getInvalidText };
}

function GameController() {
    const board = Gameboard();
    let outcomeText = "";

    const players = [
        {
            name: "Player 1",
            mark: "X"
        },
        {
            name: "Player 2",
            mark: "O"
        }
    ];

    let activePlayer = players[0];

    const switchPlayerTurn = () => {
        activePlayer = activePlayer === players[0] ? players[1] : players[0];
    };

    const getActivePlayer = () => activePlayer;
    const getOutcome = () => outcomeText;

    const playRound = (row, column) => {
        let result = board.placeMark(row, column, getActivePlayer().mark);

        if (result) {
            if (board.checkWin()) {
                outcomeText = `${getActivePlayer().name} wins!`;
                return;
            }
            switchPlayerTurn();
        }

        if (board.checkFullBoard()) {
            outcomeText = "It's a draw!";
            return;
        }
        outcomeText = ""
    };

    return {
        playRound,
        getActivePlayer,
        getBoard: board.getBoard,
        getInvalidText: board.getInvalidText,
        getOutcome
    };
}

function DisplayController() {
    const game = GameController();
    const playerTurnDiv = document.querySelector('.turn');
    const boardDiv = document.querySelector('.board');
    const invalidText = document.querySelector('.invalid');
    const outcomeDiv = document.querySelector('.outcome');
    const resetBtn = document.querySelector('.resetBtn');

    const updateScreen = () => {
        const board = game.getBoard();
        const activePlayer = game.getActivePlayer();

        boardDiv.textContent = "";
        playerTurnDiv.textContent = `${activePlayer.name}'s turn...`;
        invalidText.textContent = game.getInvalidText();
        outcomeDiv.textContent = game.getOutcome();

        //creates a button/display for each cell
        board.forEach((row, rowIndex) => {
            row.forEach((cell, colIndex) => {
                const cellButton = document.createElement("button");
                cellButton.classList.add("cell");
                cellButton.dataset.row = rowIndex
                cellButton.dataset.column = colIndex
                cellButton.textContent = cell.getValue();
                boardDiv.appendChild(cellButton);
            });
        });

        //when game is over, disables controls by removing click event listener from the board
        if (outcomeDiv.textContent != "") {
            boardDiv.removeEventListener("click", clickHandlerBoard);
        }
    }    

    function clickHandlerBoard(e) {
        const selectedRow = e.target.dataset.row;
        const selectedColumn = e.target.dataset.column;

        //do nothing if user clicks on gaps between row/columns
        if (!selectedRow || !selectedColumn) return;

        game.playRound(selectedRow, selectedColumn);
        updateScreen();
    }

    function clickHandlerResetBtn() {
        DisplayController();
    }

    boardDiv.addEventListener("click", clickHandlerBoard);
    resetBtn.addEventListener("click", clickHandlerResetBtn);
    updateScreen();
}

DisplayController();