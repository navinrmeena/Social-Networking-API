import { Router } from "express";
import {
  getAllpost,
  publishAPost,
  getPostById,
  updatePost,
  deletePost,
} from "../controllers/post.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();

router.use(verifyJWT);
router
  .route("/")
  .get(getAllpost)
  .post(
    upload.fields([
      {
        name: "post",
        maxCount: 1,
      },
      {
        nam: "thumbnail",
        maxCount: 1,
      },
    ]),
    publishAPost
  );

router
  .route("/:postId")
  .get(getPostById)
  .patch(upload.single("thumbnail"), updatePost)
  .delete(deletePost);

export default router;
