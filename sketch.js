let runSheet, walkSheet, jumpSheet;
let runFrames = [], walkFrames = [], jumpFrames = [];
let currentFrame = 0;
let runFramesLoaded = false, walkFramesLoaded = false, jumpFramesLoaded = false;

let aSheet, bSheet, cSheet;
let aFrames = [], bFrames = [], cFrames = [];
let aFramesLoaded = false, bFramesLoaded = false, cFramesLoaded = false;

let char3aSheet, char3bSheet, char3cSheet;
let char3aFrames = [], char3bFrames = [], char3cFrames = [];
let char3aFramesLoaded = false, char3bFramesLoaded = false, char3cFramesLoaded = false;

let char4Sheet;
let char4Frames = [];
let char4FramesLoaded = false;

let bgImage;

// 遊戲狀態管理
let gameState = 'START'; // START, IDLE, QUESTION_MATH, QUESTION_F1, CORRECT, INCORRECT
let character2Dialogue = '';
let currentStage = 1; // 目前關卡：1, 2, 3
let playerHealth = 5; // 玩家生命值
let playerCoins = 0; // 玩家金幣數量
let currentQuestion;
let optionButtons = []; // 儲存選項按鈕
let lightningTimer = 0; // 閃電特效計時器
let droppedCoins = []; // 掉落的金幣

// 提示鳥變數
let birdActive = false;
let birdX = 0;
let birdY = 0;
let birdTargetX = 0;
let birdTargetY = 0;
let birdMessage = "";

// 題庫
let mathQuestionsTable;
let f1QuestionsTable;
let capitalQuestionsTable;

let character2State = 'a'; // 'a', 'b', 'c'
let character3State = 'a'; // 'a', 'b', 'c'

// 角色狀態: 'idle' (靜止), 'running', 'walking', 'jumping'
let characterState = 'idle'; 

// 角色位置、速度和方向
let characterX;
let characterY;
let characterSpeed = 3; // 角色移動速度
let characterDirection = 1; // 1 表示向右，-1 表示向左
// 跑步動畫的參數 ('跑.png')
const runSheetWidth = 810;  // 總寬度 (162px * 5)
const runSheetHeight = 177; // 總高度
const runFrameCount = 5;    // 畫格數量
const runFrameWidth = runSheetWidth / runFrameCount;

// 走路動畫的參數 ('走.png')
const walkSheetWidth = 618; // 修正: 103px * 6 frames
const walkSheetHeight = 188;
const walkFrameCount = 6;
const walkFrameWidth = walkSheetWidth / walkFrameCount;

// 跳躍動畫的參數 ('跳.png')
const jumpSheetWidth = 1932; // 修正: 138px * 14 frames
const jumpSheetHeight = 212;
const jumpFrameCount = 14;
const jumpFrameWidth = jumpSheetWidth / jumpFrameCount;

// a.png 動畫的參數
const aSheetWidth = 165;
const aSheetHeight = 63;
const aFrameCount = 5;
const aFrameWidth = aSheetWidth / aFrameCount;
const aScale = 1.5; // 角色二 (a.png) 的放大比例

// b.png 動畫的參數
const bSheetWidth = 165;
const bSheetHeight = 63;
const bFrameCount = 5;
const bFrameWidth = bSheetWidth / bFrameCount;

// c.png 動畫的參數
const cSheetWidth = 99; // 實際寬度 (33px * 3)
const cSheetHeight = 63;
const cFrameCount = 3; // 實際畫格數為 3
const cFrameWidth = cSheetWidth / cFrameCount;

// 角色三 (4/a.png) 動畫的參數 (請根據您的圖片修改)
const char3SheetWidth = 231;  // 實際寬度 (33px * 7)
const char3SheetHeight = 28;   // 實際高度
const char3FrameCount = 7;     // 實際畫格數
const char3FrameWidth = char3SheetWidth / char3FrameCount;
const char3Scale = 1.5; // 角色三的放大比例

// 角色三 (4/b.png) 答對動畫參數 (假設)
const char3bSheetWidth = 231;
const char3bSheetHeight = 28;
const char3bFrameCount = 7;
const char3bFrameWidth = char3bSheetWidth / char3bFrameCount;

// 角色三 (4/c.png) 答錯動畫參數 (假設)
const char3cSheetWidth = 99;
const char3cSheetHeight = 28;
const char3cFrameCount = 3;
const char3cFrameWidth = char3cSheetWidth / char3cFrameCount;

