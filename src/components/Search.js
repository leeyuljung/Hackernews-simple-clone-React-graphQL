import React, { useState } from 'react'

const Search = () => {
    const [ searchFilter, setSearchFilter ] = useState('')

    return(
        <>
            <div>
                Search
                <input type='text' onChange={e => setSearchFilter(e.target.value)} />
                <button>OK</button>
            </div>
        </>
    )
}

export default Search