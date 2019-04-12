const JwtStrategy = require('passport-jwt').Strategy,
    ExtractJwt = require('passport-jwt').ExtractJwt;
const keys = require('../config/keys');
const opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = keys.secretOrKey;
const mongoose = require('mongoose');
const User = mongoose.model('users');

module.exports = passport => {
    passport.use(
        new JwtStrategy(opts, async function(jwt_payload, done) {
            // console.log(jwt_payload);
            const user = await User.findById({email: jwt_payload.id});
            // console.log('进入字段验证')
            // console.log(`验证字段找到的user: ${user}`);
            if (user) {
                return done(null, user);
            } else {
                return done(null, false);
            }
        })
    );
};
