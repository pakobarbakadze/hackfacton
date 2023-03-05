import React, { useState } from "react";
import axios from "axios";

import { SearchFormProps, StoriesListProps, StoryProps, SearchSortersProps } from "./HackerNews.types";
import SORTS from "../../utils/Sort";

import classes from "./HackerNews.module.css";

const HackerNews = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [storiesList, setStoriesList] = useState([]);
  const [sortKey, setSortKey] = useState("NONE");

  const handleSearchInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleSortKeySelect = (e: React.MouseEvent<HTMLElement>, key: string) => {
    setSortKey(key);
  };

  const submitHandler = (e: React.FormEvent<EventTarget>) => {
    e.preventDefault();
    axios
      .get(`http://hn.algolia.com/api/v1/search?query=${searchTerm}&tags=story`)
      .then((res) => {
        //console.log(res);
        setStoriesList(res.data.hits);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const SortFuncton = SORTS[sortKey as keyof typeof SORTS];
  const sortedList = SortFuncton(storiesList);

  return (
    <div className={classes.container}>
      <SearchForm searchTerm={searchTerm} onSearchInput={handleSearchInput} onSearchSubmit={submitHandler} />
      <SearchSorters onSortSelect={handleSortKeySelect} />
      <StoriestList storiesList={sortedList} />
    </div>
  );
};

const SearchForm: React.FC<SearchFormProps> = ({ searchTerm, onSearchInput, onSearchSubmit }) => (
  <div className={classes["search-form"]}>
    <form onSubmit={onSearchSubmit}>
      <h1>HackFactOn</h1>
      <input value={searchTerm} placeholder="Search hacker story." onChange={onSearchInput}></input>
    </form>
  </div>
);

const SearchSorters: React.FC<SearchSortersProps> = ({ onSortSelect }) => (
  <div className={classes["search-sorters"]}>
    <button onClick={(e) => onSortSelect(e, "TITLE")}>Title</button>
    <button onClick={(e) => onSortSelect(e, "AUTHOR")}>Author</button>
    <button onClick={(e) => onSortSelect(e, "COMMENT")}>Comment</button>
    <button onClick={(e) => onSortSelect(e, "POINT")}>Points</button>
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

export default HackerNews;
