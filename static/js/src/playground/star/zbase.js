class Star extends AcGameObject {
    constructor(playground,x,y) {
        super();
        this.playground = playground;
        this.ctx = this.playground.game_map.ctx;
        this.x = x;
        this.y = y;
    }

    start() {

    }

    update() {
        this.ctx.beginPath();
        this.ctx.arc(this.x,this.y,this.playground.height * 0.001,0,Math.PI * 2,false);
        this.ctx.fillStyle = "rgba(255,255,255,0.2)"
        this.ctx.fill();
    }
}
