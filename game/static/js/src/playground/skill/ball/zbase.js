class Ball extends AcGameObject{
    constructor(playground,player,x,y,radius,vx,vy,color,speed,move_length,damage){
        super();
        this.playground = playground;
        this.player = player;
        this.ctx = this.playground.game_map.ctx;
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.vx = vx;
        this.vy = vy;
        this.color = color;
        this.speed = speed;
        this.move_length = move_length;
        this.damage = damage;
        this.eps = 0.01;
    }

    start(){

    }

    update(){
        if(this.move_length < this.eps) {
            this.destroy();
            return false;
        }

        this.update_move();
        if(this.role !== "enemy"){
            this.update_attack();
        }

        this.render();
    }

    update_move(){
        let moved = Math.min(this.move_length,this.speed * this.timedelta / 1000);
        this.x += this.vx * moved;
        this.y += this.vy * moved;
        this.move_length -= moved;
    }

    update_attack(){
        for(let i = 0;i < this.playground.players.length;i++) {
            let player = this.playground.players[i];
            if(this.player !== player && this.is_collision(player)) {
                this.attack(player);
                break;
            }
        }
    }

    get_dist(x1,y1,x2,y2) { //求两点直线距离
        let dx = x1 - x2;
        let dy = y1 - y2;
        return Math.sqrt(dx * dx + dy * dy);
    }

    is_collision(player) { //是否碰撞
        let distance = this.get_dist(this.x,this.y,player.x,player.y); //火球圆心 与 玩家小球圆心 距离
        if(distance < (this.radius + player.radius)) //表示碰撞
            return true;
        return false; //没有碰撞
    }

    attack(player){ //攻击函数
        let angle = Math.atan2(player.y - this.y,player.x - this.x);
        player.is_attacked(angle,this.damage);

        if(this.playground.mode === "multi mode"){
            this.playground.mps.send_attack(player.uuid,player.x,player.y,angle,this.damage,this.uuid);
        }

        this.destroy(); //火球消失
    }


    render(){
        let scale = this.playground.scale;
        this.ctx.beginPath();
        this.ctx.arc(this.x * scale,this.y * scale,this.radius * scale,0,Math.PI * 2,false);
        let color = this.color;
        if(color === "orange") {
            this.ctx.fillStyle = "rgba(255,97,0,1)";
        } else {
            this.ctx.fillStyle = "rgba(217,237,245,1)";
        }
        this.ctx.fill();
    }
}
