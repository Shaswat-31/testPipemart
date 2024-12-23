// import allgrades from './grades'

// export async function GET(req){
//     const grades=Object.values(allgrades);
//     let result={};
//     for(const grade of grades){
//         result = { ...result, ...grade.links };
//     }
//     return new Response(JSON.stringify(result))
// }
import { NextResponse } from "next/server";

export async function GET(){
    return new NextResponse("successful")
}