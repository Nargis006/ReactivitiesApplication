import { useContext, createContext } from "react";
import ActivityStore from "./activityStore";
import CommonStore from "./commonstore";
import ModalStore from "./modelStore";
import UserStore from "./userstore";

interface Store {
    activityStore: ActivityStore;
    commonStore: CommonStore;
    userStore: UserStore;
    modalStore: ModalStore;
}

export const store: Store = {
    activityStore: new ActivityStore(), 
    commonStore: new CommonStore(),
    userStore : new UserStore(),
    modalStore: new ModalStore()
}

export const StoreContext = createContext(store);

export const useStore = () => {
    return useContext(StoreContext);
}