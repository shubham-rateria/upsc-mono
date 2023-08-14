import React from 'react';
import { SearchParamsContext, searchParamsClass } from './SearchParamsContext';

type Props = {
    children: React.ReactNode;
}

const SearchParamsContextProvider: React.FC<Props> = ({children}) => {
    return <SearchParamsContext.Provider value={searchParamsClass}>
        {children}
    </SearchParamsContext.Provider>
}

export default SearchParamsContextProvider;