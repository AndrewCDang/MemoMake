import style from "./home.module.scss";
import Landing from "./landing/landing";

// export const dynamic = "force-static";

function Page() {
    return (
        <section className={style.homeContainer}>
            <Landing />
        </section>
    );
}

export default Page;
