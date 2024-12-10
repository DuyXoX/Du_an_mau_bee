const nodemailer = require('nodemailer');
require('dotenv').config();

const sendEmail = async (req, res) => {
    try {
        const { TenDangNhap, Account, SoDienThoai, NoiDung } = req.body;


        const transporter = nodemailer.createTransport({
            service: 'gmail',
            secure: false,
            auth: {
                user: process.env.EMAIL_GOOGLE,
                pass: process.env.PASSWORD_GOOGLE
            },
        });

        const htmlContent = `
            <html lang="vi">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        body {
            margin: 0;
            padding: 0;
            font-family: Arial, sans-serif;
        }

        .email-container {
            width: 100%;
            max-width: 600px;
            margin: auto;
            background-color: #ffffff;
        }

        .email-header {
            background-color: #2a534f;
            padding: 20px;
            text-align: center;
            color: #ffffff;
            font-size: 24px;
            font-weight: 700;
        }

        .email-body {
            padding: 20px;
            text-align: center;
            background-color:#f3fffe;
        }

        .email-body p {
            color: black;
        }

        .orange {
            color: #2a534f;
        }

        .fw-bold {
            font-weight: 700;
        }

        .fw-normal {
            font-weight: normal !important;
        }
    </style>
</head>

<body>
    <table class="email-container" cellpadding="0" cellspacing="0" width="100%">
        <tr>
            <td>
                <div class="email-header">
                    Bán Hàng Nông Sản
                </div>
            </td>
        </tr>
        <tr>
            <td>
                <div class="email-body">
                    <h2>
                        Chào
                        <span class="orange"> ${TenDangNhap}</span>
                    </h2>
                    <p>
                        Bạn đã đăng ký thành công với
                        <span class="orange fw-bold">Bán Hàng Nông Sản</span>
                    </p>
                    <p>
                        Đội ngũ của chúng tôi sẽ sớm liên hệ với bạn thông qua thông tin                        
                    </p>
                    <p> mà bạn đã cung cấp với
                        <span class="orange fw-bold"> Bán Hàng Nông Sản</span>
                    </p>
                    <h5 class="">
                        Email:
                        <span class="fw-normal"> ${Account}</span>
                    </h5>
                    <h5 class="">
                        SĐT:
                        <span class="fw-normal"> ${SoDienThoai}</span>
                    </h5>
                    <h5 class="">
                        Nội dung:
                        <span class="fw-normal"> ${NoiDung}</span>
                    </h5>
                </div>
            </td>
        </tr>
    </table>
</body>

</html>
        `;

        const mailOptions = {
            from: process.env.EMAIL_GOOGLE,
            to: [Account, process.env.EMAIL_MIMIMUIC],
            subject: 'Gửi mail', // Tiêu đề
            text: NoiDung, // Nội dung dạng text
            html: htmlContent // Nội dung dạng HTML
        };

        const info = await transporter.sendMail(mailOptions);

        const firstTwoDigits = Account.substring(0, 2);
        const lastThreeDigits = Account.substring(7, 10);

        res.status(200).json({
            message: "Đã gửi mail thành công",
            email: `${firstTwoDigits}...${lastThreeDigits}`
        });
        // console.log('Email sent: ' + info.response);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Lỗi khi gửi mail' });
    }
};

module.exports = {
    sendEmail
}