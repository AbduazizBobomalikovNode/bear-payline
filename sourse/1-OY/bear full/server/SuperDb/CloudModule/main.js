const fs = require('fs');
const path = require('path');
const mysqldump = require('mysqldump');
const { google } = require('googleapis');
const credentials = require('./keyGoogle/xenon-depth-370016-143060d7cc92.json');


// async function uploadFile(bucketName, filename) {
//     // Uploads a local file to the bucket
//     await storage.bucket(bucketName).upload(filename, {
//         // Support for HTTP requests made with `Accept-Encoding: gzip`
//         gzip: true,
//         // By setting the option `destination`, you can change the name of the
//         // object you are uploading to a bucket.
//         metadata: {
//             // Enable long-lived HTTP caching headers
//             // Use only if the contents of the file will never change
//             // (If the contents will change, use cacheControl: 'no-cache')
//             cacheControl: 'public, max-age=31536000',
//         },
//     });

//     console.log(`${filename} uploaded to ${bucketName}.`);
// }

async function Run() {
    mysqldump({
            connection: {
                host: "localhost",
                user: "admin",
                password: "@dm1nb1ll1@rd$r##m",
                database: "bear"
            },
            dumpToFile: `./JsonModule/data/${(new Date()).toISOString().slice(0,10).replace('T', ' ')}.sql`,
        })
        .then(() => {
            console.log('Database dump completed!');
            const auth = new google.auth.GoogleAuth({
                credentials,
                scopes: ['https://www.googleapis.com/auth/drive']
            });
            const drive = google.drive({ version: 'v3', auth });
            const fileMetadata = {
                name: `${(new Date()).toISOString().slice(0,10).replace('T', ' ')}.sql`,
                parents: ['1Raxqx4098p-AAxxRcizBn1AUCm6Pjwrc'], // Hedef klasörün ID'sini buraya girin
            };

            const media = {
                mimeType: 'application/sql',
                body: fs.createReadStream(`./JsonModule/data/${(new Date()).toISOString().slice(0,10).replace('T', ' ')}.sql`),
            };

            try {
                drive.files.create({
                    resource: fileMetadata,
                    media: media,
                    fields: 'id',
                });
                //console.log('Dosya Google Drive\'a başarıyla yüklendi. Dosya ID:', response.data.id);
            } catch (err) {
                console.error('Dosya yükleme hatası:', err.message);
            }

        })
        .catch(err => {
            // an error occurred
            console.error('An error occurred while dumping the database:', err);
        });
}

module.exports = Run;