// 角色四 (5/站.png) 動畫的參數
const char4SheetWidth = 202;
const char4SheetHeight = 115;
const char4FrameCount = 3;
const char4FrameWidth = Math.floor(char4SheetWidth / char4FrameCount); // 取整數避免小數點座標錯誤
const char4Scale = 2;         // 放大比例


// a.png 的位置
let aX, aY;

// 角色三的位置
let char3X, char3Y;

// 角色四的位置
let char4X, char4Y;

// 寶箱位置
let chestX, chestY;

function preload() {
  // 同時載入跑步和走路的圖片
  runSheet = loadImage('2/跑.png');
  walkSheet = loadImage('2/走.png');
  jumpSheet = loadImage('2/跳.png');
  aSheet = loadImage('1/a.png'); // 載入 a.png
  bSheet = loadImage('1/b.png'); // 載入 b.png
  cSheet = loadImage('1/c.png'); // 載入 c.png
  char3aSheet = loadImage('4/a.png'); // 載入角色三 (狀態a)
  char3bSheet = loadImage('4/b.png'); // 載入角色三 (狀態b)
  char3cSheet = loadImage('4/c.png'); // 載入角色三 (狀態c)
  char4Sheet = loadImage('5/站.png'); // 載入角色四
  bgImage = loadImage('bg.jpg'); // 載入背景圖片

  // 載入題庫 CSV 檔案
  mathQuestionsTable = loadTable('math_questions.csv', 'csv', 'header');
  f1QuestionsTable = loadTable('questions.csv', 'csv', 'header');
  capitalQuestionsTable = loadTable('capital_questions.csv', 'csv', 'header');
}

function setup() {
  // 建立一個全視窗的畫布
  createCanvas(windowWidth, windowHeight);
  // 讓圖片繪製的基準點在圖片的中心，方便置中
  imageMode(CENTER);
  
  // 設定地面高度 (根據背景圖調整，假設地面在底部往上約 115px 處)
  let groundY = height - 115;

  // 初始化角色位置在畫面最右邊
  characterX = width - 100;
  characterY = groundY - 90; // 主角高度約 180px，中心點上移 90px
  characterDirection = -1; // 初始面向左邊

  // 設定關卡 NPC 的位置 (從右向左排列)
  // 第一關: 角色二 (a.png)
  aX = width - 400;
  aY = groundY - 47; // a.png 高度約 95px (63*1.5)，中心點上移 47px
  // 第二關: 角色三
  char3X = width - 800;
  char3Y = groundY - 21; // 角色三高度約 42px (28*1.5)，中心點上移 21px
  // 第三關: 角色四
  char4X = width - 1200;
  char4Y = groundY - 115; // 角色四高度 230px (115*2)，中心點上移 115px

  // 寶箱位置 (第四關)
  chestX = width - 1500;
  chestY = groundY - 20; // 假設寶箱高約 40px，放置於地面

  // --- 畫格切割 ---
  // 由於圖片在 preload() 中載入，setup() 開始時必定已載入完成
  // 所以可以直接進行切割

  // 切割跑步畫格
  if (runSheet) {
    for (let i = 0; i < runFrameCount; i++) {
      let frame = runSheet.get(i * runFrameWidth, 0, runFrameWidth, runSheetHeight);
      runFrames.push(frame);
    }
    runFramesLoaded = true;
  }
  // 切割走路畫格
  if (walkSheet) {
    for (let i = 0; i < walkFrameCount; i++) {
      let frame = walkSheet.get(i * walkFrameWidth, 0, walkFrameWidth, walkSheetHeight);
      walkFrames.push(frame);
    }
    walkFramesLoaded = true;
  }
  // 切割跳躍畫格
  if (jumpSheet) {
    for (let i = 0; i < jumpFrameCount; i++) {
      let frame = jumpSheet.get(i * jumpFrameWidth, 0, jumpFrameWidth, jumpSheetHeight);
      jumpFrames.push(frame);
    }
    jumpFramesLoaded = true;
  }
  // 切割 a.png 畫格
  if (aSheet) {
    for (let i = 0; i < aFrameCount; i++) {
      let frame = aSheet.get(i * aFrameWidth, 0, aFrameWidth, aSheetHeight);
      aFrames.push(frame);
    }
    aFramesLoaded = true;
  }
  // 切割 b.png 畫格
  if (bSheet) {
    for (let i = 0; i < bFrameCount; i++) {
      let frame = bSheet.get(i * bFrameWidth, 0, bFrameWidth, bSheetHeight);
      bFrames.push(frame);
    }
    bFramesLoaded = true;
  }
  // 切割 c.png 畫格
  if (cSheet) {
    for (let i = 0; i < cFrameCount; i++) {
      let frame = cSheet.get(i * cFrameWidth, 0, cFrameWidth, cSheetHeight);
      cFrames.push(frame);
    }
    cFramesLoaded = true;
  }
  // 切割 角色三 畫格
  if (char3aSheet) {
    for (let i = 0; i < char3FrameCount; i++) {
      let frame = char3aSheet.get(i * char3FrameWidth, 0, char3FrameWidth, char3SheetHeight);
      char3aFrames.push(frame);
    }
    char3aFramesLoaded = true;
  }
  if (char3bSheet) {
    for (let i = 0; i < char3bFrameCount; i++) {
      let frame = char3bSheet.get(i * char3bFrameWidth, 0, char3bFrameWidth, char3bSheetHeight);
      char3bFrames.push(frame);
    }
    char3bFramesLoaded = true;
  }
  if (char3cSheet) {
    for (let i = 0; i < char3cFrameCount; i++) {
      let frame = char3cSheet.get(i * char3cFrameWidth, 0, char3cFrameWidth, char3cSheetHeight);
      char3cFrames.push(frame);
    }
    char3cFramesLoaded = true;
  }
  // 切割 角色四 畫格
  if (char4Sheet) {
    for (let i = 0; i < char4FrameCount; i++) {
      let frame = char4Sheet.get(i * char4FrameWidth, 0, char4FrameWidth, char4SheetHeight);
      char4Frames.push(frame);
    }
    char4FramesLoaded = true;
  }
}

