import Link from "next/link";
import style from "./linkText.module.scss";
import { HiChevronRight } from "react-icons/hi2";

function LinkText({ link, text }: { link: string; text: string }) {
    return (
        <Link href={link}>
            <div className={style.linkContainer}>
                <span className={style.link}>{text}</span>
                <HiChevronRight />
            </div>
        </Link>
    );
}

export default LinkText;
