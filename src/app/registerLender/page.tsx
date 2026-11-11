"use client"

import {useState} from 'react'; 
import axios from 'axios'; 




export default function registerLender(){ 
    const [firstName, setFirstName ] = useState<string>(''); 
    const [lastName, setLastName] = useState<string>('')
    const [password, setPassword] = useState<string>('')
    const [email, setEmail ] = useState<string>('')


    const handleRegister = async(e:any) => { 
        e.preventDefault(); 
        console.log("this is the password", password)
        try{ 
            axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/users/register/lender`, { 
                first_name:firstName, 
                last_name:lastName, 
                password:password, 
                email:email
            })
            .then((res) => console.log(res.data))
        }
        catch(err){ 
            console.error("Failed to register user", err)
        }
    }
    return(
        <>
        <div className="justify-center items-center relative flex"> 
            <form onSubmit={handleRegister}> 
                <div className="pt-4"> 
                    <input type="text" placeholder="first name" value={firstName} onChange={e  => setFirstName(e.target.value)}/>
                </div>
                 <div className="pt-4"> 
                    <input type="text" placeholder="last name" value={lastName} onChange={e  => setLastName(e.target.value)}/>
                </div> <div className="pt-4"> 
                    <input required type="email" placeholder="email" value={email} onChange={e  => setEmail(e.target.value)}/>
                </div>
                 <div className="pt-4"> 
                    <input type="password" placeholder="password" value={password} onChange={e  => setPassword(e.target.value)}/>
                </div>
                 <div className="pt-4"> 
                    <button type="submit" className="bg-green-600 hover:bg-cyan-500 h-8 w-[12rem] rounded-lg">Register</button>
                </div>
            </form>
        </div>
        </>
    )
}