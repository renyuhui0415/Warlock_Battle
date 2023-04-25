class AcGameMenu{
    constructor(root){
        this.root = root;
        this.$menu = $(`
<div class="ac-game-menu">
    <div class="ac-game-menu-field">
        <div class="ac-game-menu-field-item ac-game-menu-field-item-single-mode">
            单人模式
        </div>
        <br>
        <div class="ac-game-menu-field-item ac-game-menu-field-item-multi-mode">
            多人模式
        </div>
        <br>
        <div class="ac-game-menu-field-item ac-game-menu-field-item-settings">
            设置
        </div>
    </div>
</div>
`);
    this.root.$ac_game.append(this.$menu);

    this.$single_mode = this.$menu.find('.ac-game-menu-field-item-single-mode');
    this.$multi_mode = this.$menu.find('.ac-game-menu-field-item-multi-mode');
    this.$settings = this.$menu.find('.ac-game-menu-field-item-settings');

    this.start();
    }
    start() {
        this.add_listening_events();
    }

    add_listening_events() {
        let outer = this;
        this.$single_mode.click(function(){
            outer.hide();
            outer.root.playground.show();
        });
        this.$multi_mode.click(function(){
            console.log("click multi mode");
        });
        this.$settings.click(function(){
            console.log("click settings");
        });
    }

    show(){ //打开菜单界面
        this.$menu.show();
    }

    hide(){ //关闭菜单界面
        this.$menu.hide();
    }

}
let AC_GAME_OBJECTS = []; //把所有创建的物体添加到数组

class AcGameObject{
    constructor(){
        AC_GAME_OBJECTS.push(this);

        this.has_called_start = false; //是否执行过start函数
        this.timedelta = 0; //当前帧距离上一帧的时间间距
    }

    start(){ //只会在第一帧执行

    }

    update(){ //每一帧都执行
    
    }
    
    on_destroy(){ //删除前执行一次

    }
    
    destroy(){ //删除该物体
        this.on_destroy();

        for(let i = 0;i < AC_GAME_OBJECTS.length;i++){
            if(AC_GAME_OBJECTS[i] === this){ //找到需要删除的问题，进行删除
                AC_GAME_OBJECTS.splice(i,1); //函数为从下标为 i 的删除1个元素
                break;
            }
        }
    }
}

let last_timestamp; //上一帧的时间戳
let AC_GAME_ANIMATION = function(timestamp){ //timestamp为当前时间戳
    for(let i = 0;i < AC_GAME_OBJECTS.length;i++){
        let obj = AC_GAME_OBJECTS[i];
        if(!obj.has_called_start){ //没有执行过start函数，就执行一下，标记为已执行
            obj.start();
            obj.has_called_start = true;
        }
        else{ //执行过，就调用 update函数
            obj.timedelta = timestamp - last_timestamp; //时间间距
            obj.update();
        }
    }
    
    last_timestamp = timestamp; //更新上一帧的时间戳
    requestAnimationFrame(AC_GAME_ANIMATION);
}

requestAnimationFrame(AC_GAME_ANIMATION);
class GameMap extends AcGameObject {
    constructor(playground){
        super();
        this.playground = playground;
        this.$canvas = $(`<canvas></convas>`);
        this.ctx = this.$canvas[0].getContext('2d');
        this.ctx.canvas.width = this.playground.width;
        this.ctx.canvas.height = this.playground.height;
        this.playground.$playground.append(this.$canvas);
    }

    start(){

    }

    update(){
        this.render();
    }
    render(){
        this.ctx.fillStyle = "rgba(0,0,0,0.2)";
        this.ctx.fillRect(0,0,this.ctx.canvas.width,this.ctx.canvas.height);
    }

}
class Player extends AcGameObject{
    constructor(playground,x,y,radius,color,speed,is_me) { //参数为：游戏界面、（x，y）为自身坐标、小球半径、颜色、速度、是否为自己
        super(); //调用基类方法，把自己添加到物体内
        //记录参数
        this.playground = playground;
        this.ctx = this.playground.game_map.ctx;
        this.x = x;
        this.y = y;
        this.vx = 0;
        this.vy = 0;
        this.move_length = 0; //需要移动的直线距离

        this.radius = radius;
        this.color = color;
        this.speed = speed;
        this.is_me = is_me;
        this.eps = 0.1; //误差
        this.cur_skill = null; //是否选择技能
    }

    start(){ //第一帧执行
        if(this.is_me){
            this.add_listening_events(); //监听事件
        }
    }

