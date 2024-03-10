import mongoose, {Schema} from "mongoose";
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"


const userSchema = new Schema(
    {
        
        username:{
            type: String,
            required:true,
            lowercase:true,
            unique:true,
            trim:true,
            index:true,
        },
        email:{
            type:String,
            required:true,
            lowercase:true,
            unique:true,
            trim:true,
        },
        password:{
            type:String,
            required: [true,"Password is required"],
            unique:true,
            trim:true,

        },
        fullName:{
            type:String,
            required:true,
            trim:true,
            index:true,
        },  
        avatar:{
            type : String, // cloudinary url
            required: true,
        },
        bio:{
            type:String,
            required:false,
            trim:true,
        },
       
        refreshToken: {
            type: String,
        },
        follower:[
            {
                type:Schema.Types.ObjectId,
                ref:"User"
            }
        ],
        following:[
            {
                type:Schema.Types.ObjectId,
                ref:"User"
            }
        ]
    }, {timestamps:true}
)





userSchema.pre("save",async function (next){
    // console.log(this.password)
    if(!this.isModified("password")) return next();
    this.password =await bcrypt.hash(this.password,10) 
    next()}) 

    
userSchema.methods.isPasswordCorrect = async function(password){

    //compare method basically jo chheze mangta hai strng me pasword jo user bhejega and encrpyted password
    console.log(password)
    console.log(this.password)
   return await bcrypt.compare(password, this.password);
}
          
userSchema.methods.generateAccessToken =  function (){
    return jwt.sign(
        {
            _id : this._id,
            username: this.username,
            fullName : this.fullName,
            email: this.email,
        },
        process.env.ACCESS_TOKEN_SECRET ,
        {
            expiresIn : process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}



userSchema.methods.generateRefreshToken =  function (){
    return jwt.sign(
        {
            _id : this._id,

        },
        process.env.REFRESH_TOKEN_SECRET ,
        {
            expiresIn : process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}

export const User = mongoose.model("User",userSchema)




 
