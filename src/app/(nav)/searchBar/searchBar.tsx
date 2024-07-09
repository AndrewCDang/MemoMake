import { auth } from "@/auth";
import style from "./searchBar.module.scss";
import SearchBarContent from "./searchBarContent";
import { fetchCollectionByIdWithSetAndItemCount } from "@/app/_actions/fetchCollectionByIdWithSetAndItemCount";
import {
    Flashcard_collection_with_count,
    Flashcard_set_with_count,
} from "@/app/_types/types";

async function SearchBar() {
    const session = await auth();

    const listSet = session
        ? ((await fetchCollectionByIdWithSetAndItemCount({
              userId: session.user.id,
              type: "set",
          })) as Flashcard_set_with_count[])
        : [];

    const listCollection = session
        ? ((await fetchCollectionByIdWithSetAndItemCount({
              userId: session.user.id,
              type: "collection",
          })) as Flashcard_collection_with_count[])
        : [];

    return (
        <div className={style.searchNavWrapContainer}>
            <SearchBarContent
                listSet={listSet}
                listCollection={listCollection}
            />
        </div>
    );
}

export default SearchBar;
