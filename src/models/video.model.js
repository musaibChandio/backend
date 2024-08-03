import mongoose, {Schema} from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const videoSchema =  new Schema(
    {
        videoFile :{
            type : String, //cloudnary url 
            required : true,
        },  // mongodb allow to small files/images directly as a mediafile can store but its not good practice.
        thumbnail : {
            type : String,
            required : true,
        },
        title : {
            type : String,
            required : true,
        },
        description : {
            type : String,
            required : true,
        },
        duration : {
            type : Number,
            required : true,
        },
        views : {
            type : Number,
            default : 0,           
        },
        isPublished : {
            type : Boolean,
            default : true
        },
        owner : {
            type : Schema.Types.ObjectId,
            ref : "User"
        }
        
    },
    {
        timestamps : true
    }
)

videoSchema.plugin(mongooseAggregatePaginate)
export const Video =  mongoose.model("Video", videoSchema)