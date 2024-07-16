import { Session } from "next-auth";
import React from "react";
import NavLoggedIn from "./navLoggedIn";

type NavUserType = {
    session: Session | null;
};
function NavUser({ session }: NavUserType) {
    return <NavLoggedIn session={session} />;
}

export default NavUser;
