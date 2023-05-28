class ChatField{
    constructor(playground){
        this.playground = playground;

        this.$history = $(`<div class=ac-game-chat-field-history>历史记录</div>`);
        this.$input = $(`<input type="text" placeholder="问候别人,enter发送消息 (•̀ᴗ• )" class=ac-game-chat-field-input>`);

        this.$history.hide();
        this.$input.hide();

        this.func_id = null;

        this.playground.$playground.append(this.$history);
        this.playground.$playground.append(this.$input);

        this.start();
    }

    start(){
        this.add_listening_events();
    }

    add_listening_events(){
        let outer = this;

        this.$input.keydown(function(e){
            if(e.which === 27){ // esc
                outer.hide_input();
                return false;
            } else if(e.which === 13){ //enter
                let username = outer.playground.root.settings.username; //用户名
                let text = outer.$input.val(); //消息
                if(text){
                    outer.$input.val(""); //清空输入框
                    outer.add_message(username,text); //添加消息
                    outer.playground.mps.send_message(username,text);
                }
            }
        });
    }

    show_input(){ //打开输入框
        this.$input.show();
        this.$input.focus();
    }

    render_message(message){ 
        return $(`<div>${message}</div>`)
    }

    add_message(username,text){ //添加消息
        this.show_history();
        let message = `[${username}]${text}`; //消息内容
        this.$history.append(this.render_message(message)); //将渲染后的结果添加到history里面
        this.$history.scrollTop(this.$history[0].scrollHeight); //将滚动条移到最下面

    }

    hide_input(){ //收起输入框
        this.$input.hide();
        this.playground.game_map.$canvas.focus();
    }

    show_history(){ //打开历史记录
        let outer = this;

        this.$history.fadeIn(); //逐渐出现

        if(this.func_id) { //如果之前的3s还没有结束，就清空，重新3s
            clearTimeout(this.func_id);
        }

        this.func_id = setTimeout(function(){
            outer.$history.fadeOut();
            outer.func_id = null; //清空，防止上一个3s还没有结束，随着打开输入框，直接关闭历史记录
        },3000);
    }
}
