import express from "express";
import passport from "passport";
import User from "../../models/user";

const router = express.Router();

router.get('/login', (req, res) => {
  res.render('login', {
    user: req.user,
    error: req.query.error || ''
  });
});

router.get('/me', (req, res) => {
  if (!req.isAuthenticated()) {
    return res.redirect('/api/user/login');
  }

  return res.render('me', { user: req.user });
});

router.post(
  '/login',
  passport.authenticate('local', {
    failureRedirect: '/api/user/login?error=Неверный email или пароль'
  }),
  (req, res) => {
    res.redirect('/api/user/me');
  }
);

router.post('/signup', async (req, res) => {
  try {
    const mail = String(req.body.mail || '').toLowerCase().trim();
    const password = String(req.body.password || '');

    if (!mail || !password) {
      return res.status(400).send('mail and password are required');
    }

    if (password.length < 4) {
      return res.status(400).send('Password must contain at least 4 characters');
    }

    const existing = await User.findOne({ mail });

    if (existing) {
      return res.status(409).send('User already exists');
    }

    const user = await User.createWithPassword(mail, password);

    req.login(user, (error) => {
      if (error) return res.status(500).send((error instanceof Error ? error.message : String(error)));
      return res.redirect('/api/user/me');
    });
  } catch (error) {
    return res.status(500).send((error instanceof Error ? error.message : String(error)));
  }
});

router.post('/logout', (req, res) => {
  req.logout(() => {
    res.redirect('/');
  });
});

export default router;