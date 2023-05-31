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

    create_uuid() {
        let res = "";
        for (let i = 0; i < 8; i ++ ) {
            let x = parseInt(Math.floor(Math.random() * 10));  // 返回[0, 1)之间的数
            res += x;
        }
        return res;
    }

    start() {
        let outer = this;
        let uuid = this.create_uuid();
        $(window).on(`resize.${uuid}`, function() { //监听uuid对应的resize函数
            outer.resize();
        });

        if (this.root.AcWingOS) {
            this.root.AcWingOS.api.window.on_close(function() { //关闭之前移除uuid对应的resize
                $(window).off(`resize.${uuid}`);
            });
        }
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
            for(let i = 0;i < 8;i++) {
                this.players.push(new Player(this,this.width * Math.random() / this.scale,Math.random(),0.06,this.get_random_color(),0.15,"robot"));
            }

            this.game_over = new GameOver(this,"single mode");
        } else if(mode === "multi mode") {
            this.chat_field = new ChatField(this);
            this.game_over = new GameOver(this,"multi mode");
            this.mps = new MultiPlayerSocket(this);
            this.mps.uuid = this.players[0].uuid;

            this.mps.ws.onopen = function() {
                outer.mps.send_create_player(outer.root.settings.username,outer.root.settings.photo);
            }
        }
    }

    hide(){ //关闭游戏界面
        // 由于AcGameObject是所有窗口共用的基类，如果直接清空数组，会导致其他游戏窗口被清空，所有手动删除数组元素
        //删除玩家和释放的球类技能
        while(this.players && this.players.length > 0 ){
            for(let i = 0;i < this.players.length;i++){
                let now_player = this.players[i];
                if(now_player.balls && now_player.balls.length > 0){
                    for(let j = 0;j < now_player.balls.length;j++){
                        now_player.balls[j].destroy();
                    }
                }
                now_player.destroy();
            }
        }

        //删除地图
        if (this.game_map) {
            this.game_map.destroy();
            this.game_map = null;
        }

        //删除提示框
        if (this.notice_board) {
            this.notice_board.destroy();
            this.notice_board = null;
        }

        //删除游戏结束弹窗
        if (this.game_over) {
            this.game_over.destroy();
            this.game_over = null;
        }

        this.$playground.empty(); //清空html对象

        this.$playground.hide();
    }
}
