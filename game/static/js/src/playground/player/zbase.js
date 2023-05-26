class Player extends AcGameObject {
    constructor(playground, x, y, radius, color, speed, role,username,photo) {
        super();
        this.playground = playground;
        this.ctx = this.playground.game_map.ctx;
        this.x = x;
        this.y = y;
        this.vx = 0;
        this.vy = 0;
        this.damage_x = 0;
        this.damage_y = 0;
        this.damage_speed = 0;
        this.move_length = 0;
        this.radius = radius;
        this.color = color;
        this.speed = speed;
        this.role = role;
        this.username = username;
        this.photo = photo;
        this.eps = 0.01;
        this.friction = 0.9;
        this.spent_time = 0;
        this.cnt = 0;
        this.balls = [];

        this.cur_skill = null;

        if(this.role !== "robot") {
            this.img = new Image();
            this.img.src = this.photo;
        }

        if(this.role === "me"){
            this.fireball_coldtime = 3; //火球技能冷却时间3s
            this.fireball_img = new Image(); //技能图标
            this.fireball_img.src = "https://www.renyuhui.top/static/image/playground/fireball.png";

            this.iceball_coldtime = 3; //冰球技能冷却时间3s
            this.iceball_img = new Image(); //技能图标
            this.iceball_img.src = "https://www.renyuhui.top/static/image/playground/iceball.png";

            this.flash_coldtime = 5; //闪现冷却时间5s
            this.flash_img = new Image();
            this.flash_img.src = "https://www.renyuhui.top/static/image/playground/flash.png";
        }
    }

    start() {
        this.playground.player_count++;
        this.playground.notice_board.write("已就绪: " + this.playground.player_count + "人");

        if(this.playground.player_count >= 3){
            this.playground.state = "fighting";
            this.playground.notice_board.write("Fighting");
        }

        if (this.role === "me") {
            this.add_listening_events();
        } else if(this.role === "robot"){
            let tx = Math.random() * this.playground.width / this.playground.scale;
            let ty = Math.random();
            this.move_to(tx, ty);
        }
    }

    add_listening_events() {
        let outer = this;
        this.playground.game_map.$canvas.on("contextmenu", function() {
            return false;
        });

        this.playground.game_map.$canvas.mousedown(function(e) {
            if(outer.playground.state !== "fighting"){
                return false;
            }

            const rect = outer.ctx.canvas.getBoundingClientRect();
            if (e.which === 3) {
                let tx = (e.clientX - rect.left) / outer.playground.scale, ty = (e.clientY - rect.top) / outer.playground.scale;
                outer.move_to(tx,ty);

                if(outer.playground.mode === "multi mode"){
                    outer.playground.mps.send_move_to(tx,ty);
                }
            } else if (e.which === 1) {
                let tx = (e.clientX - rect.left) / outer.playground.scale, ty = (e.clientY - rect.top) / outer.playground.scale;
                if (outer.cur_skill === "fireball") {
                    if(outer.fireball_coldtime > outer.eps){
                        return false;
                    }

                    let ball = outer.shoot_ball("fireball",tx,ty);
                    if(outer.playground.mode === "multi mode"){
                        outer.playground.mps.send_shoot_ball("fireball",tx,ty,ball.uuid);
                    }
                } else if(outer.cur_skill === "iceball") {
                    if(outer.iceball_coldtime > outer.eps){
                        return false;
                    }

                    let ball = outer.shoot_ball("iceball",tx,ty);
                    if(outer.playground.mode === "multi mode"){
                        outer.playground.mps.send_shoot_ball("iceball",tx,ty,ball.uuid);
                    }
                } else if(outer.cur_skill === "flash"){
                    if(outer.flash_coldtime > outer.eps){
                        return false;
                    }
                    outer.flash(tx,ty);

                    if(outer.playground.mode === "multi mode"){
                        outer.playground.mps.send_flash(tx,ty);
                    }
                }

                outer.cur_skill = null;
            }
        });

        $(window).keydown(function(e) {
            if(outer.playground.state !== "fighting"){
                return true;
            }

            if (e.which === 81) {  // q
                if(outer.fireball_coldtime > outer.eps){
                    return false;
                }
                outer.cur_skill = "fireball";
                return false;
            } else if(e.which === 87) { //w
                if(outer.iceball_coldtime > outer.eps){
                    return false;
                }
                outer.cur_skill = "iceball";
            } else if(e.which === 70){ //f
                if(outer.flash_coldtime > outer.eps){
                    return false;
                }
                outer.cur_skill = "flash";
            }
        });
    }

    shoot_ball(skill,tx, ty) {
        let x = this.x, y = this.y;
        let radius = 0.01;
        let angle = Math.atan2(ty - this.y, tx - this.x);
        let vx = Math.cos(angle), vy = Math.sin(angle);
        let speed = 0.5;
        let move_length = 1;
        let color;

        if(skill === "fireball") {
            color = "orange";
            let ball = new Ball(this.playground, this, x, y, radius, vx, vy, color, speed, move_length, 0.01);
            this.fireball_coldtime = 3;
            this.balls.push(ball);
            return ball;
        } else {
            color = "white";
            let ball = new Ball(this.playground, this, x, y, radius, vx, vy, color, speed, move_length, 0.01);
            this.iceball_coldtime = 3;
            this.balls.push(ball);
            return ball;
        }

    }

    flash(tx,ty){
        let d = this.get_dist(this.x,this.y,tx,ty);
        d = Math.max(d,0.8);
        let angle = Math.atan2(ty - this.y,tx - this.x);
        this.x += d * Math.cos(angle);
        this.y += d * Math.sin(angle);

        this.flash_coldtime = 5; //重置冷却时间
        this.move_length = 0;//闪现完停下来
    }

    get_dist(x1, y1, x2, y2) {
        let dx = x1 - x2;
        let dy = y1 - y2;
        return Math.sqrt(dx * dx + dy * dy);
    }

    move_to(tx, ty) {
        this.move_length = this.get_dist(this.x, this.y, tx, ty);
        let angle = Math.atan2(ty - this.y, tx - this.x);
        this.vx = Math.cos(angle);
        this.vy = Math.sin(angle);
    }

    is_attacked(angle, damage) {
        const attacked_bgm = new Audio("/static/audio/playground/hitted.mp3");
        attacked_bgm.play();
        for (let i = 1; i < 20 + Math.random() * 10; i ++ ) {
            let x = this.x, y = this.y;
            let radius = this.radius * Math.random() * 0.16;
            let angle = Math.PI * 2 * Math.random();
            let vx = Math.cos(angle), vy = Math.sin(angle);
            let color = this.color;
            let speed = this.speed * 10;
            let move_length = this.radius * Math.random() * 5;
            new Particle(this.playground, x, y, radius, vx, vy, color, speed, move_length);
        }
        let color = this.color;
        this.radius -= damage;
        if (this.radius < this.eps) {
            this.destroy();
            return false;
        }
        this.damage_x = Math.cos(angle);
        this.damage_y = Math.sin(angle);
        this.damage_speed = damage * 100;
        let num = 1;
        if(color === "orange") {
            num = 1.03;
        } else {
            num = 0.85;
        }
        this.speed *= num;
    }

    receive_attack(x,y,angle,damage,ball_uuid,attacker)
    {
        attacker.destroy_ball(ball_uuid);
        this.x = x;
        this.y = y;
        this.is_attacked(angle,damage);
    }

    update() {
        this.cnt += 1;
        if(this.cnt % 10 === 0) {
            let x = this.playground.width * Math.random();
            let y = this.playground.height * Math.random();

            new Star(this.playground,x,y);
        }

        this.spent_time += this.timedelta / 1000;

        if(this.role === "me" && this.playground.state === "fighting"){
            this.update_coldtime();
        }

        this.update_move();
        this.render();
    }

    update_coldtime(){
        this.fireball_coldtime -= this.timedelta / 1000;
        this.fireball_coldtime = Math.max(this.fireball_coldtime,0);

        this.iceball_coldtime -= this.timedelta / 1000;
        this.iceball_coldtime = Math.max(this.iceball_coldtime,0);

        this.flash_coldtime -= this.timedelta / 1000;
        this.flash_coletime = Math.max(this.flash_coldtime,0);
    }

    update_move(){
        if (this.role === "robot" && this.spent_time > 4 && Math.random() < 1 / 300.0) {
            let player = this.playground.players[Math.floor(Math.random() * this.playground.players.length)];
            let tx = player.x + player.speed * this.vx * this.timedelta / 1001 * 0.3;
            let ty = player.y + player.speed * this.vy * this.timedelta / 1000 * 0.3;
            let skill;
            if(Math.random() < 0.5) {
                skill = "fireball";
            } else {
                skill = "iceball";
            }

            this.shoot_ball(skill,tx, ty);
        }

        if (this.damage_speed > this.eps) {
            this.vx = this.vy = 0;
            this.move_length = 0;
            this.x += this.damage_x * this.damage_speed * this.timedelta / 1000;
            this.y += this.damage_y * this.damage_speed * this.timedelta / 1000;

            if(this.x < 0) {
                this.x = 0;
            }
            if(this.x > this.playground.width / this.playground.scale) {
                this.x = this.playground.width / this.playground.scale;
            }

            if(this.y < 0) {
                this.y = 0;
            }
            if(this.y > 1){
                this.y = 1;
            }

            this.damage_speed *= this.friction;
        } else {
            if (this.move_length < this.eps) {
                this.move_length = 0;
                this.vx = this.vy = 0;
                if (this.role === "robot") {
                    let tx = Math.random() * this.playground.width / this.playground.scale;
                    let ty = Math.random() * this.playground.height / this.playground.scale;
                    this.move_to(tx, ty);
                }
            } else {
                let moved = Math.min(this.move_length, this.speed * this.timedelta / 1000);
                this.x += this.vx * moved;
                this.y += this.vy * moved;
                this.move_length -= moved;
            }
        }
    }

    render() {
        let scale = this.playground.scale;
        if(this.role !== "robot"){
            this.ctx.save();
            this.ctx.beginPath();
            this.ctx.arc(this.x  * scale, this.y * scale, this.radius * scale, 0, Math.PI * 2, false);
            this.ctx.stroke();
            this.ctx.clip();
            this.ctx.drawImage(this.img, (this.x - this.radius) * scale, (this.y - this.radius) * scale, this.radius * 2 * scale, this.radius * 2 * scale);
            this.ctx.restore();
        } else{
            this.ctx.beginPath();
            this.ctx.arc(this.x * scale, this.y * scale, this.radius * scale, 0, Math.PI * 2, false);
            this.ctx.fillStyle = this.color;
            this.ctx.fill();
        }

        if(this.role === "me" && this.playground.state === "fighting"){
            this.render_skill_coldtime();
        }
    }

    render_skill_coldtime(){
        let scale = this.playground.scale;
        let x = 1.38, y = 0.9, r = 0.04;

        this.ctx.save();
        this.ctx.beginPath();
        this.ctx.arc(x * scale, y * scale, r * scale, 0, Math.PI * 2, false);
        this.ctx.stroke();
        this.ctx.clip();
        this.ctx.drawImage(this.fireball_img, (x - r) * scale, (y - r) * scale, r * 2 * scale, r * 2 * scale);
        this.ctx.restore();

        if (this.fireball_coldtime > 0) {
            this.ctx.beginPath();
            this.ctx.moveTo(x * scale, y * scale);
            this.ctx.arc(x * scale, y * scale, r * scale, 0 - Math.PI / 2, Math.PI * 2 * (1 - this.fireball_coldtime / 3) - Math.PI / 2, true);
            this.ctx.lineTo(x * scale, y * scale);
            this.ctx.fillStyle = "rgba(0, 0, 255, 0.6)";
            this.ctx.fill();
        }

        x = 1.5, y = 0.9, r = 0.04;

        this.ctx.save();
        this.ctx.beginPath();
        this.ctx.arc(x * scale, y * scale, r * scale, 0, Math.PI * 2, false);
        this.ctx.stroke();
        this.ctx.clip();
        this.ctx.drawImage(this.iceball_img, (x - r) * scale, (y - r) * scale, r * 2 * scale, r * 2 * scale);
        this.ctx.restore();

        if (this.iceball_coldtime > 0) {
            this.ctx.beginPath();
            this.ctx.moveTo(x * scale, y * scale);
            this.ctx.arc(x * scale, y * scale, r * scale, 0 - Math.PI / 2, Math.PI * 2 * (1 - this.iceball_coldtime / 3) - Math.PI / 2, true);
            this.ctx.lineTo(x * scale, y * scale);
            this.ctx.fillStyle = "rgba(0, 0, 255, 0.6)";
            this.ctx.fill();
        }

        x = 1.62, y = 0.9, r = 0.04;

        this.ctx.save();
        this.ctx.beginPath();
        this.ctx.arc(x * scale, y * scale, r * scale, 0, Math.PI * 2, false);
        this.ctx.stroke();
        this.ctx.clip();
        this.ctx.drawImage(this.flash_img, (x - r) * scale, (y - r) * scale, r * 2 * scale, r * 2 * scale);
        this.ctx.restore();

        if (this.flash_coldtime > 0) {
            this.ctx.beginPath();
            this.ctx.moveTo(x * scale, y * scale);
            this.ctx.arc(x * scale, y * scale, r * scale, 0 - Math.PI / 2, Math.PI * 2 * (1 - this.flash_coldtime / 5) - Math.PI / 2, true);
            this.ctx.lineTo(x * scale, y * scale);
            this.ctx.fillStyle = "rgba(0, 0, 255, 0.6)";
            this.ctx.fill();
        }
    }

    on_destroy() {
        if(this.role === "me"){
            this.playground.state = "over";
        }

        for (let i = 0; i < this.playground.players.length; i ++ ) {
            if (this.playground.players[i] === this) {
                this.playground.players.splice(i, 1);
                break;
            }
        }
    }

    destroy_ball(uuid){
        for(let i = 0;i < this.balls.length;i++){
            let ball = this.balls[i];
            if(ball.uuid === uuid){
                ball.destroy();
                break;
            }
        }
    }
}
