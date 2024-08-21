import React from "react";
import style from "./paginationBtns.module.scss";
import Link from "next/link";
import { colours } from "@/app/styles/colours";

type PaginationBtnsTypes = {
    totalPagBtns: number;
    url: string;
    currentPagPage: number;
};

const Pagbtn = ({
    url,
    currentPagPage,
    pagNum,
}: {
    url: string;
    currentPagPage: number;
    pagNum: number;
}) => {
    return (
        <Link href={`${url}${url.endsWith("?") ? "" : "&"}page=${pagNum}`}>
            <button
                style={{
                    backgroundColor:
                        currentPagPage === pagNum
                            ? colours.yellow()
                            : colours.yellow(0.5),
                }}
                className={style.paginationBtns}
            >
                {pagNum}
            </button>
        </Link>
    );
};
/**
 *
 * @param currentPagPage Currently selected pagination page
 * @param totalPagBtns Total number of pagination pages
 * @param url Url of page including other params
 * @returns React.Node
 */
function PaginationBtns({
    currentPagPage,
    totalPagBtns,
    url,
}: PaginationBtnsTypes) {
    if (totalPagBtns > 1)
        return (
            <div className={style.paginationContainer}>
                {/* Small list, doesn't not require ellipsis ... */}
                {totalPagBtns <= 6
                    ? Array(totalPagBtns)
                          .fill("_")
                          .map((item, index) => {
                              return (
                                  <Pagbtn
                                      key={item}
                                      url={url}
                                      currentPagPage={currentPagPage}
                                      pagNum={index + 1}
                                  />
                              );
                          })
                    : // middle portion pagination -> 1...3,4,5,6,7...10
                    currentPagPage >= 3 && currentPagPage < totalPagBtns - 2
                    ? [
                          ...[currentPagPage - 2 !== 1 ? 1 : null],
                          currentPagPage - 2,
                          currentPagPage - 1,
                          currentPagPage,
                          currentPagPage + 1,
                          currentPagPage + 2,
                          totalPagBtns,
                      ]
                          .filter((item) => item !== null)
                          .map((item, index) => {
                              return (
                                  <React.Fragment key={item}>
                                      {item == totalPagBtns &&
                                          currentPagPage < totalPagBtns - 3 && (
                                              <div>...</div>
                                          )}
                                      <Pagbtn
                                          url={url}
                                          currentPagPage={currentPagPage}
                                          pagNum={Number(item)}
                                      />
                                      {item == 1 && currentPagPage > 4 && (
                                          <div>...</div>
                                      )}
                                  </React.Fragment>
                              );
                          })
                    : //Starting pagination with big list - 1,2,3,4...20
                    currentPagPage < totalPagBtns - 2
                    ? [...Array(4).fill("_"), totalPagBtns].map(
                          (item, index) => {
                              return (
                                  <React.Fragment key={item}>
                                      {item == totalPagBtns && <div>...</div>}
                                      <Pagbtn
                                          url={url}
                                          currentPagPage={currentPagPage}
                                          pagNum={
                                              item === totalPagBtns
                                                  ? totalPagBtns
                                                  : index + 1
                                          }
                                      />
                                  </React.Fragment>
                              );
                          }
                      )
                    : //Ending pagination with big list - 1...,17,18,19,20
                      [
                          1,
                          ...[
                              currentPagPage - 2,
                              currentPagPage - 1,
                              currentPagPage,
                              currentPagPage + 1,
                              currentPagPage + 2,
                          ].filter((item) => item < totalPagBtns),
                          totalPagBtns,
                      ].map((item, index) => {
                          return (
                              <React.Fragment key={item}>
                                  <Pagbtn
                                      url={url}
                                      currentPagPage={currentPagPage}
                                      pagNum={
                                          item === totalPagBtns
                                              ? totalPagBtns
                                              : item
                                      }
                                  />
                                  {item == 1 && currentPagPage > 4 && (
                                      <div>...</div>
                                  )}
                              </React.Fragment>
                          );
                      })}
            </div>
        );
    // Returns single button if only 1 pagination btn neccesary
    else {
        return (
            <div className={style.paginationContainer}>
                <button
                    style={{
                        backgroundColor: colours.yellow(),
                        cursor: "unset",
                    }}
                    className={style.paginationBtns}
                >
                    <div>
                        1<span className={style.singleBtnLabel}>/1</span>
                    </div>
                </button>
            </div>
        );
    }
}

export default PaginationBtns;
