'use client'

import React, { useState, useRef, ChangeEvent, FormEvent } from 'react';
import { FormControl, makeStyles } from '@mui/material';
import StorefrontIcon from '@mui/icons-material/Storefront';
import Inventory2Icon from '@mui/icons-material/Inventory2';
import SearchIcon from '@mui/icons-material/Search';
import IconButton from '@mui/material/IconButton';
import TextField from '@mui/material/TextField';
import { useTranslation } from 'react-i18next';
import Snackbar from '@mui/material/Snackbar';
import './SearchBar.scss';

const SearchBar: React.FC = () => {
  const [searchBarValue, setSearchBarValue] = useState('');
  const [isBusinessSearchType, setIsBusinessSearchType] = useState(true);
  const [message, setMessage] = useState('');
  const { t } = useTranslation();

  const handleSearchBarChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchBarValue(event.target.value);
  };
  
  const inputRef = useRef<HTMLInputElement>(null);

  const handleIconClick = () => {
    // Move the placeholder text up
    if(inputRef.current) {
      inputRef.current.focus();
    }
  };

  const fetchSearchResults = async (query: string, searchType: string):Promise<any[]> => {
    // fetch logic to be defined here
    // For now, it returns an empty array
    return new Promise((resolve) => resolve([]));
  };

  const setSearchQuery = (query: string, searchType: string) => {
    // setSearchQuery logic here
  };
  
  const handleSubmitSearch = async (event: FormEvent) => {
    event.preventDefault();
    const query = searchBarValue;
    if (query) {
      const searchType = isBusinessSearchType ? 'business' : 'product';
      console.info(`Search query emitted for ${searchType}: `, query);

      const searchResults = await fetchSearchResults(query, searchType);
      setSearchQuery( query, searchType );

      setMessage(`Your search found ${searchResults.length} shops. Please zoom out to view all shop markers.`); 
      console.log(message);
    }
  };

  return (
    <div className="w-full min-w-40 fixed top-20 z-5 flex justify-center">
       <Snackbar
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        open={!!message}
        message={message}
        autoHideDuration={6000}
        onClose={() => setMessage('')}
      />
      <div className="w-full max-w-xl pl-14 pr-4 flex items-center">
        <form className="w-full" onSubmit={handleSubmitSearch}>
          <FormControl className="w-full mb-0 flex-grow">
            <TextField 
            id="search-input" 
            type="text" 
            variant="filled"
            color="success"
            className="bg-white hover:bg-gray-100"
            label={t(
              isBusinessSearchType
                ? "Search Businesses.."
                : "Search Products..",
            )} 
            value={searchBarValue} 
            onChange={handleSearchBarChange}
            ref={inputRef}
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-2">
              {isBusinessSearchType ? (
                <StorefrontIcon
                  className="search-toggle-element cursor-pointer"
                  onClick={() => {
                    setIsBusinessSearchType(false);
                    handleIconClick();
                  }}
                />
              ) : (
                <Inventory2Icon
                  className="search-toggle-element cursor-pointer"
                  onClick={() => {
                    setIsBusinessSearchType(true);
                    handleIconClick();
                  }}
                />
              )}
              <IconButton
                aria-label="delete"
                className="bg-gray-600 rounded h-10 w-10 flex items-center justify-center ml-5 hover:bg-gray-600" onClick={handleSubmitSearch}>
                <SearchIcon className="text-white text-2xl mb-1" />
              </IconButton>
            </div>
          </FormControl>
        </form>
      </div>
    </div>
  );
};

export default SearchBar;