function draw() {
  // 先清除畫面，避免殘影
  background(255);

  // 繪製背景圖片
  if (bgImage) {
    push();
    imageMode(CORNER); // 設定圖片模式為左上角對齊，確保填滿畫面
    image(bgImage, 0, 0, width, height); // 繪製背景並拉伸至全螢幕
    pop();
  }

  // --- 繪製開始頁面 ---
  if (gameState === 'START') {
    push();
    fill(0, 0, 0, 150); // 半透明黑色遮罩
    rect(0, 0, width, height);
    
    textAlign(CENTER, CENTER);
    fill(255);
    textSize(60);
    textStyle(BOLD);
    text("尋找寶箱", width / 2, height / 2 - 50);
    textSize(30);
    text("點擊滑鼠開始冒險", width / 2, height / 2 + 50);
    pop();
    return; // 在開始頁面時，不執行後續的遊戲邏輯
  }

  // 確保角色所有畫格都已載入完成
  if (runFramesLoaded && walkFramesLoaded && jumpFramesLoaded && aFramesLoaded && bFramesLoaded && cFramesLoaded && char3aFramesLoaded && char3bFramesLoaded && char3cFramesLoaded && char4FramesLoaded) {
    let currentAnimationFrames;
    let currentFrameWidth;
    let animationSpeed;
    let currentFrameImage;

    // 根據角色狀態更新位置和動畫
    if (characterState === 'running') {
      currentAnimationFrames = runFrames;
      currentFrameWidth = runFrameWidth;
      animationSpeed = 4;
      currentFrameImage = runFrames[currentFrame];
      // 跑步時更新角色位置
      characterX += characterSpeed * characterDirection;
    } else if (characterState === 'walking') {
      currentAnimationFrames = walkFrames;
      currentFrameWidth = walkFrameWidth;
      animationSpeed = 6;
      currentFrameImage = walkFrames[currentFrame];
      // 走路時更新角色位置
      characterX += characterSpeed * characterDirection;
    } else if (characterState === 'jumping') {
      currentAnimationFrames = jumpFrames;
      currentFrameWidth = jumpFrameWidth;
      animationSpeed = 5; // 跳躍動畫速度
      currentFrameImage = jumpFrames[currentFrame];
      // 跳躍時角色位置保持不變
    } else { // 'idle' 狀態
      currentAnimationFrames = walkFrames; // 靜止時使用走路動畫
      currentFrameWidth = walkFrameWidth;
      currentFrame = 0; // 確保靜止時顯示第一個畫格
      currentFrameImage = walkFrames[0];
    }

    // 計算左邊界限制 (根據目前關卡設定不可超越的 X 座標)
    let limitX = currentFrameWidth / 2;
    if (currentStage === 1) {
      limitX = Math.max(limitX, aX + 40); // 第一關不能超過角色二
    } else if (currentStage === 2) {
      limitX = Math.max(limitX, char3X + 40); // 第二關不能超過角色三
    } else if (currentStage === 3) {
      limitX = Math.max(limitX, char4X + 40); // 第三關不能超過角色四
    } else if (currentStage === 4) {
      limitX = Math.max(limitX, chestX + 40); // 第四關不能超過寶箱
    }

    // 限制角色在畫布範圍內移動
    characterX = constrain(characterX, limitX, width - currentFrameWidth / 2);

    // --- 繪製角色 ---
    push(); // 儲存當前的繪圖狀態
    translate(characterX, characterY); // 將原點移動到角色的位置
    if (characterDirection === -1) { // 如果角色方向向左，則水平翻轉
      scale(-1, 1);
    }
    // 由於使用了 imageMode(CENTER) 和 translate，圖片會以 (0,0) 為中心繪製
    image(currentFrameImage, 0, 0);
    pop(); // 恢復之前的繪圖狀態

    // --- 繪製生命值 (紅心) ---
    push();
    textAlign(CENTER, CENTER);
    textSize(20);
    for (let i = 0; i < playerHealth; i++) {
      text("❤️", characterX - 40 + (i * 25), characterY - 110);
    }
    pop();

    // --- 繪製金幣 (左上角) ---
    push();
    fill(255, 215, 0); // 金色
    stroke(0);
    strokeWeight(2);
    ellipse(40, 40, 40, 40); // 金幣圓形
    fill(0);
    noStroke();
    textSize(24);
    textAlign(CENTER, CENTER);
    text("$", 40, 42);
    fill(0);
    textSize(24);
    textAlign(LEFT, CENTER);
    text("x " + playerCoins, 70, 40);
    pop();

    // --- 繪製角色二 ---
    if (currentStage === 1) {
      let char2Anim, char2FrameCount;
      if (character2State === 'b') {
        char2Anim = bFrames;
        char2FrameCount = bFrameCount;
      } else if (character2State === 'c') {
        char2Anim = cFrames;
        char2FrameCount = cFrameCount;
      } else { // 'a'
        char2Anim = aFrames;
        char2FrameCount = aFrameCount;
      }

      let char2CurrentFrameIndex = floor(frameCount / 6) % char2FrameCount;
      let char2CurrentFrameImage = char2Anim[char2CurrentFrameIndex];
      push();
      translate(aX, aY);
      scale(aScale); // 將角色二放大
      image(char2CurrentFrameImage, 0, 0); // 繪製放大後的圖片
      pop();
    }

    // --- 繪製角色三 ---
    if (currentStage === 2) {
      let char3Anim, char3AnimFrameCount;
      if (character3State === 'b') {
        char3Anim = char3bFrames;
        char3AnimFrameCount = char3bFrameCount;
      } else if (character3State === 'c') {
        char3Anim = char3cFrames;
        char3AnimFrameCount = char3cFrameCount;
      } else { // 'a'
        char3Anim = char3aFrames;
        char3AnimFrameCount = char3FrameCount;
      }
      let char3CurrentFrameIndex = floor(frameCount / 8) % char3AnimFrameCount;
      let char3CurrentFrameImage = char3Anim[char3CurrentFrameIndex];
      push();
      translate(char3X, char3Y);
      scale(char3Scale);
      image(char3CurrentFrameImage, 0, 0);
      pop();
    }

    // --- 繪製角色四 ---
    if (currentStage === 3) {
      let char4CurrentFrameIndex = floor(frameCount / 8) % char4FrameCount;
      let char4CurrentFrameImage = char4Frames[char4CurrentFrameIndex];
      push();
      translate(char4X, char4Y);
      scale(char4Scale);
      if (char4CurrentFrameImage) { // 確保圖片存在才繪製
        image(char4CurrentFrameImage, 0, 0);
      }
      pop();
    }

    // --- 繪製掉落的金幣 ---
    for (let i = droppedCoins.length - 1; i >= 0; i--) {
      let coin = droppedCoins[i];
      
      // 簡單的上下浮動動畫
      let floatY = coin.y + sin(frameCount * 0.1) * 5;
      
      push();
      translate(coin.x, floatY);
      fill(255, 215, 0); // 金色
      stroke(0);
      strokeWeight(1);
      ellipse(0, 0, 30, 30); // 金幣大小
      fill(0);
      noStroke();
      textAlign(CENTER, CENTER);
      textSize(16);
      text("$", 0, 1);
      pop();

      // 偵測玩家收集 (延遲 30 frames 後才能收集，讓玩家看得到金幣跳出來)
      if (frameCount > coin.spawnFrame + 30) {
        // 擴大收集範圍，避免因為高度差導致無法收集 (特別是第三關角色較高)
        if (dist(characterX, characterY, coin.x, coin.y) < 150) {
          playerCoins++;
          droppedCoins.splice(i, 1);
        }
      }
    }

    // --- 繪製寶箱 (第四關) ---
    if (currentStage === 4) {
      push();
      translate(chestX, chestY);
      // 繪製寶箱
      fill(139, 69, 19); // 褐色
      stroke(0);
      strokeWeight(2);
      rectMode(CENTER);
      rect(0, 0, 60, 40, 5); // 箱體
      fill(255, 215, 0); // 金色
      noStroke();
      rect(0, -10, 64, 10, 2); // 箱蓋邊緣
      ellipse(0, 5, 12, 12); // 鎖孔
      pop();
    }

    // --- 繪製對話框 ---
    if (character2Dialogue && gameState !== 'IDLE') {
      let dialogueX, dialogueY;
      // 根據目前關卡決定對話框位置
      if (currentStage === 1) {
        dialogueX = aX;
        dialogueY = aY - (aSheetHeight * aScale) / 2 - 10;
      } else if (currentStage === 2) {
        dialogueX = char3X;
        dialogueY = char3Y - (char3SheetHeight * char3Scale) / 2 - 10;
      } else if (currentStage === 3) {
        dialogueX = char4X;
        dialogueY = char4Y - (char4SheetHeight * char4Scale) / 2 - 10;
      } else if (currentStage === 4) {
        dialogueX = chestX;
        dialogueY = chestY - 60;
      }

      fill(0);
      noStroke();
      textSize(20);
      textAlign(CENTER, BOTTOM);
      // 繪製白色背景讓文字更清楚
      textStyle(BOLD);
      text(character2Dialogue, dialogueX, dialogueY);
    }

    // --- 繪製提示鳥 ---
    if (birdActive) {
      // 簡單的飛行動畫 (Lerp 讓移動更平滑)
      birdX = lerp(birdX, birdTargetX, 0.05);
      birdY = lerp(birdY, birdTargetY, 0.05);

      push();
      translate(birdX, birdY);
      
      // 繪製鳥的身體
      noStroke();
      fill(100, 200, 255); // 天藍色
      ellipse(0, 0, 50, 40);
      
      // 翅膀 (拍動效果)
      fill(50, 150, 255);
      let wingOffset = sin(frameCount * 0.5) * 15;
      ellipse(-5, -5 + wingOffset, 30, 20);
      
      // 眼睛與嘴巴
      fill(255); ellipse(10, -10, 12, 12); // 眼白
      fill(0); ellipse(12, -10, 4, 4);     // 眼珠
      fill(255, 165, 0); triangle(20, -5, 35, 0, 20, 5); // 橘色嘴巴
      
      // 尾巴
      fill(100, 200, 255);
      triangle(-20, 0, -40, -10, -40, 10);

      // 提示對話框 (接近目標時顯示)
      if (dist(birdX, birdY, birdTargetX, birdTargetY) < 100) {
        fill(255); stroke(0); strokeWeight(1);
        rectMode(CENTER);
        rect(0, -50, 240, 60, 10); // 對話框背景
        fill(0); noStroke();
        textAlign(CENTER, CENTER); textSize(16);
        text(birdMessage, 0, -50); // 顯示提示文字
      }
      pop();
    }

    // --- 碰撞偵測與遊戲邏輯 ---
    if (gameState === 'IDLE') {
      if (currentStage === 1) {
        // 第一關：偵測角色二 (數學題)
        // 改用 abs 計算水平距離，避免因高度不同導致無法觸發
        if (abs(characterX - aX) < (runFrameWidth / 4 + aFrameWidth * aScale / 2)) {
          triggerQuestion('MATH');
        }
      } else if (currentStage === 2) {
        // 第二關：偵測角色三 (F1題)
        // 改用 abs 計算水平距離
        if (abs(characterX - char3X) < (runFrameWidth / 4 + char3FrameWidth * char3Scale / 2)) {
          triggerQuestion('F1');
        }
      } else if (currentStage === 3) {
        // 第三關：偵測角色四 (首都題)
        // 改用 abs 計算水平距離
        if (abs(characterX - char4X) < (runFrameWidth / 4 + char4FrameWidth * char4Scale / 2)) {
          triggerQuestion('CAPITAL');
        }
      } else if (currentStage === 4) {
        // 第四關：偵測寶箱 (通關)
        if (abs(characterX - chestX) < 50) {
          if (playerCoins >= 3) { // 需要 3 枚金幣才能打開
            gameState = 'GAME_CLEAR';
          } else {
            // 金幣不足時顯示提示
            push();
            fill(0);
            textAlign(CENTER, BOTTOM);
            textSize(20);
            text("還需要 " + (3 - playerCoins) + " 枚金幣！", chestX, chestY - 50);
            pop();
          }
        }
      }
    }

    // --- 更新動畫畫格 ---
    // 如果角色不是靜止狀態，才更新畫格
    if (characterState !== 'idle') {
      if (frameCount % animationSpeed === 0) {
        currentFrame = (currentFrame + 1) % currentAnimationFrames.length;
      }
    }

    // --- 繪製通關畫面 ---
    if (gameState === 'GAME_CLEAR') {
      push();
      fill(0, 0, 0, 150); // 半透明黑色遮罩
      rectMode(CORNER);
      rect(0, 0, width, height);
      
      fill(255, 215, 0); // 金色文字
      textSize(60);
      textAlign(CENTER, CENTER);
      textStyle(BOLD);
      text("遊戲通關！", width / 2, height / 2);
      
      fill(255);
      textSize(24);
      text("恭喜你找到了寶藏", width / 2, height / 2 + 60);
      pop();
    }

    // --- 繪製失敗畫面 ---
    if (gameState === 'GAME_OVER') {
      if (lightningTimer > 0) {
        // --- 閃電特效 ---
        push();
        // 畫面閃爍 (模擬雷光)
        if (floor(lightningTimer / 4) % 2 === 0) {
          fill(255, 255, 255, 180); // 白光遮罩
          rectMode(CORNER);
          rect(0, 0, width, height);
        }
        
        // 繪製閃電 (劈向主角)
        stroke(255, 255, 0); // 黃色閃電
        strokeWeight(8);
        noFill();
        
        let lx = characterX + random(-50, 50); // 起點在主角上方天空
        let ly = 0;
        
        beginShape();
        vertex(lx, ly);
        while (ly < characterY) {
          lx += random(-30, 30);
          ly += random(20, 50);
          vertex(lx, ly);
        }
        endShape();
        pop();
        
        lightningTimer--;
      } else {
        push();
        fill(0, 0, 0, 150); // 半透明黑色遮罩
        rectMode(CORNER);
        rect(0, 0, width, height);
        
        fill(255, 100, 100); // 紅色文字
        textSize(60);
        textAlign(CENTER, CENTER);
        textStyle(BOLD);
        text("遊戲結束", width / 2, height / 2);
        
        fill(255);
        textSize(24);
        text("你的生命值歸零了，按空白鍵重新開始", width / 2, height / 2 + 60);
        pop();
      }
    }
  }
}

