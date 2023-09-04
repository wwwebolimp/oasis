import React from 'react';
import {signIn, useSession} from "next-auth/react";

interface Props {
    // Введите свойства компонента здесь
}

const Home: React.FC<Props> = () => {
    const {data :session} = useSession()
    if(session){
        return <div>logged</div>
    }
    return (
        <div>
            <button onClick={() => signIn('google')}>Sign in</button>
        </div>
    );
};

export default Home;