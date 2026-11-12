"use client"

import {useState } from 'react'
import axios from 'axios'




export default function addTender(){ 
    const [title, setTitle ] = useState<string>('')
    const [description, setDescription ] = useState<string>('')
    const [budget, setBudget ] = useState<number>(0)
    const [category, setCategory ] = useState<string>('BuildingConstruction')

    const handleAddTender = async(e:any) => { 
        e.preventDefault(); 
        const user_id = localStorage.getItem("user_id")
        try{ 
            await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/tender/addTender/${user_id}`,  { 
                title:title, 
                description:description, 
                budget:budget, 
                category:category
            })
            .then((res) => console.log("Posetd successfully ", res.data))

        }
        catch(err){ 
            console.error("Faield to create tender", err)
            
        }

    }

    return(
        <>
        <div className="relative flex justify-center items-center">
            <form onSubmit={handleAddTender}> 
                <div className="pt-4"> 
                    <input required type="text" placeholder="title" value={title}  onChange={e => setTitle(e.target.value)}/>
                </div>
                    <div className="pt-4"> 
                    <input required  type="text" placeholder="description" value={description}  onChange={e => setDescription(e.target.value)}/>
                </div>    <div className="pt-4"> 
                    <input required type="number" placeholder="budget" value={budget}  onChange={e => setBudget(parseInt(e.target.value))}/>
                </div>  
                <div className="pt-4"> 
                    <select onChange={e => setCategory(e.target.value)}>
                        <option value="BuildingConstruction">Building Construction</option>
                        <option value="RoadConstruction">Road Construction</option>
                    </select>
                </div>
                 <div className="pt-4"> 
                    <button type="submit" className="rounded-lg bg-cyan-600 hover:bg-cyan-500 h-8 w-[12rem]">Add tender</button>
                </div>
            </form>
        </div>
        </>
    )
}