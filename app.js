const server = new Server({users: USERS, playlists: PLAYLISTS});
const wrapper = new DelayWrapper(CONSTS.CONFIG.DELAY);
const storage = new PersistentStorage();

const userSelect = new UserSelect(CONSTS.IDS.SELECT_USERS);
const playlistInput = new PlaylistInput(CONSTS.IDS.TOPIC_NAME_INPUT);
const searchBtn = new SearchButton(CONSTS.IDS.SEARCH_BTN);
const loader = new Loader(CONSTS.IDS.LOADER);

const userHandlerIndex = userSelect.documentIsReadyEvent.subscribe((sender) => {
    sender.documentIsReadyEvent.unsubscribe(userHandlerIndex);
    sender.init();

    // Fetching user list and update the user select options
    Service.updateUserList()
        .then(async userList => {
            sender.updateSelectUserList(userList);
        })
        .then(async () => {
            sender.updateSelectedValueFromExistsStorage();
        })
        .then(async () => {
            searchBtn.search(0);
        })
});

const playlistHandlerIndex = playlistInput.documentIsReadyEvent.subscribe((sender) => {
    sender.documentIsReadyEvent.unsubscribe(playlistHandlerIndex);
    sender.init();
    sender.updateSelectedValueFromExistsStorage();
});

const searchHandlerIndex = searchBtn.documentIsReadyEvent.subscribe((sender) => {
    sender.documentIsReadyEvent.unsubscribe(searchHandlerIndex);
    sender.init();
});

const loaderHandlerIndex = loader.documentIsReadyEvent.subscribe((sender) => {
    sender.documentIsReadyEvent.unsubscribe(loaderHandlerIndex);
    sender.init();
});

loader.requestToServerEvent.subscribe((sender, args) => {
    sender.updateDisplayStyle(args);
});

const readyStateCheckInterval = setInterval(function() {
    if (document.readyState === CONSTS.DOCUMENT_STATUS.READY) {
        clearInterval(readyStateCheckInterval);
        console.debug('DOCUMENT IS READY');

        userSelect.fireDocumentIsReady();
        playlistInput.fireDocumentIsReady();
        searchBtn.fireDocumentIsReady();
        loader.fireDocumentIsReady();
    }
}, 10);
