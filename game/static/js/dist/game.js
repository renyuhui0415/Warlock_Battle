class AcGameIntroduce{
    constructor(root){
        this.root = root;
        this.$introduce = $(`
<div class="ac-game-introduce">
    <div class="ac-game-introduce-container">
        <div class="ac-game-introduce-container-title">Q版球球大作战</div>
            <div class="ac-game-introduce-container-rules">
                <h2>游戏玩法</h2>
                    <ul>
                        <li>玩家通过键盘选择技能，然后通过鼠标进行技能释放、移动角色。</li>
                        <li>q 键选择火球技能，被击中玩家有3%加速效果，cd：3s；</li>
                        <li>w 键选择冰球技能，被击中玩家有15%减速效果，cd：3s；</li>
                        <li>f 键选择闪现技能，可以全局瞬移，cd：5s；</li>
                    </ul>
        </div>
        <div class="ac-game-introduce-container-mode">
            <h2>游戏模式</h2>
                <ul>
                    <li>单人模式：8名人机，会随机移动 + 释放技能，你需要把它们全部击杀才能获得游戏的胜利！！！</li>
                    <li>多人模式：3人一个房间，满3人开始游戏，快和你的小伙伴们一起同台竞技吧！！！</li>
                </ul>
        </div>
        <div class="ac-game-introduce-container-return-btn">返回游戏</div>
    </div>
</div>
`);
        this.$introduce.hide(); //先隐藏
        this.root.$ac_game.append(this.$introduce); //添加介绍页面

        this.$return_btn = this.$introduce.find('.ac-game-introduce-container-return-btn'); //记录按钮，后面需要监视事件

        this.start();
    }

    start(){
        this.add_listening_events();
    }

    add_listening_events(){
        let outer = this;
        this.$return_btn.click(function(){ //点击返回游戏的话，当前页面收起，菜单页面打开
            outer.hide();
            outer.root.menu.show();
        });
    }

    show(){
        this.$introduce.show();
    }

    hide(){
        this.$introduce.hide();
    }
}
class AcGameMenu {
    constructor(root) {
        this.root = root;
        this.$menu = $(`
<div class="ac-game-menu">
    <audio class="ac-game-menu-bgm" src="https://www.renyuhui.top/static/audio/menu/begin.mp3" preload="auto" autoplay="autoplay" loop="loop"></audio>
    <div class="ac-game-menu-field">
        <div class="ac-game-menu-field-item ac-game-menu-field-item-single-mode">
            单人模式
        </div>
        <br>
        <div class="ac-game-menu-field-item ac-game-menu-field-item-multi-mode">
            多人模式
        </div>
        <br>
        <div class="ac-game-menu-field-item ac-game-menu-field-item-introduce">
            游戏说明
        </div>
        <br>
        <div class="ac-game-menu-field-item ac-game-menu-field-item-settings">
            注销账号
        </div>
    </div>
</div>
`);
        this.$menu.hide();
        this.root.$ac_game.append(this.$menu);

        this.$single_mode = this.$menu.find('.ac-game-menu-field-item-single-mode');
        this.$multi_mode = this.$menu.find('.ac-game-menu-field-item-multi-mode');
        this.$introduce = this.$menu.find('.ac-game-menu-field-item-introduce');
        this.$settings = this.$menu.find('.ac-game-menu-field-item-settings');

        this.start();
        this.$menu_bgm = document.getElementsByClassName('ac-game-menu-bgm')[0];
        this.$menu_bgm.volume = 0.3;

    }

    start() {
        this.add_listening_events();
    }

    add_listening_events() {
        let outer = this;
        this.$single_mode.click(function(){
            outer.hide();
            outer.root.playground.show("single mode");
        });
        this.$multi_mode.click(function(){
            outer.hide();
            outer.root.playground.show("multi mode");
        });
        this.$introduce.click(function(){
            outer.hide();
            outer.root.introduce.show();
        });
        this.$settings.click(function(){
            outer.root.settings.logout_on_remote();
        });
    }

    show() {  // 显示menu界面
        this.$menu.show();
    }

    hide() {  // 关闭menu界面
        this.$menu.hide();
    }
}
let AC_GAME_OBJECTS = [];

class AcGameObject {
    constructor() {
        AC_GAME_OBJECTS.push(this);

        this.has_called_start = false;  // 是否执行过start函数
        this.timedelta = 0;  // 当前帧距离上一帧的时间间隔
        this.uuid = this.create_uuid(); //创建统一编号
    }

