/**
 * Singleton
 */
class Server{
    constructor({users, playlists}) {
        if(this.constructor.instance){
            return this.constructor.instance;
        }
        this.constructor.instance = this;

        this.users = users;
        this.playlists = playlists;
    }

    getUsers(){
        return this.users.slice(0);
    }

    getPlaylistByUserId(userId, subPlaylistTitle = ''){
        const selectedUser = this.getUserById(userId) || {};
        const { playlistID } = selectedUser;
        const playlist = {
            ...this.playlists.find(pl => pl.id === playlistID),
        };

        if(subPlaylistTitle.length){
            playlist.videos = [...playlist.videos].filter(
                ({title}) => title.toLowerCase().includes(
                    subPlaylistTitle.toLowerCase()
                )
            );
        }
        return playlist;
    }

    getUserById(userId){
        return this.users.find(user => user.id === userId);
    }
}
