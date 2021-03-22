class Element {
    constructor(elementId) {
        this.elementId = elementId;
        this.element = undefined;
        this.documentIsReadyEvent = new MyEvent();
    }

    init(){
        this.element = document.getElementById(this.elementId);
    }

    fireDocumentIsReady(){
        this.documentIsReadyEvent.fire(this, {})
    }
}

class UserSelect extends Element{
    constructor(elementId) {
        super(elementId);
    }

    init(){
        super.init();
        this.element.addEventListener(CONSTS.EVENTS.CHANGE, event => {
            const userId = +event.target.options[event.target.selectedIndex].id
            storage.set(CONSTS.STORAGE.KEYS.USER_ID, userId);
        });
    }

    updateSelectUserList(users = []){
        users.forEach(user => {
            addOptionStrToSelectElement(
                this.element,
                user.name,
                { id: user.id }
            );
        });
    }

    updateSelectedValueFromExistsStorage(){
        const userId = storage.get(CONSTS.STORAGE.KEYS.USER_ID);
        const selectedIndex = +[...this.element.options].findIndex(op => op.id === userId);
        this.element.selectedIndex = selectedIndex > -1 ? selectedIndex : 0;
    }
}

class PlaylistInput extends Element{
    constructor(elementId) {
        super(elementId);
        this.itemsElement = undefined;
        this.elementTitle = undefined;
        this.elementTime = undefined;
        this.elementTopNum = undefined;
        this.elementTopItems = undefined;
    }

    init(){
        super.init();
        this.itemsElement = document.getElementById(CONSTS.IDS.PLAYLIST_ITEMS);
        this.elementTitle = document.getElementById(CONSTS.IDS.SEARCH_TITLE);
        this.elementTime = document.getElementById(CONSTS.IDS.SEARCH_TIME);
        this.elementTopNum = document.getElementById(CONSTS.IDS.TOP_AMOUNT);
        this.elementTopItems = document.getElementById(CONSTS.IDS.TOP_ITEMS);
        this.element.addEventListener(CONSTS.EVENTS.CHANGE, event => {
            storage.set(CONSTS.STORAGE.KEYS.PLAYLIST_TITLE, event.target.value);
        });
    }

    updatePlaylistByUserList(playlistByUser = { videos: [], id: undefined}){
        this.itemsElement.innerHTML = ""; // Clear playlist row items
        console.debug('LOADED VIDEOS LIST: ', playlistByUser.videos);
        storage.set(CONSTS.STORAGE.KEYS.PLAYLIST_DATA, JSON.stringify(playlistByUser));

        const items = playlistByUser.videos.map(record =>
            createItemPlaylistRecordToSelectedElement(this.itemsElement, record)
        );
        this.itemsElement.append(...items);

        this.updateSummeryTitle();
        this.updateTopTopic();
    }

    updateSelectedValueFromExistsStorage(){
        this.element.value = storage.get(CONSTS.STORAGE.KEYS.PLAYLIST_TITLE) || '';
    }

    updateSummeryTitle(){
        this.elementTitle.innerText = storage.get(CONSTS.STORAGE.KEYS.PLAYLIST_TITLE) || '';
        const playlistDataStr = storage.get(CONSTS.STORAGE.KEYS.PLAYLIST_DATA) || '{}';
        const playListData = JSON.parse(playlistDataStr);
        const minutes = playListData.videos.reduce((minutes, {time}) => {
            const m = getTimeInMinutes(time);
            return minutes + m;
        }, 0);

        this.elementTime.innerText = `${Math.floor(minutes / 60)} hours, ${minutes % 60} minutes`;
    }

    calculateTopTopic(amount = CONSTS.TOPIC.AMOUNT){
        const playlistDataStr = storage.get(CONSTS.STORAGE.KEYS.PLAYLIST_DATA) || '{}';
        const playListData = JSON.parse(playlistDataStr);
        return playListData.videos
            .sort((pl1, pl2) => getTimeInMinutes(pl2.time) - getTimeInMinutes(pl1.time))
            .slice(0, amount);
    }

    updateTopTopic(){
        const tops = this.calculateTopTopic();
        const totalBars = tops.length;
        this.elementTopNum.innerText = totalBars;

        this.elementTopItems.innerHTML = ""; // Clear top bar items

        console.debug('TOPS VIDEOS LIST: ', tops);

        const totalMinutes = tops.reduce((minutes, {time}) => minutes + getTimeInMinutes(time), 0);

        const items = tops.map(record =>
            createItemTopTopicRecordToSelectedElement(this.elementTopItems, record, totalMinutes, totalBars)
        );

        this.elementTopItems.append(...items);
    }
}

class SearchButton extends Element{
    constructor(elementId) {
        super(elementId);
    }

    init(){
        super.init();
        this.element.addEventListener(CONSTS.EVENTS.CLICK, this.search.bind(this))
    }

    search(customDelay = -1){
        this.element.disabled = true;
        const query = {
            userId: +storage.get(CONSTS.STORAGE.KEYS.USER_ID),
            playlistTitle: storage.get(CONSTS.STORAGE.KEYS.PLAYLIST_TITLE)
        };
        console.debug(`SEARCH BY QUERY: ${JSON.stringify(query, null, 4)}`);

        Service.searchByQuery(query, customDelay)
            .then(async (playlistByUser) => {
                playlistInput.updatePlaylistByUserList(playlistByUser);
            })
            .finally(() => {
                this.element.disabled = false;
            })
    }
}

class Loader extends Element{
    constructor(elementId) {
        super(elementId);
        this.requestToServerEvent = new MyEvent();
    }

    init(){
        super.init();
    }

    updateDisplayStyle(style){
        if(this.element){
            this.element.style.display = style;
        }
    }

    show(){
        this.requestToServerEvent.fire(this, 'flex');
    }

    hide(){
        this.requestToServerEvent.fire(this, 'none');
    }
}
