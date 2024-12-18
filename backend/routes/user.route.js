import express from 'express';

import {
  editProfile,
  followOrUnfollow,
  getProfile,
  getSuggestedUsers,
  login,
  logout,
  register,
  search
} from "../controllers/user.controller.js";
import isAuthenticated from '../middlewares/isAuthenticated.js';
import { uploadProfile}from '../middlewares/multer.js';

const router = express.Router();

// User Routes
router.route('/register').post(register);
router.route('/login').post(login);
router.route('/logout').get(logout);
router.route('/:id/profile').get(isAuthenticated, getProfile);
router.route('/profile/edit').post(isAuthenticated, uploadProfile.single('profilePhoto'), editProfile);
router.route('/suggested').get(isAuthenticated, getSuggestedUsers);
router.route('/followorunfollow/:id').post(isAuthenticated, followOrUnfollow);
router.route('/search').get(search)
export default router;