"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const MyStore_1 = require("./MyStore");
class User {
    constructor(alias, roomId, user_id) {
        this.alias = alias;
        this.roomId = roomId;
        this.user_id = user_id;
    }
    save(user_id) {
        this.user_id = user_id;
        MyStore_1.store.users.push(this);
    }
    static get(user_id) {
        for (let i = 0; i < MyStore_1.store.users.length; i++) {
            const user = MyStore_1.store.users[i];
            if (user.user_id === user_id) {
                return user;
            }
        }
    }
    static delete(user_id) {
        for (let i = 0; i < MyStore_1.store.users.length; i++) {
            const user = MyStore_1.store.users[i];
            if (user.user_id === user_id) {
                MyStore_1.store.users.splice(i, 1);
                console.log(MyStore_1.store.users);
                return true;
            }
            else {
                return false;
            }
        }
    }
}
exports.User = User;
