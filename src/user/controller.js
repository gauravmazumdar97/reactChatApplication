const requestSchema = require('./request-schema');
const userModel = require('./models');
const messages = require('../../locales/messages');
const { Module } = require('module');



class Usercontroller {

    presigned(req, res) {
        try {
            const { folder_name, file } = req.body;

            if (!folder_name || !file) {
                return res.status(400).json({ error: 'folder_name and file are required' });
            }

            const myKey = `${folder_name}${file}`;
            const params = {
                Bucket: bucketName,
                Key: myKey
            };

            console.log('params :', params);

            // Generate a presigned URL
            const uploadUrl = s3.getSignedUrl('putObject', params);

            res.status(200).json({ url: uploadUrl });

        } catch (error) {
            console.error('Error generating signed URL', error);
            res.status(500).json({ error: 'Error generating signed URL' });
        }
    }



}



module.exports = new Usercontroller();

