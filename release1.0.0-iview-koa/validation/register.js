const Validator = require('validator')
const isEmpty = require('./is-empty')

module.exports = function validateRegisterInput(data) {
    let errors = {};

    data.phone = !isEmpty(data.phone) ? data.phone : '';
    data.code = !isEmpty(data.code) ? data.code : '';
    data.password = !isEmpty(data.password) ? data.password : '';
    data.repeatPassword = !isEmpty(data.repeatPassword) ? data.repeatPassword : '';

    if (!/^1\d{10}$/.test(data.phone)) {
        errors.phone = '电话号码不符合要求';
    }

    if (!Validator.isNumeric(data.code)) {
        errors.code = '验证码有误';
    }

    if (Validator.isEmpty(data.password)) {
        errors.password = 'password不能为空';
    }

    if(!Validator.equals(data.password, data.repeatPassword)){
        errors.password = '两次密码填写不一致！';
    }

    if (!Validator.isLength(data.password, { min: 8, max: 16 })) {
        errors.password = '密码的长度不能小于8位且不能超过16位';
    }

    return {
        errors,
        isValid: isEmpty(errors)
    };
};
