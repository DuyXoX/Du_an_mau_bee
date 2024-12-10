const express = require('express');
const passport = require('passport');
const authentication = require('../middlewares/authentication');
const { authenLoginPlatform } = require('../controllers/authenLoginSignup');
authentication(passport);
const authenLoginSignupRouter = express.Router();


authenLoginSignupRouter.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

authenLoginSignupRouter.get('/auth/google/callback', passport.authenticate('google', {
    failureRedirect: '/dang-nhap', // Đường dẫn tới trang login nếu xác thực thất bại
    // successRedirect: 'http://localhost:3000/', // Đường dẫn tới trang sau khi xác thực thành công
    failureFlash: true, //Bật thông báo nếu lỗi xac thực
}), (req, res) => {

    return authenLoginPlatform(req, res);
});

authenLoginSignupRouter.get('/auth/facebook', passport.authenticate('facebook', { authType: 'request', scope: ['user_birthday', 'user_age_range', 'user_gender', 'user_photos'] }));

authenLoginSignupRouter.get('/auth/facebook/callback', passport.authenticate('facebook', {
    failureRedirect: '/dang-nhap', // Đường dẫn tới trang login nếu xác thực thất bại
    failureFlash: true, //Bật thông báo nếu lỗi xac thực
}), (req, res) => {
    return authenLoginPlatform(req, res);
});

module.exports = authenLoginSignupRouter;