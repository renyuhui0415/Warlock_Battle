export class AcGame {
    constructor(id,AcWingOS) {
    this.id = id;
    this.$ac_game = $('#' + id);
    this.AcWingOS = AcWingOS;


    this.settings = new Settings(this);
    this.introduce = new AcGameIntroduce(this);
    this.menu = new AcGameMenu(this);
    this.playground = new AcGamePlayground(this);
    }
}
