import { makeAutoObservable, runInAction } from "mobx";
import { history } from "../..";
import agent from "../api/agent";
import { User, UserFormModel } from "../models/user";
import { store } from "./store";
export default class UserStore {
  user: User | null = null;
  constructor() {
    makeAutoObservable(this);
  }

  get isLoggedIn() {
    return !!this.user;
  }

  login = async (cred: UserFormModel) => {
    try {
      const user = await agent.Account.login(cred);
      store.commonStore.setToken(user.token);
      runInAction(() => (this.user = user));
      history.push("/activities");
      store.modalStore.closeModel();
    } catch (error) {
      throw error;
    }
  };

  logout = async () => {
    store.commonStore.setToken(null);
    window.localStorage.removeItem("jwt");
    runInAction(() => (this.user = null));
    history.push("/");
  };

  getuser = async () => {
    try {
      const user = await agent.Account.current();
      runInAction(() => (this.user = user));
    } catch (error) {
        console.log('error');
    }
  };

  register = async (cred: UserFormModel) => {
    try {
      const user = await agent.Account.register(cred);
      store.commonStore.setToken(user.token);
      runInAction(() => (this.user = user));
      history.push("/activities");
      store.modalStore.closeModel();
    } catch (error) {
      throw error;
    }
  }

  setImage = (image:string)=>{
    if(this.user) this.user.image = image
  }
}
