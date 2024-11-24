import express from "express";
import passport from "passport";
import GoogleStrategy from "passport-google-oauth20";
import env from "dotenv";
import User from "../models/User.js";
import router from "./index.js";

export const authrouter = express.Router();

env.config();

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.CallBack_1,
      callbackURL: process.env.CallBack_2,
    },
    async function (accessToken, refreshToken, profile, done) {
      console.log(profile.name.givenName)
      const newUSer = {
        googleId: profile.id,
        displayName: profile.displayName,
        firstName: profile.name.givenName,
        lastName: profile.name.familyName,
        profileImage: profile.photos[0].value,
      };
      try {
        let user = await User.findOne({ googleId: profile.id });

        if (user) {
          done(null, user);
        } else {
          user = await User.create(newUSer);
          done(null, user);
        }
      } catch (error) {
        console.log(error);
      }
    }
  )
);

authrouter.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["email", "profile"] })
);

authrouter.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/login-failure",
    successRedirect: "/dashbord",
  })
);

authrouter.get('/logout',(req,res)=>{
    req.session.destroy(error =>{
        if(error){  
        console.log(error) 
        res.send("error in logging out")
        }else{
            res.redirect('/')
        }
    })
});

// presist user data after successfull authentication
passport.serializeUser((user, done) => {
  done(null, user);
});
// retrieve user data from session
passport.deserializeUser(async (id, done) => {
    try {
        const user =  User.findById(id)
        done(null, user);
    } catch (error) {
        done(error)
    }
    
  
});

// route if authonicatin goes wrong
authrouter.get("/login-failure", (req, res) => {
  res.send("something went wrong ... ");
});

export default authrouter;
