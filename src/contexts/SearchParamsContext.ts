import { SearchParams } from '@/types';
import React from 'react';
import { makeAutoObservable } from 'mobx';

class SearchParamsClass {
    public searchParams: SearchParams = {};
   

    public setSearchParams(params: SearchParams) {
        this.searchParams = {...this.searchParams, ...params};
    }

    constructor(params: SearchParams) {
        this.searchParams = params;
        makeAutoObservable(this);
    }
}

export const searchParamsClass = new SearchParamsClass({});

export const SearchParamsContext = React.createContext<SearchParamsClass>(new SearchParamsClass({}));
