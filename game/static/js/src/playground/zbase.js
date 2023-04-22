class AcGamePlayground{
    constructor(root){
        this.root = root;
        this.$playground = $(`<dev> 游戏界面 </dev>`);

        this.hide(); //默认游戏界面是关闭的
        this.root.$ac_game.append(this.$playground);

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
