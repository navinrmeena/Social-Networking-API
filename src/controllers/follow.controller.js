import mongoose, {isValidObjectId} from "mongoose"
import {User} from "../models/user.model.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"
import { Follow } from "../models/follow.model.js"
import { ApiError } from "../utils/ApiError.js"


const followUser = asyncHandler(async(req,res)=>{
    const {userId} = req.params;
    const registeredUser = await User.findById(userId)
    if(!registeredUser){
        throw new apiError(400,"user which you are trying to follow doesnot exist")
     }
     const userExisted= await Follow.find(
         {
             follower:req.user?._id,
             following:userId,
         }
     )
     if(userExisted.length >0){
         throw new apiError(400,"you have already followed this user");
     }

     const follower = await User.findById(req.user?._id);
     const following = await User.findById(userId);

     const followed = await Follow.create({
         follower:follower,
         following:following,
     })

     if(!followed){
         throw new apiError(400,"there is a error when u are trying to follow a user");
     }


     await User.findByIdAndUpdate(
            userId,
            {
                $push:{
                    follower:follower
                }
            },
            {new:true}

     )

     await User.findByIdAndUpdate(
        req.user?._id,
        {
            $push:{
                following:following
            }
        },
        {new:true}  

     )

     return res.status(200).json(new ApiResponse(200,
        "successfully followed the user",
        followed)
        )
});


const unfollowUser = asyncHandler(async(req,res)=>{
    const {userId} = req.params;
    const registeredUser=await User.findById(userId);
    if(!registeredUser){
        throw new apiError(400,"user which you are trying to unfollow doesnot exist")
    }

    console.log(registeredUser?._id);

    const unfollowed = await Follow.findOneAndDelete({
        follower:req.user?._id,
        following:registeredUser._id,
    });
    console.log(unfollowed);
    if(!unfollowed){
        throw new apiError(400,"there is a error when u are trying to unfollow a user");
    }

    await User.findByIdAndUpdate(
        userId,
        {
            $pull:{
                follower:userId
            }
        },
        {new:true}
    )
    await User.findByIdAndUpdate(
        req.user?._id,
        {
            $pull:{
                following:registeredUser._id
            }
        },
        {new:true}
    )


    return res.status(200).json(new ApiResponse(200,
        "successfully unfollowed the user",
        unfollowed)
        )
    });


const getUserFollowers = asyncHandler(async(req,res)=>{
    const {userId} = req.params;
    const registeredUser=await User.findById(userId);
    if(!registeredUser){
        throw new apiError(400,"user which you are trying to acces for followers doesnot exist")
    }
    const followers= await Follow.aggregate([
        {
            $match:{
                following:registeredUser._id
            }
        },
        {
            $project:{
                "follower":1,
                "follower.password":0,
                "follower.refreshToken":0,
                "follower.__v":0,
                "follower.createdAt":0,
                "follower.updatedAt":0,
            }
        }
    ])

    return res.status(200).json(new ApiResponse(200,
        "successfully fetched the followers",
        followers)
        )
    });

    const getUserFollowing = asyncHandler(async(req,res)=>{
        const {userId} = req.params;
        const registeredUser=await User.findById(userId);
        if(!registeredUser){
            throw new apiError(400,"user which you are trying to acces for following doesnot exist")
        }
        const following= await Follow.aggregate([
            {
                $match:{
                    follower:registeredUser._id
                }
            },
            {
                $project:{
                    "following":1,
                    "following.password":0,
                    "following.refreshToken":0,
                    "following.__v":0,
                    "following.createdAt":0,
                    "following.updatedAt":0,
                }
            }
        ])
    
        return res.status(200).json(new ApiResponse(200,
            "successfully fetched the following",
            following)
            )
        });

export {followUser,unfollowUser,getUserFollowers,getUserFollowing}