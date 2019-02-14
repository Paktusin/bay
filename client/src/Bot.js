import Player from "./Player";

class Bot extends Player {
    constructor(props) {
        super(props);

        setTimeout(this.makeStep.bind(this), 1000)
    }

    makeStep() {

    }
}