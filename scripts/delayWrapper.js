class DelayWrapper{
    constructor(delayTime) {
        this.delayTime = +delayTime;
    }

    async delay(response){
        return new Promise(resolve => {
            setTimeout(() => {
                return resolve(response);
            }, this.delayTime);
        });
    }
}