    add_listening_events(){
        let outer = this; //保存this，后面this不一样
        this.playground.game_map.$canvas.on("contextmenu",function(){
            return false; //使右键失效
        });//鼠标右键失效
        this.playground.game_map.$canvas.mousedown(function(e){
            if(e.which === 3){ //如果点击鼠标右键，就调用移动函数
                outer.move_to(e.clientX,e.clientY);
            }
            else if(e.which === 1){
                if(outer.cur_skill === "fireball"){
                    outer.shoot_fireball(e.clientX,e.clientY);
                }
            }
            outer.cur_skill = null;
        });

        $(window).keydown(function(e){
            if(e.which === 81){ //q键 表示选择火球技能
                outer.cur_skill = "fireball";
                return false;
            }
        });
    }
    
    shoot_fireball(tx, ty) {
        // 确定火球的参数
        let x = this.x, y = this.y; // 火球发射点就是当前玩家的位置
        let radius = this.playground.height * 0.01;
        let angle = Math.atan2(ty - this.y, tx - this.x);
        let vx = Math.cos(angle), vy = Math.sin(angle);
        let color = "orange";
        let speed = this.playground.height * 0.5;
        let move_length = this.playground.height * 1.0;
        //let damage = this.playground.height * 0.01;
        //new FireBall(this.playground, this, x, y, radius, vx, vy, color, speed, move_length, damage);
          new FireBall(this.playground,this,x,y,radius,vx,vy,color,speed,move_length);
}

    get_dist(x1,y1,x2,y2){ //求两点直线距离
        let dx = x1 - x2;
        let dy = y1 - y2;
        return Math.sqrt(dx * dx + dy * dy);
    }

    move_to(tx, ty) { 
        this.move_length = this.get_dist(this.x, this.y, tx, ty); //得到两点直线距离
        let angle = Math.atan2(ty - this.y, tx - this.x); //角度
        this.vx = Math.cos(angle); // x方向的向量
        this.vy = Math.sin(angle); // y方向的向量
    }


    update(){ //每一帧都执行
        if(this.move_length < this.eps){ //小于误差的话，默认到达了
            this.move_length = 0; //更新需要移动的直线距离、向量
            this.vx = this.vy = 0;
        } else {
            let moved = Math.min(this.move_length,this.speed * this.timedelta / 1000); //this.timedelta 是秒，需要转换为毫秒，速度 * 时间等于直线距离
            this.x += this.vx * moved; //x轴的距离
            this.y += this.vy * moved; //y轴的距离
            this.move_length -= moved; //更新需要走的直线距离
        }
        this.render();
    }

    render(){ //画圆并渲染
            this.ctx.beginPath();
            this.ctx.arc(this.x,this.y,this.radius,0,Math.PI * 2,false);
            this.ctx.fillStyle = this.color;
            this.ctx.fill();
            }
}
class FireBall extends AcGameObject{
    constructor(playground,player,x,y,radius,vx,vy,color,speed,move_length){
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
        this.eps = 0.1;
    }

    start(){

    }

    update(){
        if(this.move_length < this.eps) {
            this.destroy();
            return false;
        }

        let moved = Math.min(this.move_length,this.speed * this.timedelta / 1000);
        this.x += this.vx * moved;
        this.y += this.vy * moved;
        this.move_length -= moved;

        this.render();
    }

    render(){
        this.ctx.beginPath();
        this.ctx.arc(this.x,this.y,this.radius,0,Math.PI * 2,false);
        this.ctx.fillStyle = this.color;
        this.ctx.fill();
    }
}
class AcGamePlayground{
    constructor(root){
        this.root = root;
        this.$playground = $(`<div class="ac-game-playground"></div>`);

        //this.hide(); //默认游戏界面是关闭的
        this.root.$ac_game.append(this.$playground);
        this.width = this.$playground.width();
        this.height = this.$playground.height();
        this.game_map = new GameMap(this);
        this.players = [];
        this.players.push(new Player(this,this.width / 2,this.height / 2,this.height * 0.05,"white",this.height * 0.15,true));


        this.start();
    }

    start(){ //好习惯，可以把初始化操作写里面
    }

    show(){ //打开游戏界面
        this.$playground.show();
    }

    hide(){ //关闭游戏界面
        this.$playground.hide();
    }
}
export class AcGame {
    constructor(id) {
    this.id = id;
    this.$ac_game = $('#' + id);
    // this.menu = new AcGameMenu(this);
    this.playground = new AcGamePlayground(this);
    }
}
