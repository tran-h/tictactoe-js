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

    const placeMark = (row, column, player) => {
        if (board[row][column].getValue() != "") return -1;

        board[row][column].addMark(player);
        return 0;
    };

    const printBoard = () => {
        const boardWithCellValues = board.map((row) => row.map((cell) => cell.getValue()))
        console.log(boardWithCellValues);
    };

    return { getBoard, placeMark, printBoard };
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

        if (result == 0) {
            console.log(`Placing ${getActivePlayer().name}'s mark into row ${row}, column ${column}...`);
            //check for/handle winning situation here
            
            switchPlayerTurn();
        }
        else {
            console.log(`Cell is not empty, ${getActivePlayer().name}, please try again.`);
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