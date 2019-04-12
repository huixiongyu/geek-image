const Validator = require('validator');
const isEmpty = require('./is-empty');

module.exports = function validateSigninInput(data) {
    let errors = {};

    data.phone = !isEmpty(data.phone) ? data.phone : '';
    data.password = !isEmpty(data.password) ? data.password : '';

    if (!/^1\d{10}$/.test(data.phone)) {
        errors.phone = '电话号码不合法';
    }

    if (!Validator.isLength(data.password, { min: 8, max: 16 })) {
        errors.password = '密码的长度至少8位，最多16位';
    }

    return {
        errors,
        isValid: isEmpty(errors)
    };
};
