class GameOver extends AcGameObject{
    constructor(playground,mode){
        super();
        this.playground = playground;
        this.mode = mode;
        this.state = null;  // win: 胜利，lose：失败

        this.$game_over = $(`
            <div class="game-over-layer">
                <div class="game-over-container">
                    <div class="game-over-title">游戏结束</div>
                    <div class="game-over-message"></div>
                    <div class="game-over-buttons">
                        <button class="restart-button">重新开始</button>
                        <button class="menu-button">返回菜单</button>
                    </div>
                </div>
            </div>
        `);

        this.$game_over.hide();

        this.playground.$playground.append(this.$game_over);
        this.game_over_message = this.$game_over.find('.game-over-message');
        this.$restart = this.$game_over.find('.restart-button');
        this.$return_menu = this.$game_over.find('.menu-button');

        this.start();
    }

    start(){
        this.add_listening_events();
    }

    add_listening_events(){
        let outer = this;
        this.$restart.click(function(){
            outer.hide(); //关闭结束弹窗
            outer.playground.hide(); //将游戏界面关闭
            outer.playground.show(outer.mode); //重新打开游戏界面
        });

        this.$return_menu.click(function(){
            outer.hide(); //关闭结束弹窗
            outer.playground.hide(); //关闭游戏界面
            outer.playground.root.menu. show(); //打开菜单界面
        });
    }

    win(){
        this.state = "win";
        this.game_over_message.html('赢了，你真帅！！！');
        this.show();
    }

    lose(){
        this.state = "lose";
        this.game_over_message.html('输了，你真菜！！！');
        this.show();
    }

    show(){
        this.$game_over.show();
    }

    hide(){
        this.$game_over.hide();
    }
}

