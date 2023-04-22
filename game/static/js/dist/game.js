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
class AcGame {
    constructor(id) {
    this.id = id;
    this.$ac_game = $('#' + id);
    this.menu = new AcGameMenu(this);
    this.playground = new AcGamePlayground(this);
    }
}
