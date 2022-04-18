import React, { useState } from 'react'
import { useMutation, gql } from '@apollo/client'
import { useNavigate } from 'react-router-dom'

const CREATE_LINK_MUTATION = gql`
    mutation PostMutation($description: String!, $url: String!) {
        post(description: $description, url: $url) {
            id
            createdAt
            url
            description
        }
    }
`

const CreateLink = () => {
    const [ formState, setFormState ] = useState({
        description: '',
        url: ''
    })

    const navigate = useNavigate();

    const [createLink] = useMutation(CREATE_LINK_MUTATION, {
        variables: {
            description: formState.description,
            url: formState.url
        },
        // 當新增 Post 後，會自動重新導回首頁
        onCompleted: () => navigate('/')
    })

    return (
        <div>
            <form onSubmit={e => { e.preventDefault(); createLink(); }}>
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