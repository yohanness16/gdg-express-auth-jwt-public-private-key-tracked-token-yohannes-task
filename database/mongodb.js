import mongoose, { mongo } from "mongoose"
import { DB_URI } from "../config/env.js"

const connectToDatabase = async()=>{
    try{
        await mongoose.connect(DB_URI);
        console.log("Database connected successfully")
    }catch(err){
        console.log(`Not connected to the databse ${err}`)
    }
}

export default connectToDatabase