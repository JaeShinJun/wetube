import passport from 'passport';
import routes from '../routes';
import User from '../models/User';

export const getJoin = (req, res) => {
    res.render('join', { pageTitle: 'Join' });
};

export const postJoin = async (req, res, next) => {
    const {
        body: { name, email, password, password2 },
    } = req;

    if (password !== password2) {
        res.status(400);
        res.render('join', { pageTitle: 'Join' });
    } else {
        try {
            const user = await User({
                name,
                email,
            });
            await User.register(user, password);
            next();
        } catch (error) {
            console.log(error);
            res.redirect(routes.home);
        }
    }
};

export const getLogin = (req, res) => {
    res.render('login', { pageTitle: 'Login' });
};

export const postLogin = passport.authenticate('local', {
    failureRedirect: routes.login,
    successRedirect: routes.home,
});

export const githubLogin = passport.authenticate('github');

export const githubLoginCallback = async (_, __, profile, cb) => {
    const {
        _json: { id, avatar_url: avatarUrl, name, email },
    } = profile;

    try {
        const user = await User.findOne({ email });
        if (user) {
            user.githubId = id;
            user.avatarUrl = avatarUrl;
            user.save();
            return cb(null, user);
        }
        const newUser = await User.create({
            email,
            name,
            githubId: id,
            avatarUrl,
        });
        return cb(null, newUser);
    } catch (error) {
        return cb(error);
    }
};

export const postGithubLogIn = (req, res) => {
    return res.redirect(routes.home);
};

export const facebookLogin = passport.authenticate('facebook');

export const facebookLoginCallback = async (_, __, profile, cb) => {
    const {
        _json: { id, name, email },
    } = profile;
    try {
        const user = await User.findOne({ email });
        if (user) {
            user.facebookId = id;
            user.avatarUrl = `https://graph.facebook.com/${id}/picture?type=large`;
            user.save();
            return cb(null, user);
        }
        const newUser = await User.create({
            email,
            name,
            facebookId: id,
            avatarUrl: `https://graph.facebook.com/${id}/picture?type=large`,
        });
        return cb(null, newUser);
    } catch (error) {
        return cb(error);
    }
};

export const postFacebookLogin = (req, res) => {
    return res.redirect(routes.home);
};

export const logout = (req, res) => {
    req.logout();
    res.redirect(routes.home);
};

export const users = (req, res) => res.render('users', { pageTitle: 'Users' });

export const getMe = (req, res) => {
    res.render('userDetail', { pageTitle: 'User Detail', user: req.user });
};

export const userDetail = async (req, res) => {
    const {
        params: { id },
    } = req;
    try {
        const user = await User.findById(id).populate('videos');
        return res.render('userDetail', { pageTitle: 'userDetail', user });
    } catch (error) {
        return res.redirect(routes.home);
    }
};

export const getEditProfile = (req, res) =>
    res.render('editProfile', { pageTitle: 'Edit Profile' });

export const postEditProifile = async (req, res) => {
    const {
        body: { name, email },
        file,
    } = req;

    try {
        await User.findByIdAndUpdate(req.user.id, {
            name,
            email,
            avatarUrl: file ? file.path : req.user.avatarUrl,
        });
        return res.redirect(routes.me);
    } catch (error) {
        return res.render('editProfile', { pageTitle: 'Edit Profile' });
    }
};

export const getChangePassword = (req, res) => {
    return res.render('changePassword', { pageTitle: 'Change Password' });
};

export const postChangePassword = async (req, res) => {
    const {
        body: { oldPassword, newPassword, newPassword1 },
    } = req;
    try {
        if (newPassword !== newPassword1) {
            res.status(400);
            return res.redirect(`/users${routes.changePassword}`);
        }
        await req.user.changePassword(oldPassword, newPassword);
        return res.redirect(routes.me);
    } catch (error) {
        res.status(400);
        return res.redirect(`/users${routes.changePassword}`);
    }
};
