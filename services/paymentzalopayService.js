// paymentService.js
const axios = require('axios');
const CryptoJS = require('crypto-js');
const moment = require('moment');
const qs = require('qs');
const config = require('../config/zalopayconfig'); // Ensure config file has `app_id`, `key1`, `key2`, and `endpoint`
const ChiTietSanPham = require('../models/chitietsanphamModels');

const createOrder = async (amount, items) => {
    // Tạo ID giao dịch ngẫu nhiên
    const transID = Math.floor(Math.random() * 1000000);
    const appTransId = `${moment().format('YYMMDD')}_${transID}`;

    // Dữ liệu bổ sung, như URL chuyển hướng sau khi thanh toán xong
    const embed_data = {
        redirecturl: 'http://localhost:3000/thong-tin/gio-hang',  // URL sau khi thanh toán xong
    };

    // Đối tượng order chứa thông tin giao dịch
    const order = {
        app_id: config.app_id,
        app_trans_id: appTransId, // Mã giao dịch
        app_user: 'user123', // ID người dùng
        app_time: Date.now(), // Thời gian tạo giao dịch
        item: JSON.stringify(items), // Mảng các sản phẩm trong giỏ hàng
        embed_data: JSON.stringify(embed_data), // Dữ liệu bổ sung
        amount: amount, // Tổng số tiền
        description: `Lazada - Payment for the order #${transID}`, // Mô tả giao dịch
        bank_code: '', // Mã ngân hàng (nếu cần)
        callback_url: 'https://3a0b-2402-800-621e-993d-8c0e-81ae-25c6-3644.ngrok-free.app/api/callback', // URL callback từ ZaloPay
    };

    // Tạo chuỗi dữ liệu để tính toán MAC
    const data =
        config.app_id +
        '|' +
        order.app_trans_id +
        '|' +
        order.app_user +
        '|' +
        order.amount +
        '|' +
        order.app_time +
        '|' +
        order.embed_data +
        '|' +
        order.item;

    // Tính toán MAC sử dụng HMAC-SHA256
    order.mac = CryptoJS.HmacSHA256(data, config.key1).toString();

    try {
        // Gửi yêu cầu tạo đơn hàng đến ZaloPay
        const result = await axios.post(config.endpoint, null, {
            params: order  // Gửi thông tin giao dịch trong params
        });

        // Trả về kết quả từ ZaloPay
        return {
            app_trans_id: appTransId,  // Bao gồm app_trans_id
            ...result.data              // Bao gồm dữ liệu từ ZaloPay
        };
    } catch (error) {
        // Xử lý lỗi nếu có
        throw new Error('Error creating ZaloPay order: ' + error.message);
    }
};

const processCallback = async (callbackData) => {
    let result = {};
    try {
        let dataStr = callbackData.data;
        let reqMac = callbackData.mac;

        let mac = CryptoJS.HmacSHA256(dataStr, config.key2).toString();
        console.log('mac =', mac);

        // Kiểm tra callback hợp lệ (đến từ ZaloPay server)
        if (reqMac !== mac) {
            result.return_code = -1;
            result.return_message = 'mac not equal';
        } else {
            // Thanh toán thành công
            let dataJson = JSON.parse(dataStr);
            console.log(
                "update order's status = success where app_trans_id =",
                dataJson['app_trans_id']
            );
            // Nếu thanh toán thành công, tạo đơn hàng mới

            // Cập nhật trạng thái đơn hàng ở đây (ví dụ gọi hàm cập nhật vào DB)
            // await orderService.updateOrderStatus(dataJson['app_trans_id'], 'success');

            result.return_code = 1;
            result.return_message = 'success';
        }
    } catch (ex) {
        console.log('Lỗi:::', ex.message);
        throw new Error(ex.message);  // Ném lỗi để controller bắt và phản hồi
    }

    return result;
};

const checkOrderStatus = async (appTransId) => {
    const postData = {
        app_id: config.app_id,
        app_trans_id: appTransId,
    };

    // Tạo MAC cho dữ liệu
    const data = `${postData.app_id}|${postData.app_trans_id}|${config.key1}`;
    postData.mac = CryptoJS.HmacSHA256(data, config.key1).toString();

    try {
        const response = await axios.post('https://sb-openapi.zalopay.vn/v2/query', qs.stringify(postData), {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
        });
        return response.data; // Trả về dữ liệu từ API ZaloPay
    } catch (error) {
        throw new Error('Error while checking order status: ' + error.message);
    }
};

module.exports = {
    createOrder,
    processCallback,
    checkOrderStatus
};