import { Strategy as LocalStrategy } from "passport-local";
import type { PassportStatic } from "passport";
import User from "../models/user";

function configurePassport(passport: PassportStatic) {
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

          return done(null, user || false);
        } catch (error) {
          return done(error);
        }
      }
    )
  );

  passport.serializeUser((user, done) => done(null, user._id.toString()));

  passport.deserializeUser<string>(async (id, done) => {
    try {
      const user = await User.findById(id);
      done(null, user);
    } catch (error) {
      done(error);
    }
  });
}

export default configurePassport;