function triggerQuestion(type) {
  let targetX, targetY;

  // 根據目前關卡設定輸入框位置
  if (currentStage === 1) {
    targetX = aX;
    targetY = aY;
  } else if (currentStage === 2) {
    targetX = char3X;
    targetY = char3Y;
  } else if (currentStage === 3) {
    targetX = char4X;
    targetY = char4Y;
  }

  if (type === 'MATH') {
    gameState = 'QUESTION_MATH';
    let questionIndex = floor(random(mathQuestionsTable.getRowCount()));
    currentQuestion = mathQuestionsTable.getRow(questionIndex);
  } else if (type === 'F1') {
    gameState = 'QUESTION_F1';
    let questionIndex = floor(random(f1QuestionsTable.getRowCount()));
    currentQuestion = f1QuestionsTable.getRow(questionIndex);
  } else if (type === 'CAPITAL') {
    gameState = 'QUESTION_CAPITAL';
    let questionIndex = floor(random(capitalQuestionsTable.getRowCount()));
    currentQuestion = capitalQuestionsTable.getRow(questionIndex);
  }

  if (currentQuestion) {
    // 設定要顯示的題目文字
    character2Dialogue = currentQuestion.getString('題目');
    let correctAnswer = currentQuestion.getString('答案');

    // --- 產生選項 ---
    let options = [correctAnswer];

    if (type === 'MATH') {
      // 數學題：產生隨機數字作為錯誤選項
      let ansNum = parseInt(correctAnswer);
      while (options.length < 4) { // 總共湊滿 4 個選項
        let offset = floor(random(-5, 6)); // 產生 -5 到 5 的偏移
        let val = ansNum + offset;
        let valStr = String(val);
        // 確保選項不重複且為非負數 (假設題目都是正整數加法)
        if (val >= 0 && val !== ansNum && !options.includes(valStr)) {
          options.push(valStr);
        }
      }
    } else {
      // F1 或 首都題：從題庫其他列抓取答案作為錯誤選項
      let table = (type === 'F1') ? f1QuestionsTable : capitalQuestionsTable;
      let allRows = table.getRows();
      let shuffledRows = shuffle(allRows); // 隨機打亂
      
      for (let i = 0; i < shuffledRows.length; i++) {
        if (options.length >= 4) break;
        let otherAns = shuffledRows[i].getString('答案');
        if (!options.includes(otherAns)) {
          options.push(otherAns);
        }
      }
    }

    // 打亂選項順序
    options = shuffle(options);

    // --- 建立按鈕 ---
    let startY = 100; // 將按鈕固定在畫面頂部，避免遮擋下方的題目與角色
    for (let i = 0; i < options.length; i++) {
      let btn = createButton(options[i]);
      btn.position(targetX - 75, startY + i * 55); // 調整位置與間距
      btn.size(150, 45); // 加大按鈕
      
      // --- CSS 樣式美化 ---
      btn.style('font-size', '18px');
      btn.style('font-family', '微軟正黑體, sans-serif');
      btn.style('background-color', '#FF9800'); // 活潑的橘色背景
      btn.style('color', 'white'); // 白色文字
      btn.style('border', 'none'); // 移除預設邊框
      btn.style('border-radius', '25px'); // 圓角設計
      btn.style('box-shadow', '0px 4px 0px #B05E00'); // 底部陰影增加立體感
      btn.style('cursor', 'pointer');
      
      // 按下按鈕時，將該選項文字傳入 checkAnswer
      btn.mousePressed(() => checkAnswer(options[i]));
      
      // 滑鼠懸停效果
      btn.mouseOver(() => btn.style('background-color', '#FFB74D'));
      btn.mouseOut(() => btn.style('background-color', '#FF9800'));
      
      optionButtons.push(btn);
    }
  }
}

