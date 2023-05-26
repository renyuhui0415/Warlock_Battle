class Settings{
    constructor(root) {
        if(window.location.host === "app5372.acapp.acwing.com.cn") {
            window.location.replace("https://www.renyuhui.top/"); //如果当前访问链接为acapp的话，那么就跳转到自己的域名
        }

        this.root = root;
        this.platform = "WEB";

        if(this.root.AcWingOS) {
            this.platform = "ACAPP";
        }
        this.username = "";
        this.photo = "";

        this.$settings = $(`
<div class="ac-game-settings">
    <div class="ac-game-settings-login">
        <div class="ac-game-settings-title">
            登录
        </div>
        <div class="ac-game-settings-username">
            <div class="ac-game-settings-item">
                <inpUT TYpe="text" placeholder="用户名">
            </div>
        </div>
        <div class="ac-game-settings-password">
            <div class="ac-game-settings-item">
                <input type="password" placeholder="密码">
            </div>
        </div>
        <div class="ac-game-settings-submit">
            <div class="ac-game-settings-item">
                <button>登录</button>
            </div>
        </div>
        <div class="ac-game-settings-error-message">
        </div>
        <div class="ac-game-settings-option">
            注册
        </div>
        <br>
        <div class="ac-game-settings-third-party-logins">
            <div class="image-wrapper">
                <img width="40" src="https://www.renyuhui.top/static/image/settings/acwing_logo.png" class="acwing-logo">
                <img width="40" src="https://www.renyuhui.top/static/image/settings/qq_logo.png" class="qq-logo">
            </div>
            <div class="text-wrapper">
                <div>第三方一键登录</div>
            </div>
        </div>
    </div>
    <div class="ac-game-settings-register">
        <div class="ac-game-settings-title">
            注册
        </div>
        <div class="ac-game-settings-username">
            <div class="ac-game-settings-item">
                <input type="text" placeholder="用户名">
            </div>
        </div>
        <div class="ac-game-settings-password ac-game-settings-password-first">
            <div class="ac-game-settings-item">
                <input type="password" placeholder="密码">
            </div>
        </div>
        <div class="ac-game-settings-password ac-game-settings-password-second">
            <div class="ac-game-settings-item">
                <input type="password" placeholder="确认密码">
            </div>
        </div>
        <div class="ac-game-settings-submit">
            <div class="ac-game-settings-item">
                <button>注册</button>
            </div>
        </div>
        <div class="ac-game-settings-error-message">
        </div>
        <div class="ac-game-settings-option">
            登录
        </div>
        <br>
        <div class="ac-game-settings-third-party-logins">
            <div class="image-wrapper">
                <img width="30" src="https://app165.acapp.acwing.com.cn/static/image/settings/acwing_logo.png" class="acwing-logo">
                <img width="30" src="https://www.renyuhui.top/static/image/settings/qq_logo.png" class="qq-logo">
            </div>
            <div class="text-wrapper">
                <div>第三方一键登录</div>
            </div>
        </div>
    </div>

</div>
`)
        this.$login = this.$settings.find(".ac-game-settings-login");
        this.$login_username = this.$login.find(".ac-game-settings-username input");
        this.$login_password = this.$login.find(".ac-game-settings-password input");
        this.$login_submit = this.$login.find(".ac-game-settings-submit button");
        this.$login_error_message = this.$login.find(".ac-game-settings-error-message");
        this.$login_register = this.$login.find(".ac-game-settings-option");

        this.$login.hide();

        this.$register = this.$settings.find(".ac-game-settings-register");
        this.$register_username = this.$register.find(".ac-game-settings-username input");
        this.$register_password = this.$register.find(".ac-game-settings-password-first input");
        this.$register_password_confirm = this.$register.find(".ac-game-settings-password-second input")
        this.$register_submit = this.$register.find(".ac-game-settings-submit button");
        this.$register_error_message = this.$register.find(".ac-game-settings-error-message");
        this.$register_login = this.$register.find(".ac-game-settings-option");

        this.$register.hide();

        this.$acwing_login = this.$settings.find(".ac-game-settings-third-party-logins .image-wrapper .acwing-logo");
        this.$qq_login = this.$settings.find(".ac-game-settings-third-party-logins .image-wrapper .qq-logo");


        this.root.$ac_game.append(this.$settings);
        this.start();
    }

    start() {
        if(this.platform === "ACAPP") {
            this.getinfo_acapp();
        } else {
            this.getinfo_web();
            this.add_listening_events(); //监听点击注册、登录事件
        }
    }

    add_listening_events(){
        let outer = this;
        this.add_listening_events_login();
        this.add_listening_events_register();

        this.$acwing_login.click(function(){
            outer.acwing_login();
        });
        this.$qq_login.click(function(){
            outer.qq_login();
        });
    }

    add_listening_events_login(){ //监听登录页面点击注册事件，需要由登录界面变成注册界面
        let outer = this;

        this.$login_register.click(function(){
            outer.register();
        });
        this.$login_submit.click(function(){
            outer.login_on_remote();
        });
    }

    add_listening_events_register(){ //监听注册界面点击登录 事件，需要由注册界面变成登录界面
        let outer = this;

        this.$register_login.click(function(){
            outer.login();
        });
        this.$register_submit.click(function(){
            outer.register_on_remote();
        });
    }

    acwing_login(){
        $.ajax({
            url: "https://www.renyuhui.top/settings/acwing/web/apply_code/",
            type: "GET",
            success: function(resp){
                if(resp.result === "success") {
                    window.location.replace(resp.apply_code_url);
                }
            }
        });
    }

    qq_login(){
        $.ajax({
            url: "https://www.renyuhui.top/settings/qq/apply_code/",
            type: "GET",
            success: function(resp){
                if(resp.result === "success"){
                    window.location.replace(resp.apply_code_url);
                }
            }
        }); 
    }

    login_on_remote() {  // 在远程服务器上登录
        let outer = this;
        let username = this.$login_username.val();
        let password = this.$login_password.val();
        this.$login_error_message.empty();

        $.ajax({
            url: "https://www.renyuhui.top/settings/login/",
            type: "GET",
            data: {
                username: username,
                password: password,
            },
            success: function(resp) {
                if (resp.result === "success") {
                    location.reload();
                } else {
                    outer.$login_error_message.html(resp.result);
                }
            }
        });
    }

    logout_on_remote(){
        if(this.platform === "ACAPP") {
            this.root.AcWingOS.api.window.close();
        } else {

            $.ajax({
                url: "https://www.renyuhui.top/settings/logout/",
                success: function(resp){
                    if(resp.result === "success") {
                        location.reload();
                    }
                }
            });
        }
    }

    register_on_remote(){
        let outer = this;
        let username = this.$register_username.val();
        let password = this.$register_password.val();
        let password_confirm = this.$register_password_confirm.val();

        $.ajax({
            url: "https://www.renyuhui.top/settings/register/",
            type: "GET",
            data: {
                username: username,
                password: password,
                password_confirm: password_confirm,
            },
            success: function(resp){
                if(resp.result === "success"){
                    location.reload();
                } else {
                    outer.$register_error_message.html(resp.result);
                }
            }
        });
    }

    register(){ //注册界面
        this.$login.hide();
        this.$register.show();
    }

    login() { //登录界面
        this.$register.hide();
        this.$login.show();
    }

    acapp_login(appid,redirect_uri,scope,state){
        let outer = this;

        outer.root.AcWingOS.api.oauth2.authorize(appid, redirect_uri, scope, state, function(resp){

            if(resp.result === "success"){
                outer.username = resp.username;
                outer.photo = resp.photo;
                outer.hide();//登录界面关闭
                outer.root.menu.show();//菜单界面打开
            }
        });
    }

    getinfo_acapp(){
        let outer = this;

        $.ajax({
            url: "https://www.renyuhui.top/settings/acwing/acapp/apply_code/",
            type: "GET",
            success: function(resp){
                if(resp.result === "success"){
                    outer.acapp_login(resp.appid, resp.redirect_uri, resp.scope, resp.state);
                }
            }
        });
    }

    getinfo_web() {
        let outer = this;

        $.ajax({
            url: "https://www.renyuhui.top/settings/getinfo/",
            type: "GET",
            data: {
                platform: outer.platform,
            },
            success: function(resp) {
                outer.user = resp.user;
                outer.photo = resp.photo;
                if(resp.result === "success") {
                    outer.hide();
                    outer.root.menu.show();
                } else {
                    outer.login();
                }
            }
        });
    }

    hide(){
        this.$settings.hide();
    }

    show() {
        this.$settings.show();
    }
}
