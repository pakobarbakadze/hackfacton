import React, { useState, useCallback, useEffect } from "react";
import axios from "axios";

import { SearchFormProps, StoriesListProps, StoryProps, SearchSortersProps, PaginationProps } from "./HackerNews.types";
import SORTS from "../../utils/Sort";

import classes from "./HackerNews.module.css";

const HackerNews = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [submit, setSubmit] = useState(false);
  const [storiesList, setStoriesList] = useState([]);
  const [sort, setSort] = useState({ sortKey: "NONE", isReverse: false });
  const [pagination, setPagination] = useState({ currPage: 1, pages: 50 });

  const handleSearchInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleSortKeySelect = (e: React.MouseEvent<HTMLElement>, key: string) => {
    //If we click same sortKey twice is reverses list
    const isReverse = sort.sortKey === key && !sort.isReverse;
    setSort({ sortKey: key, isReverse });
  };

  const handlePageSelect = (page: number) => {
    console.log(page);
    setPagination({ currPage: page, pages: pagination.pages });
  };

  const submitHandler = (e: React.FormEvent<EventTarget>) => {
    e.preventDefault();
    setSubmit(true);
  };

  //Call Fetcher function every time we change page or submit new search word
  useEffect(() => {
    handleFetchStories();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [submit, pagination]);

  //Get right function from SORTS depending on sort.sortKey
  const SortFuncton = SORTS[sort.sortKey as keyof typeof SORTS];
  //If isReverse === true reverse list.
  const sortedList = sort.isReverse ? SortFuncton(storiesList).reverse() : SortFuncton(storiesList);

  //Fetcher function
  const handleFetchStories = useCallback(() => {
    console.log(pagination);
    axios
      .get(`http://hn.algolia.com/api/v1/search?query=${searchTerm}&tags=story&page=${pagination.currPage}`)
      .then((res) => {
        console.log(res);
        setStoriesList(res.data.hits);
        //setPagination({ currPage: pagination.currPage, pages: res.data.nbPages });
      })
      .catch((err) => {
        console.log(err);
      });
  }, [pagination, searchTerm]);

  return (
    <div className={classes.container}>
      <SearchForm searchTerm={searchTerm} onSearchInput={handleSearchInput} onSearchSubmit={submitHandler} />
      <SearchSorters onSortSelect={handleSortKeySelect} sort={sort} />
      <StoriestList storiesList={sortedList} />
      <Pagination pagination={pagination} onPageSelect={handlePageSelect} />
    </div>
  );
};

//Components
const SearchForm: React.FC<SearchFormProps> = ({ searchTerm, onSearchInput, onSearchSubmit }) => (
  <div className={classes["search-form"]}>
    <form onSubmit={onSearchSubmit}>
      <h1>HackFactOn</h1>
      <input value={searchTerm} placeholder="Search hacker story." onChange={onSearchInput}></input>
    </form>
  </div>
);

const SearchSorters: React.FC<SearchSortersProps> = ({ onSortSelect, sort }) => (
  <div className={classes["search-sorters"]}>
    <button id={sort.sortKey === "TITLE" ? classes.selected : ""} onClick={(e) => onSortSelect(e, "TITLE")}>
      Title
    </button>
    <button id={sort.sortKey === "AUTHOR" ? classes.selected : ""} onClick={(e) => onSortSelect(e, "AUTHOR")}>
      Author
    </button>
    <button id={sort.sortKey === "COMMENT" ? classes.selected : ""} onClick={(e) => onSortSelect(e, "COMMENT")}>
      Comment
    </button>
    <button id={sort.sortKey === "POINT" ? classes.selected : ""} onClick={(e) => onSortSelect(e, "POINT")}>
      Points
    </button>
  </div>
);

const StoriestList: React.FC<StoriesListProps> = ({ storiesList }) => (
  <div className={classes["stories-list"]}>
    {storiesList.map((story) => (
      <Story key={story.objectID} story={story} />
    ))}
  </div>
);

const Story: React.FC<StoryProps> = ({ story }) => (
  <div className={classes.story}>
    <h1>
      {story.title}
      <a href={story.url} target="_blank" rel="noreferrer">{`( ${story.url} )`}</a>
    </h1>
    <div className={classes["story-info"]}>
      <h4>{`${story.points} points | `}</h4>
      <h4>{`by ${story.author} | `}</h4>
      <h4>{`${story.num_comments} comments`}</h4>
    </div>
  </div>
);

const Pagination: React.FC<PaginationProps> = ({ pagination, onPageSelect }) => {
  const [pagesArr, setPagesArr] = useState<number[]>([]);
  let totalPagesArr: number[] = [];

  for (let i = 1; i <= pagination.pages; i++) {
    totalPagesArr.push(i);
  }

  useEffect(() => {
    let minPage = pagination.currPage - 6 > 0 ? pagination.currPage - 6 : 0;
    setPagesArr(totalPagesArr.slice(minPage, pagination.currPage + 5));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pagination]);

  return (
    <div className={classes.pagination}>
      <ul>
        {pagesArr.map((page, index) => (
          <li
            id={page === pagination.currPage ? classes.selected : ""}
            onClick={() => onPageSelect(page)}
            key={`page ${page + index}`}
          >
            {page}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default HackerNews;
