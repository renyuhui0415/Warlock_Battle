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
            for(let i = 0;i < 7;i++)
                this.players.push(new Player(this,this.width * Math.random() / this.scale,Math.random(),0.06,this.get_random_color(),0.15,"robot"));
        } else if(mode === "multi mode") {
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
