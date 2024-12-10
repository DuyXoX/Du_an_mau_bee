const jwt = require("jsonwebtoken");
const { generateTokenInfo, generateToken } = require("../config/jwt");


const authenLoginPlatform = async (req, res) => {
    // return console.log('check hihihi: ', req.user);

    try {
        const user = req.user;
        const TenDangNhap = user.TenDangNhap;
        const DiaChi = user.DiaChi;
        const SoDienThoai = user.SoDienThoai;

        const token = generateToken(user.NguoiDungId, user.Account);
        const account_user = generateTokenInfo(TenDangNhap, DiaChi, SoDienThoai);

        req.session.user = token;
        req.session.TenDangNhap = TenDangNhap;
        req.session.save();

        res.cookie("ss_account", token, { maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: false, secure: true, sameSite: 'strict' });
        res.cookie("account_user", account_user, { maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: false, secure: false, sameSite: 'strict' });

        res.redirect(`${process.env.CORS}/?status=success`)
        // res.status(200).json({ message: 'Đăng nhập thành công.', ss_account: token, account_user });
        return;
    } catch (err) {
        // Xử lý lỗi nếu có
        // res.redirect(`${process.env.CORS}/dang-nhap?status=failure`);
        res.status(500).json({ error: 'Đã có lỗi xảy ra, vui lòng thử lại sau.' });
        console.error(err);
    }
};

module.exports = {
    authenLoginPlatform,
}