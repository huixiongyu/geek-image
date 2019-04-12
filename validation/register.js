const Validator = require('validator')
const isEmpty = require('./is-empty')

module.exports = function validateRegisterInput(data) {
    let errors = {};

    data.username = !isEmpty(data.username) ? data.username : '';
    data.email = !isEmpty(data.email) ? data.email : '';
    data.password = !isEmpty(data.password) ? data.password : '';

    if (!Validator.isLength(data.username, { min: 2, max: 30 })) {
        errors.username = '名字的长度不能小于2位且不能超过30位';
    }

    if (Validator.isEmpty(data.username)) {
        errors.username = '名字不能为空';
    }

    if (!Validator.isEmail(data.email)) {
        errors.email = '邮箱不合法';
    }

    if (Validator.isEmpty(data.email)) {
        errors.email = '邮箱不能为空';
    }

    if (Validator.isEmpty(data.password)) {
        errors.password = 'password不能为空';
    }

    if (!Validator.isLength(data.password, { min: 8, max: 30 })) {
        errors.password = 'password的长度不能小于8位且不能超过30位';
    }

    return {
        errors,
        isValid: isEmpty(errors)
    };
};