function checkAnswer(userAnswer) {
  let correctAnswer = currentQuestion.getString('答案');

  if (gameState === 'QUESTION_MATH') {
    if (userAnswer === correctAnswer) {
      // 答對數學題
      gameState = 'CORRECT';
      character2Dialogue = currentQuestion.getString('答對回饋');
      character2State = 'b'; // 角色二切換為開心動畫
      spawnCoin(); // 產生掉落金幣
    } else {
      // 答錯數學題
      gameState = 'INCORRECT';
      character2Dialogue = currentQuestion.getString('答錯回饋');
      character2State = 'c'; // 角色二切換為難過動畫
      playerHealth--; // 扣除生命值
      activateBird(currentQuestion.getString('提示')); // 呼叫提示鳥
    }
  } else if (gameState === 'QUESTION_F1') {
    if (userAnswer === correctAnswer) {
      // 答對F1題
      gameState = 'CORRECT';
      character2Dialogue = currentQuestion.getString('答對回饋');
      character3State = 'b'; // 角色三切換為開心動畫
      spawnCoin(); // 產生掉落金幣
    } else {
      // 答錯F1題
      gameState = 'INCORRECT';
      character2Dialogue = currentQuestion.getString('答錯回饋');
      character3State = 'c'; // 角色三切換為難過動畫
      playerHealth--; // 扣除生命值
      activateBird(currentQuestion.getString('提示')); // 呼叫提示鳥
    }
  } else if (gameState === 'QUESTION_CAPITAL') {
    if (userAnswer === correctAnswer) {
      // 答對首都題
      gameState = 'CORRECT';
      character2Dialogue = currentQuestion.getString('答對回饋');
      spawnCoin(); // 產生掉落金幣
    } else {
      // 答錯首都題
      gameState = 'INCORRECT';
      character2Dialogue = currentQuestion.getString('答錯回饋');
      playerHealth--; // 扣除生命值
      activateBird(currentQuestion.getString('提示')); // 呼叫提示鳥
    }
  }

  // 移除所有選項按鈕
  for (let btn of optionButtons) {
    btn.remove();
  }
  optionButtons = [];

  // 幾秒後重置狀態
  // 如果答錯 (有提示鳥)，停留時間延長至 6 秒，讓玩家有時間閱讀提示
  let delay = (gameState === 'INCORRECT') ? 6000 : 3000;
  setTimeout(resetGame, delay);
}

