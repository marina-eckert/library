const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/user');

function configurePassport(passport) {
  passport.use(
    new LocalStrategy(
      { usernameField: 'mail', passwordField: 'password' },
      async (mail, password, done) => {
        try {
          const user = await User.findOne({ mail: mail.toLowerCase().trim() });

          if (!user) {
            return done(null, false, { message: 'Неверный email или пароль' });
          }

          const valid = await user.checkPassword(password);

          if (!valid) {
            return done(null, false, { message: 'Неверный email или пароль' });
          }

          return done(null, user);
        } catch (error) {
          return done(error);
        }
      }
    )
  );

  passport.serializeUser((user, done) => done(null, user.id));

  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findById(id);
      done(null, user);
    } catch (error) {
      done(error);
    }
  });
}

module.exports = configurePassport;