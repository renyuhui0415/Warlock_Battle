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

    show(){ //打开游戏界面
        this.$playground.show();

        this.resize();

        this.width = this.$playground.width();
        this.height = this.$playground.height();
        this.game_map = new GameMap(this);
        this.players = [];
        this.players.push(new Player(this,this.width * Math.random() / this.scale,Math.random(),0.06,"white",0.15,true));

        for(let i = 0;i < 7;i++)
            this.players.push(new Player(this,this.width * Math.random() / this.scale,Math.random(),0.06,this.get_random_color(),0.15,false));
    }

    hide(){ //关闭游戏界面
        this.$playground.hide();
    }
}