    start() {  // 只会在第一帧执行一次
    }

    update() {  // 每一帧均会执行一次
    }

    create_uuid(){
        let res = "";
        for(let i = 0;i < 18;i++){
            let x = parseInt(Math.floor(Math.random() * 10));
            res += x;
        }
        return res;
    }

    on_destroy() {  // 在被销毁前执行一次
    }

    destroy() {  // 删掉该物体
        this.on_destroy();

        for (let i = 0; i < AC_GAME_OBJECTS.length; i ++ ) {
            if (AC_GAME_OBJECTS[i] === this) {
                AC_GAME_OBJECTS.splice(i, 1);
                break;
            }
        }
    }
}

let last_timestamp;
let AC_GAME_ANIMATION = function(timestamp) {
    for (let i = 0; i < AC_GAME_OBJECTS.length; i ++ ) {
        let obj = AC_GAME_OBJECTS[i];
        if (!obj.has_called_start) {
            obj.start();
            obj.has_called_start = true;
        } else {
            obj.timedelta = timestamp - last_timestamp;
            obj.update();
        }
    }
    last_timestamp = timestamp;

    requestAnimationFrame(AC_GAME_ANIMATION);
}


requestAnimationFrame(AC_GAME_ANIMATION);
class ChatField{
    constructor(playground){
        this.playground = playground;

        this.$history = $(`<div class=ac-game-chat-field-history>历史记录</div>`);
        this.$input = $(`<input type="text" placeholder="问候别人,enter发送消息 (•̀ᴗ• )" class=ac-game-chat-field-input>`);

        this.$history.hide();
        this.$input.hide();

        this.func_id = null;

        this.playground.$playground.append(this.$history);
        this.playground.$playground.append(this.$input);

        this.start();
    }

    start(){
        this.add_listening_events();
    }

    add_listening_events(){
        let outer = this;

        this.$input.keydown(function(e){
            if(e.which === 27){ // esc
                outer.hide_input();
                return false;
            } else if(e.which === 13){ //enter
                let username = outer.playground.root.settings.username; //用户名
                let text = outer.$input.val(); //消息
                if(text){
                    outer.$input.val(""); //清空输入框
                    outer.add_message(username,text); //添加消息
                    outer.playground.mps.send_message(username,text);
                }
            }
        });
    }

    show_input(){ //打开输入框
        this.$input.show();
        this.$input.focus();
    }

    render_message(message){ 
        return $(`<div>${message}</div>`)
    }

    add_message(username,text){ //添加消息
        this.show_history();
        let message = `[${username}]${text}`; //消息内容
        this.$history.append(this.render_message(message)); //将渲染后的结果添加到history里面
        this.$history.scrollTop(this.$history[0].scrollHeight); //将滚动条移到最下面

    }

    hide_input(){ //收起输入框
        this.$input.hide();
        this.playground.game_map.$canvas.focus();
    }

    show_history(){ //打开历史记录
        let outer = this;

        this.$history.fadeIn(); //逐渐出现

        if(this.func_id) { //如果之前的3s还没有结束，就清空，重新3s
            clearTimeout(this.func_id);
        }

        this.func_id = setTimeout(function(){
            outer.$history.fadeOut();
            outer.func_id = null; //清空，防止上一个3s还没有结束，随着打开输入框，直接关闭历史记录
        },3000);
    }
}
class GameMap extends AcGameObject {
    constructor(playground) {
        super();
        this.playground = playground;
        this.$canvas = $(`<canvas tabindex=0></canvas>`);
        this.ctx = this.$canvas[0].getContext('2d');
        this.ctx.canvas.width = this.playground.width;
        this.ctx.canvas.height = this.playground.height;
        this.playground.$playground.append(this.$canvas);
    }

    start() {
        this.$canvas.focus();
    }

    resize(){
        this.ctx.canvas.width = this.playground.width;
        this.ctx.canvas.height = this.playground.height;
        this.ctx.fillStyle = "rgba(0, 0, 0, 1)";
        this.ctx.fillRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);  
    }

    update() {
        this.render();
    }

    render() {
        this.ctx.fillStyle = "rgba(0, 0, 0, 0.2)";
        this.ctx.fillRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
    }
}
class NoticeBoard extends AcGameObject {
    constructor(playground) {
        super();

        this.playground = playground;
        this.ctx = this.playground.game_map.ctx;
        this.text = "已就绪：0人";
    }

    start() {
    }

    write(text) {
        this.text = text;
    }

    update() {
        this.render();
    }

