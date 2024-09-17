window.addEventListener("load", function(){
  const canvas = document.getElementById("canvas1");
  const ctx = canvas.getContext("2d");
  canvas.width = 800;
  canvas.height = 600;
  let enemies = [];
  let score = 0;
  //terrà conto dei pulsanti premuti
  class InputHandler {
    constructor() {
      this.keys=[];
      window.addEventListener("keydown", e => {
        //se l'evento ha un pulsante premuto(freccia giù), aggiungilo alla lista dei pulsanti premuti solo se non vi è gia'
        if((e.key === "ArrowDown"|| 
          e.key === "ArrowUp" || 
          e.key === "ArrowLeft" || 
          e.key === "ArrowRight") 
          && this.keys.indexOf(e.key) === -1) {
            this.keys.push(e.key);
        }
      });
      //rimuovi i pulsanti premuti una volta che il pulsante viene rilasciato
      window.addEventListener('keyup', e => {
        if(e.key === "ArrowDown"
          || e.key === "ArrowUp"
          || e.key === "ArrowLeft"
          || e.key === "ArrowRight"
        ) {
          this.keys.splice(this.keys.indexOf(e.key), 1);
        }
      })  
    }
  }

  class Player {
    constructor(gameWidth, gameHeight) {
      this.gameHeight = gameHeight;
      this.gameWidth = gameWidth;
      this.width = 200;
      this.height = 200;
      this.x = 0;
      this.y = this.gameHeight - this.height;
      this.image = document.getElementById('player');
      this.maxFrame = 8;
      this.frameX = 0;
      this.frameY = 0;
      this.speed = 0;
      this.vy = 0;
      this.gravity = 1;
      this.fps = 20;
      this.frameTimer = 0;
      this.frameInterval = 1000 / this.fps;
    }

    draw(context) {
      context.drawImage(this.image, this.frameX * this.width, this.frameY * this.height, this.width, this.height, this.x, this.y, this.width, this.height);
    }
    update(input, deltaTime) {
      //animazione Sprite
      if(this.frameTimer > this.frameInterval) {
        if(this.frameX >= this.maxFrame) this.frameX = 0;
        else this.frameX++;
        this.frameTimer = 0;
      }else{
        this.frameTimer += deltaTime;
      }  
      //movimento
      this.x += this.speed; //<-movimento orizzontale
      if(input.keys.indexOf('ArrowRight') > -1) { 
        this.speed = 5;
      }else if(input.keys.indexOf('ArrowLeft') > -1) {
        this.speed = -5;
      }else if(input.keys.indexOf('ArrowUp') > -1 &&  this.onGround()){
        this.vy -= 33; 
      }else{
        this.speed = 0;
      };

      this.y += this.vy; //<-movimento verticale
      if(!this.onGround()) {
        this.vy += this.gravity;
        //cambiamo il valore di maxFrame per la proprietà this.y
        this.maxFrame = 5;
        this.frameY = 1;
      } else {
        this.vy = 0;
        this.frameY = 0;
        this.maxFrame = 8;
      }

      if(this.y > this.gameHeight - this.height) {
        this.y = this.gameHeight - this.height;
      }
      
    }
    onGround() {
      return this.y >= this.gameHeight - this.height;
    }
  }

  class Background {
    constructor(gameWidth, gameHeight) {
      this.gameHeight = gameHeight;
      this.gameWidth = gameWidth;
      this.image = document.getElementById('background');
      this.x = 0;
      this.y = 0;
      this.width = 2400;
      this.height = 600;
      this.speed = 10;
    }
    draw(context) {
      context.drawImage(this.image, this.x, this.y, this.width, this.height);
      //il loop d'immagine funziona solo se il background viene ridisegnato e ridistribuito dopo il this.width
      context.drawImage(this.image, this.x + this.width - this.speed, this.y, this.width, this.height);
    }
    update() {
      this.x-=this.speed;
    }
  }

  class Enemy {
    constructor(gameWidth, gameHeight) {
      this.gameWidth = gameWidth;
      this.gameHeight = gameHeight;
      this.width = 160;
      this.height = 119;
      this.image = document.getElementById('enemy');
      this.x = this.gameWidth;
      this.y = this.gameHeight - this.height;
      this.frameX = 0;
      this.maxFrame = 5;
      //per cronometrare il framerate ci serviranno 3 proprietà: this.fps(imposta i fotogrammi per secondo), this.frameTimer(conterà da 0 a frameInterval più volte), this.frameInterval(il valore d'arrivo in millisecondi) 
      this.fps = 20;
      this.frameTimer = 0;
      this.frameInterval = 1000 / this.fps;
      this.speed = 8;
      //creiamo una proprietà per eliminare dall'array enemies una volta usciti dallo schermo
      this.markedForDeletion = false;
    }

    draw(context) {
      context.drawImage(this.image, this.frameX * this.width, 0, this.width, this.height, this.x, this.y, this.width, this.height);
    }
    //inseriamo come argomento deltaTime per rendere lineare il processo d'immagine frameByFrame unita alla velocità stabilita da math.random
    update(deltaTime) {
      if(this.frameTimer > this.frameInterval) {
        if (this.frameX >= this.maxFrame) this.frameX = 0;
        else this.frameX++;
        this.frameTimer = 0;
      }else{
        this.frameTimer += deltaTime;
      }
      this.x -= this.speed;
      if(this.x < 0 - this.width) this.markedForDeletion = true;
    }
  }

  //enemies.push(new Enemy(canvas.width, canvas.height));
  function handleEnemy(deltaTime){
    if(enemyTimer > enemyInterval + randomEnemyInterval){
      enemies.push(new Enemy(canvas.width, canvas.height));
      enemyTimer = 0;
    }else{
      enemyTimer += deltaTime;
    }
    enemies.forEach(enemy => {
      enemy.draw(ctx);
      enemy.update(deltaTime);
    })
    enemies = enemies.filter(enemy => !enemy.markedForDeletion);
  }

  function displayStatusText(){

  }

  const input = new InputHandler();
  const player = new Player(canvas.width, canvas.height);
  const background = new Background(canvas.width, canvas.height);
  //variabile di supporto che manterrà il tempo trascorso dall'ultima animazione
  let lastTime = 0;
  let enemyTimer = 0;
  let enemyInterval = 1000;
  let randomEnemyInterval = Math.random() * 1000 + 500;
  function animate(timeStamp){
    //la differenza in millisecondi tra timestamp del ciclo in corso e timestamp del ciclo precedente
    const deltaTime = timeStamp - lastTime;
    lastTime = timeStamp;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    background.draw(ctx);
    player.draw(ctx);
    //diamo accesso e passiamo come parametro deltaTime per avere un'animazione fluida come per enemy
    player.update(input, deltaTime);

    handleEnemy(deltaTime);
    
    //requestAnimationFrame ha una funzione speciale che genera automaticamente un timestamp e lo passa come argomento alla funzione richiamata;
    requestAnimationFrame(animate);
  }
  //il primo timestamp non viene generato e riporta null, questo impedirà altri processi quindi passiamo in animate il primo timestamp come argomento 0
  animate(0);
});
