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
