"use client"
import {useState} from 'react'
import axios from 'axios'



export default function Login(){ 
    const [email, setEmail ] = useState<string>('')
    const [password, setPassword ] = useState<string>('')
    return(
        <>
        <div className="relative flex justify-center items-center"> 
            <h1>
                Welcome to the login page
            </h1>
            <form> 
                <div className="pt-4"> 
                    <input required type='email' placeholder="email" value={email} onChange={e => setEmail(e.target.value)}/> 
                </div>
                
            </form>
        </div>
        </>
    )
}