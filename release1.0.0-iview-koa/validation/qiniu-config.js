const Validator = require('validator');
const isEmpty = require('./is-empty');

module.exports = function validateQiniuInput(data) {
    let errors = {};

    data.accessKey = !isEmpty(data.accessKey) ? data.accessKey : '';
    data.secretKey = !isEmpty(data.secretKey) ? data.secretKey : '';
    data.bucketName = !isEmpty(data.bucketName) ? data.bucketName : '';
    data.zone = !isEmpty(data.zone) ? data.zone : '';
    data.bindURL = !isEmpty(data.bindURL) ? data.bindURL : '';
    data.phone = !isEmpty(data.phone) ? data.phone : '';


    if (Validator.isEmpty(data.accessKey)) {
        errors.accessKey = 'AK不能为空';
    }

    if (Validator.isEmpty(data.secretKey)) {
        errors.secretKey = 'SK不能为空';
    }
    if (Validator.isEmpty(data.bucketName)) {
        errors.bucketName = '空间名不能为空';
    }

    if (Validator.isEmpty(data.zone)) {
        errors.zone = '存储区域不能为空';
    }

    if (Validator.isEmpty(data.bindURL)) {
        errors.bindURL = '绑定的空间域名不能为空';
    }
    if (!Validator.isURL(data.bindURL)) {
        errors.bindURL = '绑定的空间域名地址不合法';
    }

    if (!/^1\d{10}$/.test(data.phone)) {
        errors.phone = '电话号码不合法';
    }


    return {
        errors,
        isValid: isEmpty(errors)
    };
};
