"use client"
import { Button } from '@/components/ui/button'
import axios from 'axios';
import React from 'react'

function page() {
    const handleClick=async()=>{
        const prompt="Give me a json format data of a table like {row1:[],row2:[],row3:[]....so on} each array you need to fill the data of the columns in first row, the data i want is chemical specification of stainless steel"
        const data={
            "prompt":prompt,
            "type":{
                "file":"text",
                "name":"Table"
            }
        };
        const prompt2="Give me a json format data of a table like {row1:[],row2:[],row3:[]....so on} each array you need to fill the data of the columns in first row, the data i want is physical specifications of stainless steel"
        const data2={
            "prompt":prompt,
            "type":{
                "file":"text",
                "name":"Table"
            }
        };
        const resp=await axios.post("/api/generate",data)
        const resp2=await axios.post("/api/generate",data2)
        console.log(resp.data.text)
        console.log(resp.data.text)
    }
  return (
    <div>
      <Button onClick={handleClick}>Click</Button>
    </div>
  )
}

export default page
