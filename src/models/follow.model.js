import mongoose, {Schema} from "mongoose"

const followSchema = new Schema({
    follower: {
        type: Schema.Types.ObjectId, // one who is following (follower)
        ref: "User"
    },
    following: {
        type: Schema.Types.ObjectId, // one to whom 'user' is following 
        ref: "User"
    }
}, {timestamps: true})


export const Follow = mongoose.model("Follow", followSchema);