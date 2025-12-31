const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const FacebookStrategy = require("passport-facebook").Strategy;
const User = require("../models/user");

// Serialize user để lưu vào session
passport.serializeUser((user, done) => {
  done(null, user._id);
});

// Deserialize user từ session
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

// Google Strategy
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "/api/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Tìm user đã tồn tại với googleId
        let user = await User.findOne({ googleId: profile.id });

        if (user) {
          return done(null, user);
        }

        // Tìm user với email (trường hợp đã đăng ký bằng provider khác)
        user = await User.findOne({ email: profile.emails[0].value });

        if (user) {
          // Cập nhật googleId nếu chưa có
          user.googleId = profile.id;
          user.provider = "google";
          await user.save();
          return done(null, user);
        }

        // Tạo user mới
        user = await User.create({
          googleId: profile.id,
          name: profile.displayName,
          email: profile.emails[0].value,
          avatar: profile.photos[0].value,
          provider: "google",
        });

        return done(null, user);
      } catch (error) {
        return done(error, null);
      }
    }
  )
);

// Facebook Strategy
passport.use(
  new FacebookStrategy(
    {
      clientID: process.env.FACEBOOK_APP_ID,
      clientSecret: process.env.FACEBOOK_APP_SECRET,
      callbackURL: "/api/auth/facebook/callback",
      profileFields: ["id", "displayName", "email", "picture.type(large)"],
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Tìm user đã tồn tại với facebookId
        let user = await User.findOne({ facebookId: profile.id });

        if (user) {
          return done(null, user);
        }

        // Tìm user với email (trường hợp đã đăng ký bằng provider khác)
        const email = profile.emails && profile.emails[0] ? profile.emails[0].value : null;
        if (email) {
          user = await User.findOne({ email: email });
          if (user) {
            // Cập nhật facebookId nếu chưa có
            user.facebookId = profile.id;
            user.provider = "facebook";
            await user.save();
            return done(null, user);
          }
        }

        // Tạo user mới
        user = await User.create({
          facebookId: profile.id,
          name: profile.displayName,
          email: email || `${profile.id}@facebook.com`, // Facebook có thể không trả về email
          avatar: profile.photos && profile.photos[0] ? profile.photos[0].value : null,
          provider: "facebook",
        });

        return done(null, user);
      } catch (error) {
        return done(error, null);
      }
    }
  )
);

module.exports = passport;

