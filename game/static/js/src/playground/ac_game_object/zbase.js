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
