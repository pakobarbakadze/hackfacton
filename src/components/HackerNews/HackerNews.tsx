import React, { useState } from "react";
import axios from "axios";

import { SearchFormProps, StoriesListProps } from "./HackerNews.types";

import classes from "./HackerNews.module.css";

const HackerNews = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [storiesList, setStoriesList] = useState([]);

  const handleSearchInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const submitHandler = (e: React.FormEvent<EventTarget>) => {
    e.preventDefault();
    axios
      .get(`http://hn.algolia.com/api/v1/search?query=${searchTerm}&tags=story`)
      .then((res) => {
        console.log(res);
        setStoriesList(res.data.hits);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div className={classes.container}>
      <SearchForm onSearchSubmit={submitHandler} searchTerm={searchTerm} onSearchInput={handleSearchInput} />
      <SearchSorters />
      <StoriestList storiesList={storiesList} />
    </div>
  );
};

const SearchForm: React.FC<SearchFormProps> = ({ searchTerm, onSearchInput, onSearchSubmit }) => (
  <div className={classes["search-form"]}>
    <form onSubmit={onSearchSubmit}>
      <h1>HackFactOn</h1>
      <input value={searchTerm} placeholder="Search hacker story" onChange={onSearchInput}></input>
    </form>
  </div>
);

const SearchSorters = () => (
  <div className={classes["search-sorters"]}>
    <button>Title</button>
    <button>Author</button>
    <button>Comment</button>
    <button>Points</button>
  </div>
);

const StoriestList: React.FC<StoriesListProps> = ({ storiesList }) => (
  <div className={classes["stories-list"]}>
    {storiesList.map((story, index) => (
      <div key={story.objectID}>{story.title}</div>
    ))}
  </div>
);

export default HackerNews;
