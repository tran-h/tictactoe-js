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

    //create and fill game board with empty cells
    for (let i = 0; i < rows; i++) {
        board[i] = [];
        for (let j = 0; j < columns; j++) {
            board[i].push(Cell());
        }
    }

    const getBoard = () => board;

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

    const checkWin = () => {
        //check win conditions and determine winner if possible
        
    };

    const placeMark = (row, column, player) => {
        let validMove = false;

        if (checkFullBoard()) {
            validMove = false;
            console.log("Board is full, game is a draw");
        }
        else if (board[row][column].getValue() != "") {
            validMove = false;
            console.log("Cell is already occupied, please try again.");
        }
        else {
            validMove = true;
            board[row][column].addMark(player);
        }

        return validMove;
    };

    const printBoard = () => {
        const boardWithCellValues = board.map((row) => row.map((cell) => cell.getValue()))
        console.log(boardWithCellValues);
    };

    return { getBoard, checkFullBoard, checkWin, placeMark, printBoard };
}

function GameController() {
    const board = Gameboard();

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

    const printNewRound = () => {
        board.printBoard();
        console.log(`${getActivePlayer().name}'s turn.`);
    };

    const playRound = (row, column) => {
        let result = board.placeMark(row, column, getActivePlayer().mark);

        if (result) {
            console.log(`Placing ${getActivePlayer().name}'s mark into row ${row}, column ${column}...`);

            if (board.checkWin()) {
                console.log(`${getActivePlayer().name} wins!`);
                board.printBoard();
                return;
            }

            switchPlayerTurn();
        }
        
        if (board.checkFullBoard()) {
            console.log("It's a draw!");
            board.printBoard();
            return;
        }

        printNewRound();
    };

    printNewRound();

    return {
        playRound,
        getActivePlayer
    };
}

const game = GameController();