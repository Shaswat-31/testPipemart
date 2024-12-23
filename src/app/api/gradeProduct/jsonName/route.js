import { NextResponse } from 'next/server';
import grades from './grades.json'
export async function POST(req){
    const body=await req.json();
    const {name}=body;
    const searchTerms = name.toLowerCase().replace("-", " ").split(" ");

    // Filter the data to match any word in the search terms
    const filteredData = Object.entries(grades)
      .filter(([key]) => {
        const normalizedKey = key.toLowerCase();
        return searchTerms.some((term) => normalizedKey.includes(term));
      })
      .reduce((acc, [key, value]) => {
        acc[key] = value;
        return acc;
      }, {});

      return NextResponse.json(filteredData)

}