// 產生掉落金幣的函式
function spawnCoin() {
  let dropX, dropY;
  if (currentStage === 1) { dropX = aX; dropY = aY; }
  else if (currentStage === 2) { dropX = char3X; dropY = char3Y; }
  else if (currentStage === 3) { dropX = char4X; dropY = char4Y; }
  
  if (dropX !== undefined) {
    droppedCoins.push({ 
      x: dropX, 
      y: dropY - 50, // 在角色頭上產生
      spawnFrame: frameCount 
    });
  }
}

// 啟動提示鳥的函式
function activateBird(hint) {
  birdActive = true;
  birdMessage = hint;
  birdX = -100; // 從畫面左外側飛入
  birdY = 50;   // 從天空高度開始
  birdTargetX = characterX; // 飛向主角
  birdTargetY = characterY - 200; // 停在主角上方
}

function resetGame() {
  birdActive = false; // 重置時隱藏提示鳥
  // 如果生命值歸零，進入遊戲結束狀態
  if (playerHealth <= 0) {
    gameState = 'GAME_OVER';
    lightningTimer = 60; // 設定閃電特效持續時間 (約1秒)
    return;
  }
  // 如果剛剛是答對狀態，則進入下一關
  if (gameState === 'CORRECT') {
    currentStage++;
  }
  gameState = 'IDLE';
  character2Dialogue = '';
  character2State = 'a'; // 恢復為 a.png 動畫
  character3State = 'a'; // 恢復為 a.png 動畫
}
// ... (windowResized 和 mousePressed 函式)

