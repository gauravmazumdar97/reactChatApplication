const express = require('express');
const app = express();
const router = express.Router();
const Usercontroller = require('./controller');
const messages = require('../../locales/messages');
const path = require('path');
const config = require('../../config/config')
app.use(express.static(path.join(__dirname, 'public')));
const AWS = require('aws-sdk');
const bodyParser = require('body-parser');
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));


const bucketName = process.env.AWS_BUCKET_NAME;
const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_KEY,
    region: process.env.AWS_BUCKET_REIGN,
    useAccelerateEndpoint: process.env.USE_ACCELERATE_ENDPOINT
});



router.put('/signed_url', Usercontroller.presigned);




module.exports = router;