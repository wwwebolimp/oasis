import * as mongoose from "mongoose";
import * as process from "process";

export function mongooseConnect(){
    if (mongoose.connection.readyState === 1){
        return mongoose.connection.asPromise();
    }else{
        const uri = process.env.MONGODB_URI;
        if (uri) {
            return mongoose.connect(uri);
        } else {
            throw new Error("MONGODB_URI is not defined");
        }
    }
}