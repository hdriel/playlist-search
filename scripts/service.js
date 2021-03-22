class Service {
    constructor() {
        throw 'abstract';
    }

    static updateUserList(){
        loader.show();
        return new Promise(resolve => {
            wrapper.delay(server.getUsers())
                .then(userList => {
                    console.debug('FETCHED USER LIST: ', userList);
                    loader.hide();
                    resolve(userList);
                });
        });
    }

    static searchByQuery(query, customDelay){
        loader.show();
        return new Promise(resolve => {
            let delayWrapper = wrapper;
            if(customDelay >= 0){
                delayWrapper = new DelayWrapper(customDelay);
            }

            const { userId, playlistTitle } = query;
            if(userId){
                delayWrapper.delay(server.getPlaylistByUserId(userId, playlistTitle || ''))
                .then(playlistByUser => {
                    loader.hide();
                    return resolve(playlistByUser);
                });
            }
            else{
                loader.hide();
                return resolve({});
            }
        })
    }
}
