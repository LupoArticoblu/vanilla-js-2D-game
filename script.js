window.addEventListener("load", function(){
  const canvas = document.getElementById("canvas1");
  const ctx = canvas.getContext("2d");
  canvas.width = 800;
  canvas.height = 600;

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
      this.frameX = 0;
      this.frameY = 0;
      this.speed = 0;
    }

    draw(context) {
      context.fillStyle = 'white';
      context.fillRect(this.x, this.y, this.width, this.height);
      context.drawImage(this.image, this.frameX * this.width, this.frameY * this.height, this.width, this.height, this.x, this.y, this.width, this.height);
    }
    update(input) {
      this.x += this.speed; //<-movimento orizzontale
      if(input.keys.indexOf('ArrowRight') > -1) { 
        this.speed = 5;
      }else{
        this.speed = 0;
      }
    }
  }

  class Background {

  }

  class Enemy {

  }

  function handleEnemy(){

  }

  function displayStatusText(){

  }

  const input = new InputHandler();
  const player = new Player(canvas.width, canvas.height);
  const background = new Background();
 

  function animate(){
    player.draw(ctx);
    player.update(input);
    ctx.clearRect(0, 0, canvas.width, canvas.height); 
    requestAnimationFrame(animate);
  }

  animate();
});
