// import Button from "../_components/(buttons)/styledButton";
// import AuthAccount from "../(auth)/authHandler";
import style from "./home.module.scss";
import Landing from "./landing/landing";

async function page() {
    type Data<UserData> = {
        user: UserData;
        boolean: boolean;
    };

    return (
        <section className={style.homeContainer}>
            <Landing />

            {/* <AuthAccount mode="logIn">
                <Button text="Log In" />
            </AuthAccount>
            <AuthAccount mode="signUp">
                <Button text="Sign up" />
            </AuthAccount> */}
        </section>
    );
}

export default page;
