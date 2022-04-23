import { store } from "./MyStore";

export class User {
  constructor(public alias: string, public roomId: string, public user_id?: string) {}

  public save(user_id: string) {
    this.user_id = user_id;
    store.users.push(this);
  }
  public static get(user_id: string) {
    for (let i = 0; i < store.users.length; i++) {
      const user = store.users[i];
      if (user.user_id === user_id) {
        return user;
      }
    }
  }
  public static delete(user_id: string) {
    for (let i = 0; i < store.users.length; i++) {
      const user = store.users[i];
      if (user.user_id === user_id) {
        store.users.splice(i, 1);
        console.log(store.users);
        return true;
      } else {
        return false;
      }
    }
  }
}
