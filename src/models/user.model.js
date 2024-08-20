import mongoose,{Schema} from "mongoose";
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"

const userSchema = new Schema (
    {
        username : {
            type : String,
            required : true,
            unique : true,
            lowercase : true,
            trim :true,
            index : true //database searchable with optimize way 
        },
        email : {
            type : String,
            required : true,
            unique : true,
            lowercase : true,
            trim :true,
        },
        fullname : {
            type : String,
            required : true,
            trim :true,
            index : true,
        },
        avatar : {
            type : String, // cloudinary url for video files img
            required : true, 

        },
        coverImage : {
            type : String,
        },
        watchHistory : [
            {
                type : Schema.Types.ObjectId,
                ref : "Video"
            }
        ],
        password : {
            type : String,
            required : [true , 'Password is required'] //custom error messsage
        },
        refreshToken : {
            type : String,
        }   
    },   
    {
        timestamps : true
    })



userSchema.pre("save", async function (next){
    if(!this.isModified("password")) return next(); // to solve the issue of if user save again and again any changes perform in any field pass saved so applied condition to the hook.

    this.password = await bcrypt.hash(this.password,10) //round 
    next()
    // now need add methods for confirmation password is ok or not when user is trying to import and user first confirm password is ok or not then import...

})
userSchema.methods.isPasswordCorrect = async function(password){ //custom Methods
    return await bcrypt.compare(password, this.password)
}

userSchema.methods.generateAccessToken = function() {
    return jwt.sign(  //sign generate token
        {
            _id : this._id,
            email : this.email,
            username : this.username,
            fullname : this.fullname
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
         expiresIn : process.env.ACCESS_TOKEN_EXPIRY   
        }
    ) 
}
userSchema.methods.generateRefreshToken = function() {
    return jwt.sign(  //sign generate token
        {
            _id : this._id,
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
         expiresIn : process.env.REFRESH_TOKEN_EXPIRY   
        }
    ) 
}
export const User = mongoose.model("User",userSchema)