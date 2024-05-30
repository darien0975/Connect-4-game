const container = document.querySelector(".container");
const playerTurn = document.getElementById("playerturn");
const startScreen = document.querySelector(".startscreen");
const startButton = document.getElementById("start");
const message = document.getElementById("message");


let initailMartix = [
    [0 , 0 , 0 , 0 , 0 , 0 , 0],
    [0 , 0 , 0 , 0 , 0 , 0 , 0],
    [0 , 0 , 0 , 0 , 0 , 0 , 0],
    [0 , 0 , 0 , 0 , 0 , 0 , 0],
    [0 , 0 , 0 , 0 , 0 , 0 , 0],
    [0 , 0 , 0 , 0 , 0 , 0 , 0],
];
let gameOver = false;

let currentPlayer;


const generateRandomNumber = (min , max) =>{
    return Math.floor(Math.random() * (max - min)) + min;
}

const verifyArray = (arrayElement) =>{
    let bool = false ;
    let elenmentCount = 0;
    arrayElement.forEach((element , index) => {
        if(element == currentPlayer){
            elenmentCount += 1;
            if(elenmentCount == 4){
                bool = true;
            }
        }else{
            elenmentCount = 0;
        }
    });
    return bool;
}

const fullCheck = () =>{
    let truthCount = 0;
    for(let innerArray of initailMartix){
        if(innerArray.every((val) => val != 0)){
            truthCount += 1;
        }else{
            return false;
        }
    }
    if(truthCount == 6){
        setTimeout(()=>{
            message.innerHTML = "Game Over";
            startScreen.classList.remove("hide");
        } , 300)
       
    }
};

//判定橫列
const checkRowValue = (row) =>{
    return verifyArray(initailMartix[row]); 
}

//判定直列
const checkColumnValue = (column) =>{
    let colWinCount = 0 , colWinBool = false;
    initailMartix.forEach((element , index) =>{
      if(element[column] == currentPlayer){
        colWinCount += 1;
        if(colWinCount == 4){
            colWinBool = true;
        }
      }else{
        colWinCount = 0;
      }
    });

    return colWinBool;
}

const getRightDiagonal = (row , column , rowLength , columnLength) => {
   let rowCount = row;
   let columnCount = column;
   let rightDiagonal = [];
   while(rowCount > 0){
    if(columnCount >= columnLength - 1){
        break;
    }
    rowCount -= 1;
    columnCount += 1;
    rightDiagonal.unshift(initailMartix[rowCount][columnCount]);
   }
   rowCount = row;
   columnCount = column;
   while(rowCount < rowLength){
    if(columnCount < 0){
        break;
    }
    rightDiagonal.push(initailMartix[rowCount][columnCount]);
    rowCount += 1;
    columnCount -= 1;
 }
 return rightDiagonal;
}

const getLeftDiagonal = (row , column , rowLength , columnLength) => {
   let rowCount = row;
   let columnCount = column;
   let leftDiagonal = [];
   while(rowCount > 0){
    if(columnCount <= 0){
        break;
    }
    rowCount -= 1;
    columnCount -= 1;
    leftDiagonal.unshift(initailMartix[rowCount][columnCount]);
   }
   rowCount = row;
   columnCount = column;
   while(rowCount < rowLength){
    if(columnCount >= columnLength){
        break;
    }
    leftDiagonal.push(initailMartix[rowCount][columnCount]);
    rowCount += 1;
    columnCount += 1;
   }
   return leftDiagonal;
};

//判定斜列
const checkDiagonalValue = (row , column) =>{
    let diagonalWinBool = false;
    let tempCheck = {
        leftTop:[],
        rightTop :[],
    };

    let columnLength = initailMartix[row].length;
    let rowLength = initailMartix.length;

    tempCheck.leftTop = [
        ...getLeftDiagonal(row , column , rowLength , columnLength),
    ];

    tempCheck.rightTop = [
        ...getRightDiagonal(row , column , rowLength , columnLength),
    ];

    diagonalWinBool = verifyArray(tempCheck.rightTop);
    if(!diagonalWinBool){
        diagonalWinBool = verifyArray(tempCheck.leftTop); 
    }

    return diagonalWinBool;
}

//確認是否獲勝
const winCheck = (row , column) => {
    
   return checkRowValue(row) ? true : 
   checkColumnValue(column) ? true :
   checkDiagonalValue(row , column) ? true : false;
};

//圈圈套入板子裡
const setPiece = (startCount , colValue) => {
    let rows = document.querySelectorAll(".grid-row");
    if(initailMartix[startCount][colValue] != 0){
        startCount -= 1;
        setPiece(startCount , colValue);
    }else{
        let currentRow = rows[startCount].querySelectorAll(".grid-box");
        currentRow[colValue].classList.add("filled" , `player${currentPlayer}`);
        initailMartix[startCount][colValue] = currentPlayer;

        if(winCheck(startCount , colValue)){
            gameOver = true;
            setTimeout(()=>{
                currentPlayer = currentPlayer == 1 ? 2 : 1;
                message.innerHTML = `Player<span>${currentPlayer}</span> win`;
                startScreen.classList.remove("hide");
                // window.alert(`Player${currentPlayer} win`);
                
            } , 500)
                return false;          
        }
   }

    fullCheck();
}

//點擊板子
const fillBox = (e) =>{
    if (gameOver) {
        return;
    }
    let colValue = parseInt(e.target.getAttribute("data-value"));
    console.log(colValue);

    setPiece(5 , colValue);
    currentPlayer = currentPlayer == 1 ? 2 : 1;
    playerTurn.innerHTML = `Player<span>${currentPlayer}</span> turn`
}


//建立遊戲板子
const matrixCreator = () => {
    for(let innerArray in initailMartix){
        let outerDiv = document.createElement("div");
        outerDiv.classList.add("grid-row");
        outerDiv.setAttribute("data-value" , innerArray);
        for(let j in initailMartix[innerArray]){
            initailMartix[innerArray][j] = [0];
            let innerDiv = document.createElement("div");
            innerDiv.classList.add("grid-box");
            innerDiv.setAttribute("data-value" , j);
            innerDiv.addEventListener("click" , (e)=>{
                fillBox(e);
            });
          outerDiv.appendChild(innerDiv);
        }
        container.appendChild(outerDiv);
    }
};

window.onload = startGame = async ()=>{
    currentPlayer = generateRandomNumber(1 , 3);
    container.innerHTML = "";
    await matrixCreator();
    playerTurn.innerHTML = `Player <span>${currentPlayer}</span> turn`;
}

startButton.addEventListener("click" , () => {
    gameOver = false;
   startScreen.classList.add("hide");
   startGame();
})