import React, { useState } from 'react'

const CreateLink = () => {
    const [ formState, setFormState ] = useState({
        description: '',
        url: ''
    })

    return (
        <div>
            <form onSubmit={e => e.preventDefault()}>
                <div className='flex flex-column mt3'>
                    <input 
                        className='mb2'
                        type="text"
                        placeholder='A description for the link'
                        value={ formState.description }
                        onChange={ e => setFormState({...formState, description: e.target.value })}
                    />
                    <input 
                        className='mb2'
                        type="text"
                        placeholder='The URL for the link'
                        value={ formState.url }
                        onChange={ e => setFormState({...formState, url: e.target.value}) }
                    />
                </div>
                <button type="submit">Submit</button>
            </form>
        </div>
    )
}

export default CreateLink