    render() {
        this.ctx.font = "20px serif";
        this.ctx.fillStyle = "white";
        this.ctx.textAlign = "center";
        this.ctx.fillText(this.text, this.playground.width / 2, 20);
    }
}

class Particle extends AcGameObject {
    constructor(playground,x,y,radius,vx,vy,color,speed,move_length) {
        super();
        this.playground = playground;
        this.ctx = this.playground.game_map.ctx;
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.vx = vx;
        this.vy = vy;
        this.color = color;
        this.speed = speed;
        this.move_length = move_length;
        this.eps = 0.01;
        this.friction = 0.9;
    }

    start(){

    }

    update() {
        if(this.move_length < this.eps || this.speed < this.eps) {
            this.destroy();
            return false;
        }

        let moved = Math.min(this.move_length,this.speed * this.timedelta / 1000);
        this.x += this.vx * moved;
        this.y += this.vy * moved;

        this.speed *= this.friction;
        this.move_length -= moved;

        this.render();
    }

    render(){
        let scale = this.playground.scale
        this.ctx.beginPath();
        this.ctx.arc(this.x * scale,this.y * scale,this.radius * scale,0,Math.PI * 2,false);
        this.ctx.fillStyle = this.color;
        this.ctx.fill();
    }
}
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
                return true;
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

        this.playground.game_map.$canvas.keydown(function(e) {
            if(e.which === 13){ //enter
                if(outer.playground.mode === "multi mode"){
                    outer.playground.chat_field.show_input();
                    return false;
                }
            } else if(e.which === 27){ //esc
                if(outer.playground.mode === "multi mode"){
                    outer.playground.chat_field.hide_input();
                }
            }

            if(outer.playground.state !== "fighting"){
                return true;
            }

            if (e.which === 81) {  // q
                if(outer.fireball_coldtime > outer.eps){
                    return true;
                }
                outer.cur_skill = "fireball";
                return false;
            } else if(e.which === 87) { //w
                if(outer.iceball_coldtime > outer.eps){
                    return true;
                }
                outer.cur_skill = "iceball";
                return false;
            } else if(e.which === 70){ //f
                if(outer.flash_coldtime > outer.eps){
                    return true;
                }
                outer.cur_skill = "flash";
                return false;
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
class MultiPlayerSocket{
    constructor(playground){
        this.playground = playground;

        this.ws = new WebSocket("wss://www.renyuhui.top/wss/multiplayer/"); //创建连接

        this.start();
    }

    start(){
        this.receive();
    }

    receive(){ //接收后端群发的信息
        let outer = this;

        this.ws.onmessage = function(e){
            let data = JSON.parse(e.data);
            let uuid = data.uuid;

            if(uuid === outer.uuid) return false; //由于最后来的玩家也在组内，所以也会收到自己发的消息，筛除即可

            let event = data.event;
            if(event === "create_player") {
                outer.receive_create_player(uuid,data.username,data.photo);
            } else if(event === "move_to") {
                outer.receive_move_to(uuid,data.tx,data.ty);
            } else if(event === "shoot_ball") {
                outer.receive_shoot_ball(uuid,data.ball_skill,data.tx,data.ty,data.ball_uuid);
            } else if(event === "attack"){
                outer.receive_attack(uuid,data.attackee_uuid,data.x,data.y,data.angle,data.damage,data.ball_uuid);
            } else if(event === "flash"){
                outer.receive_flash(uuid,data.tx,data.ty);
            } else if(event === "message"){
                outer.receive_message(uuid,data.username,data.text);
            }
        }
    }

    send_create_player(username,photo){
        let outer = this;
        this.ws.send(JSON.stringify({
            'event': "create_player",
            'uuid': outer.uuid,
            'username': username,
            'photo': photo,
        }));
    }

    receive_create_player(uuid,username,photo){
        let player = new Player(this.playground,this.playground.width / 2 / this.playground.scale,0.5,0.06,"white",0.15,"enemy",username,photo);
        player.uuid = uuid; //#统一使用第一个创建玩家的uuid
        this.playground.players.push(player);
    }
    send_move_to(tx,ty){
        let outer = this;
        this.ws.send(JSON.stringify({
            'event': "move_to", //事件
            'uuid': outer.uuid, //玩家uuid
            'tx': tx, //要移动的位置
            'ty': ty,
        }));
    }
    receive_move_to(uuid,tx,ty){
        let player = this.get_player(uuid);

        if(player) {
            player.move_to(tx,ty);
        }
    }
    get_player(uuid){
        let players = this.playground.players;

        for(let i = 0;i < players.length;i++){
            let player = players[i];
            if(player.uuid === uuid){
                return player;
            }
        }

        return null;
    }

    send_shoot_ball(ball_skill,tx,ty,ball_uuid){
        let outer = this;
        this.ws.send(JSON.stringify({
            'event': "shoot_ball",
            'uuid': outer.uuid,
            'ball_skill': ball_skill,
            'tx': tx,
            'ty': ty,
            'ball_uuid': ball_uuid,
        }));
    }

    receive_shoot_ball(uuid,ball_skill,tx,ty,ball_uuid){
        let player = this.get_player(uuid);

        if(player){
            let ball = player.shoot_ball(ball_skill,tx,ty);
            ball.uuid = ball_uuid;
        }
    }

    send_attack(attackee_uuid,x,y,angle,damage,ball_uuid){
        let outer = this;
        this.ws.send(JSON.stringify({
            'event': "attack",
            'uuid': outer.uuid,
            'attackee_uuid': attackee_uuid,
            'x': x,
            'y': y,
            'angle': angle,
            'damage': damage,
            'ball_uuid': ball_uuid,
        }));
    }

    receive_attack(uuid,attackee_uuid,x,y,angle,damage,ball_uuid){
        let attacker = this.get_player(uuid);
        let attackee = this.get_player(attackee_uuid);

        if(attacker && attackee) {
            attackee.receive_attack(x,y,angle,damage,ball_uuid,attacker);
        }
    }

    send_flash(tx,ty){
        let outer = this;
        this.ws.send(JSON.stringify({
            'event': "flash", //事件
            'uuid': outer.uuid, //玩家uuid
            'tx': tx, //要移动的位置
            'ty': ty,
        }));
    }

    receive_flash(uuid,tx,ty){
        let player = this.get_player(uuid);
        if(player){
            player.flash(tx,ty);
        }
    }

    send_message(username,text){
        let outer = this;
        this.ws.send(JSON.stringify({
            'event': "message",
            'uuid': outer.uuid,
            'username': username,
            'text': text,
        }));
    }

    receive_message(uuid,username,text){
        this.playground.chat_field.add_message(username,text);
    }
}
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
class AcGamePlayground{
    constructor(root){
        this.root = root;
        this.$playground = $(`<div class="ac-game-playground"></div>`);

        this.hide(); //默认游戏界面是关闭的
        this.root.$ac_game.append(this.$playground);

        this.start();
    }

    get_random_color() {
        let colors = ["blue","red","orange","green","yellow","purple","brown"];
        return colors[Math.floor(Math.random() * 7)];
    }

    start(){ //好习惯，可以把初始化操作写里面
        let outer = this;
        $(window).resize(function(){
            outer.resize();
        });
    }

    resize(){
        this.width = this.$playground.width();
        this.height = this.$playground.height();

        let unit = Math.min(this.width / 16,this.height / 9); //取 以高度的最小单元/以宽度的最小单元的最小值

        //最小单元乘以16，就是宽度；乘以9，就是高度
        this.width = unit * 16;
        this.height = unit * 9;
        this.scale = this.height;//基准，后面以这个为单位，对小球进行等比例放缩

        if(this.game_map){
            this.game_map.resize();
        }
    }

    show(mode){ //打开游戏界面
        let outer = this;
        this.$playground.show();

        this.width = this.$playground.width();
        this.height = this.$playground.height();
        this.game_map = new GameMap(this);

        this.mode = mode;
        this.state = "waiting"; //waiting -> fighting -> over
        this.notice_board = new NoticeBoard(this);
        this.player_count = 0;

        this.resize();


        this.players = [];
        this.players.push(new Player(this,this.width / 2 / this.scale,0.5,0.06,"white",0.15,"me",this.root.settings.username,this.root.settings.photo));

        if(mode === "single mode") {
            for(let i = 0;i < 8;i++)
                this.players.push(new Player(this,this.width * Math.random() / this.scale,Math.random(),0.06,this.get_random_color(),0.15,"robot"));
        } else if(mode === "multi mode") {
            this.chat_field = new ChatField(this);
            this.mps = new MultiPlayerSocket(this);
            this.mps.uuid = this.players[0].uuid;

            this.mps.ws.onopen = function() {
                outer.mps.send_create_player(outer.root.settings.username,outer.root.settings.photo);
            }
        }
    }

    hide(){ //关闭游戏界面
        this.$playground.hide();
    }
}
class Settings{
    constructor(root) {
        if(window.location.host === "app5372.acapp.acwing.com.cn") {
            window.location.replace("https://www.renyuhui.top/"); //如果当前访问链接为acapp的话，那么就跳转到自己的域名
        }

        this.root = root;
        this.platform = "WEB";

        if(this.root.AcWingOS) {
            this.platform = "ACAPP";
        }
        this.username = "";
        this.photo = "";

        this.$settings = $(`
<div class="ac-game-settings">
    <div class="ac-game-settings-login">
        <div class="ac-game-settings-title">
            登录
        </div>
        <div class="ac-game-settings-username">
            <div class="ac-game-settings-item">
                <inpUT TYpe="text" placeholder="用户名">
            </div>
        </div>
        <div class="ac-game-settings-password">
            <div class="ac-game-settings-item">
                <input type="password" placeholder="密码">
            </div>
        </div>
        <div class="ac-game-settings-submit">
            <div class="ac-game-settings-item">
                <button>登录</button>
            </div>
        </div>
        <div class="ac-game-settings-error-message">
        </div>
        <div class="ac-game-settings-option">
            注册
        </div>
        <br>
        <div class="ac-game-settings-third-party-logins">
            <div class="image-wrapper">
                <img width="40" src="https://www.renyuhui.top/static/image/settings/acwing_logo.png" class="acwing-logo">
                <img width="40" src="https://www.renyuhui.top/static/image/settings/qq_logo.png" class="qq-logo">
            </div>
            <div class="text-wrapper">
                <div>第三方一键登录</div>
            </div>
        </div>
    </div>
    <div class="ac-game-settings-register">
        <div class="ac-game-settings-title">
            注册
        </div>
        <div class="ac-game-settings-username">
            <div class="ac-game-settings-item">
                <input type="text" placeholder="用户名">
            </div>
        </div>
        <div class="ac-game-settings-password ac-game-settings-password-first">
            <div class="ac-game-settings-item">
                <input type="password" placeholder="密码">
            </div>
        </div>
        <div class="ac-game-settings-password ac-game-settings-password-second">
            <div class="ac-game-settings-item">
                <input type="password" placeholder="确认密码">
            </div>
        </div>
        <div class="ac-game-settings-submit">
            <div class="ac-game-settings-item">
                <button>注册</button>
            </div>
        </div>
        <div class="ac-game-settings-error-message">
        </div>
        <div class="ac-game-settings-option">
            登录
        </div>
        <br>
        <div class="ac-game-settings-third-party-logins">
            <div class="image-wrapper">
                <img width="30" src="https://app165.acapp.acwing.com.cn/static/image/settings/acwing_logo.png" class="acwing-logo">
                <img width="30" src="https://www.renyuhui.top/static/image/settings/qq_logo.png" class="qq-logo">
            </div>
            <div class="text-wrapper">
                <div>第三方一键登录</div>
            </div>
        </div>
    </div>

</div>
`)
        this.$login = this.$settings.find(".ac-game-settings-login");
        this.$login_username = this.$login.find(".ac-game-settings-username input");
        this.$login_password = this.$login.find(".ac-game-settings-password input");
        this.$login_submit = this.$login.find(".ac-game-settings-submit button");
        this.$login_error_message = this.$login.find(".ac-game-settings-error-message");
        this.$login_register = this.$login.find(".ac-game-settings-option");

        this.$login.hide();

        this.$register = this.$settings.find(".ac-game-settings-register");
        this.$register_username = this.$register.find(".ac-game-settings-username input");
        this.$register_password = this.$register.find(".ac-game-settings-password-first input");
        this.$register_password_confirm = this.$register.find(".ac-game-settings-password-second input")
        this.$register_submit = this.$register.find(".ac-game-settings-submit button");
        this.$register_error_message = this.$register.find(".ac-game-settings-error-message");
        this.$register_login = this.$register.find(".ac-game-settings-option");

        this.$register.hide();

        this.$acwing_login = this.$settings.find(".ac-game-settings-third-party-logins .image-wrapper .acwing-logo");
        this.$qq_login = this.$settings.find(".ac-game-settings-third-party-logins .image-wrapper .qq-logo");


        this.root.$ac_game.append(this.$settings);
        this.start();
    }

    start() {
        if(this.platform === "ACAPP") {
            this.getinfo_acapp();
        } else {
            this.getinfo_web();
            this.add_listening_events(); //监听点击注册、登录事件
        }
    }

    add_listening_events(){
        let outer = this;
        this.add_listening_events_login();
        this.add_listening_events_register();

        this.$acwing_login.click(function(){
            outer.acwing_login();
        });
        this.$qq_login.click(function(){
            outer.qq_login();
        });
    }

    add_listening_events_login(){ //监听登录页面点击注册事件，需要由登录界面变成注册界面
        let outer = this;

        this.$login_register.click(function(){
            outer.register();
        });
        this.$login_submit.click(function(){
            outer.login_on_remote();
        });
    }

    add_listening_events_register(){ //监听注册界面点击登录 事件，需要由注册界面变成登录界面
        let outer = this;

        this.$register_login.click(function(){
            outer.login();
        });
        this.$register_submit.click(function(){
            outer.register_on_remote();
        });
    }

    acwing_login(){
        $.ajax({
            url: "https://www.renyuhui.top/settings/acwing/web/apply_code/",
            type: "GET",
            success: function(resp){
                if(resp.result === "success") {
                    window.location.replace(resp.apply_code_url);
                }
            }
        });
    }

    qq_login(){
        $.ajax({
            url: "https://www.renyuhui.top/settings/qq/apply_code/",
            type: "GET",
            success: function(resp){
                if(resp.result === "success"){
                    window.location.replace(resp.apply_code_url);
                }
            }
        }); 
    }

    login_on_remote() {  // 在远程服务器上登录
        let outer = this;
        let username = this.$login_username.val();
        let password = this.$login_password.val();
        this.$login_error_message.empty();

        $.ajax({
            url: "https://www.renyuhui.top/settings/login/",
            type: "GET",
            data: {
                username: username,
                password: password,
            },
            success: function(resp) {
                if (resp.result === "success") {
                    location.reload();
                } else {
                    outer.$login_error_message.html(resp.result);
                }
            }
        });
    }

    logout_on_remote(){
        if(this.platform === "ACAPP") {
            this.root.AcWingOS.api.window.close();
        } else {

            $.ajax({
                url: "https://www.renyuhui.top/settings/logout/",
                success: function(resp){
                    if(resp.result === "success") {
                        location.reload();
                    }
                }
            });
        }
    }

    register_on_remote(){
        let outer = this;
        let username = this.$register_username.val();
        let password = this.$register_password.val();
        let password_confirm = this.$register_password_confirm.val();

        $.ajax({
            url: "https://www.renyuhui.top/settings/register/",
            type: "GET",
            data: {
                username: username,
                password: password,
                password_confirm: password_confirm,
            },
            success: function(resp){
                if(resp.result === "success"){
                    location.reload();
                } else {
                    outer.$register_error_message.html(resp.result);
                }
            }
        });
    }

    register(){ //注册界面
        this.$login.hide();
        this.$register.show();
    }

    login() { //登录界面
        this.$register.hide();
        this.$login.show();
    }

    acapp_login(appid,redirect_uri,scope,state){
        let outer = this;

        outer.root.AcWingOS.api.oauth2.authorize(appid, redirect_uri, scope, state, function(resp){

            if(resp.result === "success"){
                outer.username = resp.username;
                outer.photo = resp.photo;
                outer.hide();//登录界面关闭
                outer.root.menu.show();//菜单界面打开
            }
        });
    }

    getinfo_acapp(){
        let outer = this;

        $.ajax({
            url: "https://www.renyuhui.top/settings/acwing/acapp/apply_code/",
            type: "GET",
            success: function(resp){
                if(resp.result === "success"){
                    outer.acapp_login(resp.appid, resp.redirect_uri, resp.scope, resp.state);
                }
            }
        });
    }

    getinfo_web() {
        let outer = this;

        $.ajax({
            url: "https://www.renyuhui.top/settings/getinfo/",
            type: "GET",
            data: {
                platform: outer.platform,
            },
            success: function(resp) {
                outer.username = resp.username;
                outer.photo = resp.photo;
                if(resp.result === "success") {
                    outer.hide();
                    outer.root.menu.show();
                } else {
                    outer.login();
                }
            }
        });
    }

    hide(){
        this.$settings.hide();
    }

    show() {
        this.$settings.show();
    }
}
export class AcGame {
    constructor(id,AcWingOS) {
    this.id = id;
    this.$ac_game = $('#' + id);
    this.AcWingOS = AcWingOS;


    this.settings = new Settings(this);
    this.introduce = new AcGameIntroduce(this);
    this.menu = new AcGameMenu(this);
    this.playground = new AcGamePlayground(this);
    }
}
