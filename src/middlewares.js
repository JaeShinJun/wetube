import multer from 'multer';
import multerS3 from 'multer-s3';
import aws from 'aws-sdk';
import routes from './routes';
import Video from './models/Video';

const s3 = new aws.S3({
    accessKeyId: process.env.AWS_KEY,
    secretAccessKey: process.env.AWS_PRIVATE_KEY,
});

// const multerVideo = multer({ dest: 'uploads/videos/' });
// const multerAvatar = multer({ dest: 'uploads/avatars/' });

const multerVideo = multer({
    storage: multerS3({
        s3,
        acl: 'public-read',
        bucket: 'wetube.jason/videos',
    }),
});

const multerAvatar = multer({
    storage: multerS3({
        s3,
        acl: 'public-read',
        bucket: 'wetube.jason/avatars',
    }),
});

export const uploadVideo = multerVideo.single('videoFile');
export const uploadAvatar = multerAvatar.single('avatar');

export const awsDeleteVideo = async (req, res, next) => {
    const {
        params: { id },
    } = req;
    const video = await Video.findById(id);
    const fileUrl = video.fileUrl.split('/');

    const delFileName = fileUrl[fileUrl.length - 1];
    const params = {
        Bucket: 'wetube.jason/videos',
        Key: delFileName,
    };
    console.log(params);
    s3.deleteObject(params, (err, data) => {
        if (err) {
            console.log('aws video delete error');
            console.log(err, err.stack);
            res.redirect(routes.home);
        } else {
            console.log(`aws video delete success${data}`);
        }
    });
    next();
};

export const localsMiddleware = (req, res, next) => {
    res.locals.siteName = 'WeTube';
    res.locals.routes = routes;
    res.locals.loggedUser = req.user || null;
    next();
};

export const onlyPublic = (req, res, next) => {
    if (req.user) {
        res.redirect(routes.home);
    } else {
        next();
    }
};

export const onlyPrivate = (req, res, next) => {
    if (req.user) {
        next();
    } else {
        res.redirect(routes.home);
    }
};
