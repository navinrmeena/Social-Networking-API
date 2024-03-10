import { Router } from "express";
import  {followUser,unfollowUser,getUserFollowers,getUserFollowing} from "../controllers/follow.controller.js";
import {verifyJWT} from "../middlewares/auth.middleware.js"

const router = Router();
router.use(verifyJWT); // Apply verifyJWT middleware to all routes in this file

router.route('/follow/:userId').post(followUser);
router.route('/unfollow/:userId').post(unfollowUser);
router.route('/followers/:userId').get(getUserFollowers);
router.route('/following/:userId').get(getUserFollowing);

export default router;
