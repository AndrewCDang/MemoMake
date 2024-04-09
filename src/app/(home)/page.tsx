// import Button from "../_components/(buttons)/styledButton";
// import AuthAccount from "../(auth)/authHandler";
import style from "./home.module.scss";

async function page() {
    type Data<UserData> = {
        user: UserData;
        boolean: boolean;
    };

    return (
        <section className={style.homeContainer}>
            <h1>Home Page</h1>
            <h2>test</h2>
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
