"use client";
import style from "./bannerStrip.module.scss";
import { colours } from "@/app/styles/colours";
import { PropsWithChildren, ReactNode } from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

function LoadingBannerStrip({
    contentType,
}: {
    contentType: "collection" | "set";
}) {
    const bannerRadius = 20;
    const pathValue = 22;
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
    const IconWrapper = ({ children }: PropsWithChildren<unknown>) => {
        return (
            <div
                className={`${style.bannerIcon} `}
                style={{
                    boxShadow: iconBoxShadows,
                }}
            >
                {children}
            </div>
        );
    };

    const skeletonIcon = <Skeleton wrapper={IconWrapper} count={1} />;

    const BannerStripWrapper = ({ children }: PropsWithChildren<unknown>) => {
        return (
            <div className={`${style.backgroundContainerWrap}`}>
                <div
                    style={{
                        clipPath: newPathD,
                    }}
                    className={style.backgroundContainer}
                >
                    {contentType === "collection" ? (
                        <div> {children}</div>
                    ) : null}
                    {contentType === "set" && (
                        <div
                            style={{
                                position: "absolute",
                                top: "0",
                                marginTop: "unset",
                                height: "100%",
                            }}
                            className={style.foregroundContainerWrap}
                        >
                            <div className={style.foregroundContainer}></div>
                        </div>
                    )}
                </div>
            </div>
        );
    };

    const bannerStripIcon = (
        <Skeleton
            wrapper={BannerStripWrapper}
            height={"100%"}
            style={{ position: "absolute" }}
            count={1}
        />
    );

    return (
        <>
            <div className={style.bannerContainer}>
                <div className={style.bannerInternal}>
                    <section className={style.iconContainer}>
                        {contentType && skeletonIcon}
                    </section>
                </div>
            </div>
            {/* Bg for collection item */}
            {contentType === "collection" && <ForegroundContainer />}
            {/* Bg for set/collection item */}
            {bannerStripIcon}
        </>
    );
}

export default LoadingBannerStrip;
