import { vscoFollower, storage } from './services';

export default class Actions{

    static searchUsersAndFollow(query, interval){
        const progress = vscoFollower.followSearchResult(query, interval);
        progress.on('data', username => {
            storage.db.delete('followed_users', { username }).then(() => {
                storage.db.insert('followed_users', { username });
            })
        });
        return progress;
    }

}