class MultiPlayerSocket{
    constructor(playground){
        this.playground = playground;

        this.ws = new WebSocket("wss://www.renyuhui.top/wss/multiplayer/"); //创建连接

        this.start();
    }

    start(){
        this.receive();
    }

    receive(){ //接收后端群发的信息
        let outer = this;

        this.ws.onmessage = function(e){
            let data = JSON.parse(e.data);
            let uuid = data.uuid;

            if(uuid === outer.uuid) return false; //由于最后来的玩家也在组内，所以也会收到自己发的消息，筛除即可

            let event = data.event;
            if(event === "create_player") {
                outer.receive_create_player(uuid,data.username,data.photo);
            }
        }
    }

    send_create_player(username,photo){
        let outer = this;
        this.ws.send(JSON.stringify({
            'event': "create_player",
            'uuid': outer.uuid,
            'username': username,
            'photo': photo,
        }));
    }

    receive_create_player(uuid,username,photo){
        let player = new Player(this.playground,this.playground.width * Math.random() / this.playground.scale,Math.random(),0.06,"white",0.15,"enemy",username,photo)
        player.uuid = uuid; //#统一使用第一个创建玩家的uuid
        this.playground.players.push(player);
    }
}
