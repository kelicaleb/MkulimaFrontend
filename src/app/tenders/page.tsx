"use client"


import {useState, useEffect } from 'react'
import Navbar from "@/components/Navbar";
import axios from 'axios'

interface Tender{
    id:number, 
    lender_id:number, 
    title:string, 
    description:string, 
    budget:number, 
    deadline:string, 
    category:string
}




export default function tenders(){ 
    const [applications, setApplications ] = useState<Tender[]>([])
    useEffect(() => { 
        const fetchData = async()=> { 
            try{ 
                await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/tender`)
                .then((res) => setApplications(res.data))
            }
            catch(err){ 
                console.error("Failed to fecth tenders", err)
            }
        }
        fetchData()
    },[])
    return(
        <>
        <Navbar/>
        <div> 
                <table className="w-full text-left border-collapse">
      <thead>
        <tr className="border-b bg-gray-100">
          <th className="p-2">Company</th>
          <th className="p-2">Bid Amount</th>
          <th className="p-2">Status</th>
        </tr>
      </thead>
      <tbody>
        {applications.map((app:Tender) => 
          <tr key={app.id} className="border-b hover:bg-gray-50">
            <td className="p-2">{app.lender_id}</td>
            <td className="p-2">${app.title}</td>
            <td className="p-2">{app.description}</td>
          </tr>
        )}
      </tbody>
    </table>
        </div>
        </>
    )
}