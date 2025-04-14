import { User } from "@supabase/auth-js";
import { atom, useAtom } from "jotai";

const currentUserAtom = atom<User>();

export const userCurrentUserState = () => {
    const [currentUser, setCurrentUser] = useAtom(currentUserAtom);
    return { currentUser, set: setCurrentUser };
};

const currentUserState = userCurrentUserState();
currentUserState.set(userData);
currentUserState.currentUser;