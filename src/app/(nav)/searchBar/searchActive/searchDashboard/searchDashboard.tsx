import React from "react";
import {
    SearchCollectionItem,
    SearchSetItem,
} from "../searchListItems/searchListItems";
import { ListItemWithMatch } from "../searchActive";
import {
    Flashcard_collection_with_count,
    Flashcard_set_with_count,
} from "@/app/_types/types";
import style from "./searchDashboard.module.scss";

type SearchDashboardTypes = {
    searchText: string[] | null;
    listSet: Flashcard_set_with_count[];
    listCollection: Flashcard_collection_with_count[];
};

function SearchDashboard({
    searchText,
    listSet,
    listCollection,
}: SearchDashboardTypes) {
    const searchMatchHandler = (string: string) => {
        if (searchText) {
            let matches = 0;
            const filter = searchText.forEach((item) => {
                if (
                    string
                        .toLocaleLowerCase()
                        .includes(item.toLocaleLowerCase())
                ) {
                    matches += 1;
                }
            });
            return matches;
        }
        return 0;
    };

    const filteredSetList: ListItemWithMatch<Flashcard_set_with_count>[] =
        searchText &&
        searchText.length > 0 &&
        searchText[0].length > 2 &&
        listSet
            ? listSet
                  .filter((item) =>
                      searchText.some(
                          (text) =>
                              text.length >= 3 &&
                              item.set_name
                                  .toLowerCase()
                                  .includes(text.toLowerCase())
                      )
                  )
                  .map((item) => {
                      return {
                          ...item,
                          matches: searchMatchHandler(item.set_name),
                      };
                  })
            : [];

    const filteredCollectionList: ListItemWithMatch<Flashcard_collection_with_count>[] =
        searchText &&
        searchText.length > 0 &&
        searchText[0].length > 2 &&
        listCollection
            ? listCollection
                  .filter((item) =>
                      searchText.some(
                          (text) =>
                              text.length >= 3 &&
                              item.collection_name
                                  .toLowerCase()
                                  .includes(text.toLowerCase())
                      )
                  )
                  .map((item) => {
                      return {
                          ...item,
                          matches: searchMatchHandler(item.collection_name),
                      };
                  })
            : [];

    const searchSuggestions = [
        ...filteredSetList,
        ...filteredCollectionList,
    ].sort((a, b) => b.matches - a.matches);

    console.log(searchSuggestions);

    if (searchSuggestions.length > 0) {
        return (
            <div className={style.dashboardContainer}>
                {searchSuggestions.length > 0 && (
                    <label className={style.dashboardLabel}>
                        Dashboard Items
                    </label>
                )}
                <ul className={style.searchListSuggestions}>
                    {searchSuggestions &&
                        searchSuggestions.length > 0 &&
                        searchSuggestions.map((item) => {
                            if ("collection_name" in item) {
                                return (
                                    <SearchCollectionItem
                                        searchText={searchText}
                                        key={`search-li-${item.id}`}
                                        collection={item}
                                    />
                                );
                            } else if ("set_name" in item) {
                                return (
                                    <SearchSetItem
                                        searchText={searchText}
                                        key={`search-li-${item.id}`}
                                        set={item}
                                    />
                                );
                            }
                        })}{" "}
                </ul>
            </div>
        );
    }
}

export default SearchDashboard;