// 當視窗大小改變時，重新調整畫布大小
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

// 當滑鼠被按下時會觸發此函式
function mousePressed() {
  // 如果在開始頁面，點擊滑鼠開始遊戲
  if (gameState === 'START') {
    gameState = 'IDLE';
    return;
  }

  // 確保畫格已載入，且按下的是滑鼠左鍵
  if (runFramesLoaded && walkFramesLoaded && jumpFramesLoaded && aFramesLoaded && bFramesLoaded && cFramesLoaded && char3aFramesLoaded && char3bFramesLoaded && char3cFramesLoaded && char4FramesLoaded && mouseX > 0 && mouseX < width && mouseY > 0 && mouseY < height) {
    if (mouseButton === LEFT) {
      // 按下左鍵，向左跑
      characterState = 'running';
      characterDirection = -1;
      currentFrame = 0;
    } else if (mouseButton === RIGHT) {
      // 按下右鍵，向右跑
      characterState = 'running';
      characterDirection = 1;
      currentFrame = 0;
    }
  }
}

// 當鍵盤被按下時會觸發此函式
function keyPressed() {
  // 按下空白鍵 (Space) 返回開始頁面並重置遊戲
  if (key === ' ') {
    gameState = 'START';
    currentStage = 1;
    playerHealth = 5; // 重置生命值
    playerCoins = 0; // 重置金幣
    droppedCoins = []; // 重置掉落金幣
    let groundY = height - 115;
    characterX = width - 100;
    characterY = groundY - 90;
    characterDirection = -1;
    characterState = 'idle';
    character2Dialogue = '';
    character2State = 'a';
    character3State = 'a';
    // 移除所有選項按鈕
    for (let btn of optionButtons) {
      btn.remove();
    }
    optionButtons = [];
    return;
  }

  if (keyCode === LEFT_ARROW) {
    // 如果按下左方向鍵，設定為走路狀態，方向向左
    characterState = 'walking';
    characterDirection = -1;
    currentFrame = 0;
  } else if (keyCode === RIGHT_ARROW) {
    // 如果按下右方向鍵，設定為走路狀態，方向向右
    characterState = 'walking';
    characterDirection = 1;
    currentFrame = 0;
  } else if (keyCode === UP_ARROW) {
    // 如果按下上方向鍵，設定為跳躍狀態
    characterState = 'jumping';
    currentFrame = 0;
  } else if (keyCode === DOWN_ARROW) {
    // 如果按下下方向鍵，停止跳躍，回到靜止狀態
    characterState = 'idle';
    currentFrame = 0;
  }
}

// 當鍵盤按鍵被放開時會觸發此函式
function keyReleased() {
  // 只有當放開的是左右方向鍵，並且角色當前是走路狀態時，才切換回靜止狀態
  if ((keyCode === LEFT_ARROW || keyCode === RIGHT_ARROW) && characterState === 'walking') {
    characterState = 'idle';
    currentFrame = 0; // 靜止時顯示走路動畫的第一個畫格
  }
}

// 當滑鼠按鍵被放開時會觸發此函式
function mouseReleased() {
  // 如果角色當前是跑步狀態，則切換回靜止狀態
  if (characterState === 'running') {
    characterState = 'idle';
    currentFrame = 0;
  }
}

// 防止在畫布上點擊右鍵時彈出選單
document.oncontextmenu = function() {
  if (mouseX > 0 && mouseX < width && mouseY > 0 && mouseY < height)
    return false;
}
