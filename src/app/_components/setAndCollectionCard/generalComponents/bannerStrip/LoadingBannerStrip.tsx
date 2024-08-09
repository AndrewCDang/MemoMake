import style from "./bannerStrip.module.scss";
import { colours } from "@/app/styles/colours";

function LoadingBannerStrip({
    contentType,
}: {
    contentType: "collection" | "set";
}) {
    const bannerRadius = 20;
    const pathValue = 40;
    const pathGapBtm = pathValue + bannerRadius;
    const pathGapEnd = pathValue + 2 * bannerRadius;

    const newPathD = `path("M0 64 Q0 40 16 40 L${pathValue} 40  Q${pathGapBtm} 40 ${pathGapBtm} 16 Q${pathGapBtm} 0 ${pathGapEnd} 0 H10000 V10000 H0 Z")`;

    // Box Shadow - icons
    const iconBoxShadows = `0px 2px 4px rgba(0,0,0,0.2)`;

    const ForegroundContainer = () => {
        if (contentType === "set") {
            return <div className={style.foregroundContainer}></div>;
        } else if (contentType === "collection") {
            return (
                <div className={style.backgroundCollectionContainerWrap}>
                    <div
                        style={{
                            clipPath: newPathD,
                            backgroundColor: colours.white(),
                        }}
                        className={style.backgroundCollectionContainer}
                    ></div>
                </div>
            );
        }
        return null;
    };

    return (
        <>
            <div className={style.bannerContainer}>
                <div className={style.bannerInternal}>
                    <section className={style.iconContainer}>
                        {contentType && (
                            <div
                                className={`${style.bannerIcon} foregroundContainer2`}
                                style={{
                                    backgroundColor: colours.lightGrey(),
                                    boxShadow: iconBoxShadows,
                                }}
                            >
                                <div
                                    style={{
                                        backgroundColor: colours.lightGrey(),
                                        height: "1.5rem",
                                        width: "1.5rem",
                                    }}
                                ></div>
                            </div>
                        )}
                    </section>
                </div>
            </div>
            {/* Bg for collection item */}
            {contentType === "collection" && <ForegroundContainer />}
            {/* Bg for set/collection item */}
            <div
                className={`${style.backgroundContainerWrap} foregroundContainer`}
            >
                <div
                    style={{
                        clipPath: newPathD,
                        backgroundColor: colours.lightGrey(),
                    }}
                    className={style.backgroundContainer}
                >
                    {contentType === "set" && (
                        <div className={style.foregroundContainerWrap}>
                            <div className={style.foregroundContainer}></div>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}

export default LoadingBannerStrip;
