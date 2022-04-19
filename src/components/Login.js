import React, { useState } from 'react'

const Login = () => {
    const [ formState, setFormState ] = useState({
        login: true,
        email: '',
        password: '',
        name: ''
    })

    return (
        <div>
            <h4 className='mv3'>{ formState.login? 'Login' : 'Sign UP' }</h4>
            <div className='flex flex-column'>
                {/* 如果沒有帳號的話，會顯示 name 的 input 欄位來提供註冊用 */}
                {
                    !formState.login && (
                        <input 
                            type='text'
                            placeholder='Your name'
                            value={ formState.name }
                            onChange= {e => setFormState({...formState, name: e.target.value})}
                        />
                    )
                }
                {/* 帳號 email  */}
                <input 
                    type='text'
                    placeholder='Your email address'
                    value={ formState.email }
                    onChange={e => setFormState({...formState, email: e.target.value})}
                />
                {/* 密碼 */}
                <input 
                    type='password'
                    placeholder='Choose a safe password'
                    value={ formState.password }
                    onChange={e => setFormState({...formState, password: e.target.value})}
                />
            </div>
            <div className='flex mt3'>
                <button className='pointer mr2 button' onClick={() => console.log('onClick')}>
                    { formState.login ? 'login' : 'create account' }
                </button>
                <button className='pointer button' onClick={e => setFormState({...formState, login: !formState.login})}>
                    { formState.login ? 'need to create an account?' : 'already have an account?' }
                </button>
            </div>
        </div>
    )
}

export default Login