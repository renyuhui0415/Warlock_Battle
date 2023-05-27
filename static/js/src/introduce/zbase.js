class AcGameIntroduce{
    constructor(root){
        this.root = root;
        this.$introduce = $(`
<div class="ac-game-introduce">
    <div class="ac-game-introduce-container">
        <div class="ac-game-introduce-container-title">Q版球球大作战</div>
            <div class="ac-game-introduce-container-rules">
                <h2>游戏玩法</h2>
                    <ul>
                        <li>玩家通过键盘选择技能，然后通过鼠标进行技能释放、移动角色。</li>
                        <li>q 键选择火球技能，被击中玩家有3%加速效果，cd：3s；</li>
                        <li>w 键选择冰球技能，被击中玩家有15%减速效果，cd：3s；</li>
                        <li>f 键选择闪现技能，可以全局瞬移，cd：5s；</li>
                    </ul>
        </div>
        <div class="ac-game-introduce-container-mode">
            <h2>游戏模式</h2>
                <ul>
                    <li>单人模式：8名人机，会随机移动 + 释放技能，你需要把它们全部击杀才能获得游戏的胜利！！！</li>
                    <li>多人模式：3人一个房间，满3人开始游戏，可以与你的小伙伴们一起同台竞技！！！</li>
                </ul>
        </div>
        <div class="ac-game-introduce-container-return-btn">返回游戏</div>
    </div>
</div>
`);
        this.$introduce.hide();
        this.root.$ac_game.append(this.$introduce);

        this.$return_btn = this.$introduce.find('.ac-game-introduce-container-return-btn');

        this.start();
    }

    start(){
        this.add_listening_events();
    }

    add_listening_events(){
        let outer = this;
        this.$return_btn.click(function(){
            outer.hide();
            outer.root.menu.show();
        });
    }

    show(){
        this.$introduce.show();
    }

    hide(){
        this.$introduce.hide();
    }
}
