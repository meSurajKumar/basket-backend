import mongoose from "mongoose";


export default function (){
    const db = process.env.DATABASE_URL
    mongoose.connect(db).then(()=>{console.log(`connected to database`)
    }).catch(err=>(console.log(`Failed To Connect ${err}`)))
}