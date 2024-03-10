import mongoose, { isValidObjectId } from "mongoose";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { Post } from "../models/post.model.js";

const getAllpost = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, query, sortBy, sortType, userId } = req.query;
  //TODO: get all post based on query, sort, pagination

  if (!userId) {
    throw new apiError(400, "userid required");
  }

  const pipline = [];
  if (userId) {
    await User.findById(userId);

    pipline.push({
      $match: {
        owner: new mongoose.Types.ObjectId(userId),
      },
    });
  }
  console.log(query, typeof query);

  if (query) {
    pipline.push({
      $match: {
        isPublished: false,
      },
    });
  }

  let createFeiild = {};
  if (sortBy && sortType) {
    createFeiild[sortBy] = sortType === "asc" ? 1 : -1;

    pipline.push({
      $sort: createFeiild,
    });
  } else {
    createFeiild["createdAt"] = -1;

    pipline.push({
      $sort: createFeiild,
    });
  }

  pipline.push({
    $skip: (page - 1) * limit,
  });
  pipline.push({
    $limit: limit,
  });
  console.log(pipline);
  /*
    [
  { '$match': { owner: new ObjectId('65e0782461c4addc4efa7528') } },  
  { '$match': { isPublished: false } },
  { '$sort': { isPublished: 1 } },
  { '$skip': 0 },
  { '$limit': 10 }
] */

  const allPosts = await Post.aggregate(pipline);
  if (!allPosts) {
    throw new apiError(400, "pipline aggreagtion problem");
  }

  res
    .status(200)
    .json(
      new apiResponse(
        200,
        allPosts,
        `all vedios are here count:${allPosts.length}`
      )
    );
});

const publishAPost = asyncHandler(async (req, res) => {
  const { title, description } = req.body;
  // TODO: get POst, upload to cloudinary, create video

  if (!(title && description)) {
    throw new apiError(400, "user should provide title and discription");
  }

  // console.log(req.files.Post);
  // console.log(req.files.thumbnail);

  const PostUrl = req.files?.post[0]?.path;
  const thumbnailUrl = req.files?.thumbnail[0]?.path;

  if (!PostUrl) {
    throw new apiError(400, "post path is required");
  }
  if (!thumbnailUrl) {
    throw new apiError(400, "thumbnail path is required");
  }

  const post = await uplaodOnCloudinary(PostUrl);
  const thumbnail = await uplaodOnCloudinary(thumbnailUrl);
  console.log(post, thumbnail);

  const postData = await Post.create({
    postFile: post?.url,
    thumbnail: thumbnail?.url,
    owner: req.user?._id,
    title: title,
    description: description,
    views: 0,
    isPublished: false,
  });
  return res
    .status(200)
    .json(new apiResponse(200, postData, "post published succcessfully"));
});

const getPostById = asyncHandler(async (req, res) => {
  const { postId } = req.params;
  //TODO: get video by id

  const userPost = await post.findById(postId);
  console.log(userPost?.owner.toString());
  console.log(req.user?._id.toString());

  if (
    !userPost ||
    (!userPost.isPublished && !userPost.owner === req.user._id)
  ) {
    throw new apiError(400, "post ur seacrching for doesnot exist");
  }

  return res
    .status(200)
    .json(new apiResponse(200, userPost, "post found successfullly"));
});

const updatePost = asyncHandler(async (req, res) => {
  const { postId } = req.params;
  //TODO: update video details like title, description, thumbnail

  const myPost = await post.findById(postId);

  if (!myPost || !(userPost.owner.toString() === req.user._id.toString())) {
    throw new apiError(400, "Cannot find the post");
  }

  const { title, description } = req.body;

  const thumbnail = await req.file?.path;

  if (!(title && description)) {
    throw new apiError(400, " title and discription required for updation");
  }

  if (!thumbnail) {
    throw new apiError(400, "for update thumbnail is required");
  }

  const updatedthumbnail = await uplaodOnCloudinary(thumbnail);
  await deleteOnClodinary(myPost.thumbnail);
  const newPost = await Post.findByIdAndUpdate(
    postId,
    {
      $set: {
        title: title,
        description: description,
        thumbnail: updatedthumbnail?.url,
      },
    },
    {
      new: true,
    }
  );

  return res
    .status(200)
    .json(new apiResponse(200, newPost, "updated successfully"));
});

const deletePost = asyncHandler(async (req, res) => {
  const { postId } = req.params;
  //TODO: delete video

  if (!postId) {
    throw new apiError(400, "Cannot find the postid");
  }
  const deletePost = await Post.findById(postId);
  if (
    !deletePost ||
    !(deletePost.owner.toString() === req.user._id.toString())
  ) {
    throw new apiError(400, "Cannot find the Post");
  }
  console.log(deletePost.PostFile);

  await deleteOnClodinary(deletePost.PostFile);

  await Post.findByIdAndDelete(postId);

  return res.status(200).json(new apiResponse(200, "deleted postsuccessfully"));
});

export { getAllpost,
        publishAPost,
        getPostById,
        updatePost,
        deletePost 
    };
