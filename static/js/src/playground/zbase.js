class AcGamePlayground{
    constructor(root){
        this.root = root;
        this.$playground = $(`<div class="ac-game-playground"></div>`);

        this.hide(); //默认游戏界面是关闭的

        this.start();
    }

    get_random_color() {
        let colors = ["blue","red","orange","green","yellow","purple","brown"];
        return colors[Math.floor(Math.random() * 7)];
    }

    start(){ //好习惯，可以把初始化操作写里面
    }

    show(){ //打开游戏界面
        this.$playground.show();

        this.root.$ac_game.append(this.$playground);
        this.width = this.$playground.width();
        this.height = this.$playground.height();
        this.game_map = new GameMap(this);
        this.players = [];
        this.players.push(new Player(this,this.width * Math.random(),this.height * Math.random(),this.height * 0.06,"white",this.height * 0.15,true));

        for(let i = 0;i < 7;i++)
            this.players.push(new Player(this,this.width * Math.random(),this.height * Math.random(),this.height * 0.06,this.get_random_color(),this.height * 0.15,false));
    }

    hide(){ //关闭游戏界面
        this.$playground.hide();
    }
}
