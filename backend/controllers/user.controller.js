// Register
import { User } from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { Post } from "../models/post.model.js";
import cloudinary from "../utils/cloudinary.js";
import getDataUri from "../utils/datauri.js";

export const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password)
      return res
        .status(401)
        .json({
          message: "Something is missing, please check",
          success: false,
        });
    if (username.includes(" "))
      return res
        .status(401)
        .json({
          message: "Username can not conatin blank spaces",
          success: false,
        });
    const specialCharacterRegex = /[!@#$%^&*(),.?":{}|<>]/;
    if (password.length < 6 || !specialCharacterRegex.test(password)) {
      return res.status(401).json({
        message:
          "Password must be at least 6 characters long and include at least one special character",
        success: false,
      });
    }
    const user = await User.findOne({ email });
    if (user) {
      return res
        .status(401)
        .json({ message: "Try different email", success: false });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    await User.create({ username, email, password: hashedPassword });
    return res
      .status(201)
      .json({ message: "Account Created Successfully", success: true });
  } catch (error) {
    console.log(error);
  }
};

// login
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res
        .status(401)
        .json({
          message: "Something is missing, please check",
          success: false,
        });
    let user = await User.findOne({ email });
    if (!user)
      return res
        .status(401)
        .json({ message: "Incorrect email or password", success: false });
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch)
      return res
        .status(401)
        .json({ message: "Incorrect email or password", success: false });

    const token = await jwt.sign({ userId: user._id }, process.env.SECRET_KEY, {
      expiresIn: "1d",
    });
    // populate each post if in posts array
    const populatedPosts = await Promise.all(
      user.posts.map(async (postId) => {
        const post = await Post.findById(postId);
        if (post?.author.equals(user._id)) return post;
        return null;
      })
    );
    user = {
      _id: user._id,
      username: user.username,
      email: user.email,
      profilePicture: user.profilePicture,
      bio: user.bio,
      followers: user.followers,
      following: user.following,
      posts: populatedPosts,
      name: user.name,
    };
    return res
      .cookie("token", token, {
        httpOnly: true,
        sameSite: "strict",
        maxAge: 1 * 24 * 60 * 60 * 1000,
      })
      .json({
        message: `Welcome Back ${user.username}`,
        success: true,
        user,
      });
  } catch (error) {
    console.log(error);
  }
};

// logout
export const logout = async (_, res) => {
  try {
    return res.cookie("token", "", { maxAge: 0 }).json({
      message: "Logged Out Successfully.",
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};

// getProfile
export const getProfile = async (req, res) => {
  try {
    const userId = req.params.id;

    // Fetch the user and populate followers and following fields
    let user = await User.findById(userId)
      .populate({ path: "posts", options: { sort: { createdAt: -1 } } })
      .populate("bookmarks")
      .populate("followers", "_id username") // Populate followers
      .populate("following", "_id username"); // Populate following

    if (!user) {
      return res
        .status(404)
        .json({ message: "User not found", success: false });
    }

    return res.status(200).json({
      user,
      success: true,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "Internal Server Error", success: false });
  }
};

// editProfile
export const editProfile = async (req, res) => {
  try {
    const userId = req.id;
    const { name, bio, gender, dob } = req.body;
    let cloudResponse;
    const profilePicture = req.file; // File uploaded using Multer
    console.log("Uploaded file", profilePicture);

    // let cloudResponse;
    // Update profilePicture if uploaded
    if (profilePicture) {
      // const relativePath = `/uploads/profile_pictures/${profilePicture.filename}`;
      // console.log(relativePath);
      // user.profilePicture = `http://localhost:8000${relativePath}`; // Full URL
      // console.log(user.profilePicture);
      const fileuri=getDataUri(profilePicture);
      cloudResponse=await cloudinary.uploader.upload(fileuri);
    }
    // Find the user
    const user = await User.findById(userId);
    if (!user) {
      return res
        .status(404)
        .json({ message: "User Not Found", success: false });
    }
    if (bio) user.bio = bio;
    if (gender) user.gender = gender;
    if (name) user.name = name;
    if (dob) user.dob = dob;
    if(profilePicture) user.profilePicture=cloudResponse.secure_url;
    // Save user
    await user.save();
    return res
      .status(200)
      .json({ message: "Profile Updated", success: true, user });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "Internal Server Error", success: false });
  }
};

// get other users
export const getSuggestedUsers = async (req, res) => {
  try {
    const suggestedUsers = await User.find({ _id: { $ne: req.id } }).select(
      "-password"
    );
    if (!suggestedUsers) {
      return res.status(400).json({ message: "Don't have any users" });
    }
    return res.status(200).json({ users: suggestedUsers, success: true });
  } catch (error) {
    console.log(error);
  }
};

export const followOrUnfollow = async (req, res) => {
  try {
    const followKrneWala = req.id; // patel
    const jiskoFollowKrunga = req.params.id; // shivani
    if (followKrneWala === jiskoFollowKrunga) {
      return res.status(400).json({
        message: "You cannot follow/unfollow yourself",
        success: false,
      });
    }

    const user = await User.findById(followKrneWala);
    const targetUser = await User.findById(jiskoFollowKrunga);

    if (!user || !targetUser) {
      return res.status(400).json({
        message: "User not found",
        success: false,
      });
    }
    // mai check krunga ki follow krna hai ya unfollow
    const isFollowing = user.following.includes(jiskoFollowKrunga);
    // Inside followOrUnfollow controller
    if (isFollowing) {
      // unfollow logic
      await Promise.all([
        User.updateOne(
          { _id: followKrneWala },
          { $pull: { following: jiskoFollowKrunga } }
        ),
        User.updateOne(
          { _id: jiskoFollowKrunga },
          { $pull: { followers: followKrneWala } }
        ),
      ]);
      return res
        .status(200)
        .json({ message: "Unfollowed successfully", success: true });
    } else {
      // follow logic
      await Promise.all([
        User.updateOne(
          { _id: followKrneWala },
          { $push: { following: jiskoFollowKrunga } }
        ),
        User.updateOne(
          { _id: jiskoFollowKrunga },
          { $push: { followers: followKrneWala } }
        ),
      ]);
      return res
        .status(200)
        .json({ message: "Followed successfully", success: true });
    }
  } catch (error) {
    console.log(error);
  }
};

export const search = async (req, res) => {
  try {
    const query = req.query.query;
    if (!query) {
      return res.status(400).json({ message: "Query is required" });
    }

    const users = await User.find({
      $or: [
        { name: { $regex: query, $options: "i" } },
        { username: { $regex: query, $options: "i" } },
      ],
    }).select("_id name username profilePicture"); // Select only necessary fields

    res.json({ users });
  } catch (error) {
    res.status(500).json({ message: "Error fetching users", error });
  }
};
