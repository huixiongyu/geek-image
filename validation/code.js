const Validator = require('validator');
const isEmpty = require('./is-empty');

module.exports = function validatePhoneInput(data) {
    let errors = {};
    data.phone = !isEmpty(data.phone) ? data.phone : '';

    if (Validator.isEmpty(data.phone)) {
        errors.phone = '电话号码不能为空';
    }
    if (data.phone.length != 11) {
        errors.phone = '电话号码错误';
    }
    return {
        errors,
        isValid: isEmpty(errors)
    };
};
