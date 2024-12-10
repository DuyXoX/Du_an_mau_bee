const passport = require("passport");
const User = require("../models/userModel");
const { where } = require("sequelize");
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;

module.exports = function (passport) {
    passport.serializeUser((user, cb) => {
        // console.log('check serializeUser: ', user.NguoiDungId);
        cb(null, user.NguoiDungId);
    });

    passport.deserializeUser(async (id, cb) => {
        // console.log('check id: ', id);
        try {
            const user = await User.findById(id);
            cb(null, user);
        } catch (err) {
            cb(err);
        }
    });

    passport.use(new GoogleStrategy({
        clientID: process.env.GOOGLE_API_ID,
        clientSecret: process.env.GOOGLE_API_SECRET,
        callbackURL: process.env.CALLBACK_URL_GOOGLE
    },
        async (accessToken, refreshToken, profile, cb) => {
            try {
                // console.log('check: ', profile);
                if (profile.id) {
                    // console.log(profile);
                    let user = await User.findOne({ where: { Account: profile.emails[0].value }, attributes: ['NguoiDungId', 'TenDangNhap', 'Account', 'DiaChi', 'SoDienThoai', 'VaiTro'] });
                    if (user) {
                        // console.log("vao if");
                        return cb(null, user); // Đã có tài khoản trước đó
                    } else {
                        const google = 345
                        user = new User({
                            TenDangNhap: profile.displayName + google,
                            Account: profile.emails[0].value,
                        });
                        await user.save();
                        // console.log("vao else");
                        return cb(null, user); // Chưa có tài khoản trước đó
                    }
                }
            } catch (err) {
                return cb(err);
            }
        }
    ));

    passport.use(new FacebookStrategy({
        clientID: process.env.FACEBOOK_API_ID,
        clientSecret: process.env.FACEBOOK_API_SECRET,
        callbackURL: process.env.CALLBACK_URL_FACEBOOK,
        profileFields: ['id', 'displayName', 'picture', 'emails']
    },
        async (accessToken, refreshToken, profile, cb) => {
            try {
                if (profile.id) {
                    let user = await User.findOne({ Account: profile.id });
                    if (user) {
                        // console.log("vao if");
                        return cb(null, user); // Đã có tài khoản trước đó
                    } else {
                        const facebook = 567
                        user = new User({
                            TenDangNhap: profile.displayName + facebook,
                            Account: profile.id,
                        });
                        await user.save();
                        // console.log("vao else");
                        return cb(null, user); // Chưa có tài khoản trước đó
                    }
                }
            } catch (err) {
                return cb(err);
            }
        }
    ));
}
