import mongoose from "mongoose";

 const Schema = mongoose.Schema;

const UserSchema = new Schema({
    googleId: {
        type: String,
        required: true
    },
    displayName:  {
        type: String,
        required: true
    },
    firstName:  {
        type: String,
        required: true
    },
    LastName:  {
        type: String,
        required: false
    },
    profileImage:  {
        type: String,
        required: true
    },
    createdAt:  {
        type: Date,
       default: Date.now
    },
});



export default mongoose.model('User',UserSchema)