const Validator = require('validator');
const isEmpty = require('./is-empty');

module.exports = function validatePasswordInput(data) {
    let errors = {};

    data.old = !isEmpty(data.old) ? data.old : '';
    data.newPass = !isEmpty(data.newPass) ? data.newPass : '';
    data.repeatNew = !isEmpty(data.repeatNew) ? data.repeatNew : '';


    if (Validator.isEmpty(data.old)) {
        errors.old = '旧密码不能为空';
    }

    if (Validator.isEmpty(data.newPass)) {
        errors.newPass = '新密码不能为空';
    }
    if (Validator.isEmpty(data.repeatNew)) {
        errors.newPass = '确认的密码不能为空';
    }

    if (!Validator.isLength(data.repeatNew, { min: 8, max: 30 })) {
        errors.repeatNew = 'password的长度不能小于8位且不能超过30位';
    }

    if(data.newPass !== data.repeatNew){
        errors.password = '两次密码输入不一致！';
    }

    return {
        errors,
        isValid: isEmpty(errors)
    };
};
