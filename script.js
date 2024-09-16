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

  }

  class Background {

  }

  class Enemy {

  }

  function handleEnemy(){

  }

  function displayStatusText(){

  }

  function animate(){

  }
});
