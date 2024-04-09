import Link from "next/link";
import style from "./linkText.module.scss";

function LinkText({ link, text }: { link: string; text: string }) {
    return (
        <Link href={link}>
            <p className={style.link}>{text}</p>
        </Link>
    );
}

export default LinkText;
