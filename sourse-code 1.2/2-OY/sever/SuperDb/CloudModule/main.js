const fs = require('fs');
const path = require('path');
const mysqldump = require('mysqldump');
const { google } = require('googleapis');

// Barcha sozlamalar muhit o'zgaruvchilaridan olinadi (.env.example ga qarang):
// MYSQL_HOST, MYSQL_USER, MYSQL_PASSWORD, MYSQL_DATABASE,
// GOOGLE_APPLICATION_CREDENTIALS (service account JSON fayliga yo'l),
// GOOGLE_DRIVE_FOLDER_ID (zaxira nusxa yuklanadigan papka)

function requireEnv(names) {
    const missing = names.filter((n) => !process.env[n]);
    if (missing.length) {
        throw new Error("Zaxira nusxa uchun muhit o'zgaruvchilari yetishmayapti: " + missing.join(', '));
    }
}

async function Run() {
    requireEnv(['MYSQL_HOST', 'MYSQL_USER', 'MYSQL_PASSWORD', 'MYSQL_DATABASE',
        'GOOGLE_APPLICATION_CREDENTIALS', 'GOOGLE_DRIVE_FOLDER_ID'
    ]);
    const stamp = (new Date()).toISOString().slice(0, 10);
    const dumpFile = path.join(__dirname, 'data', `${stamp}.sql`);
    return mysqldump({
            connection: {
                host: process.env.MYSQL_HOST,
                user: process.env.MYSQL_USER,
                password: process.env.MYSQL_PASSWORD,
                database: process.env.MYSQL_DATABASE
            },
            dumpToFile: dumpFile,
        })
        .then(async() => {
            console.log('Zaxira nusxa tayyor');
            const auth = new google.auth.GoogleAuth({
                keyFile: process.env.GOOGLE_APPLICATION_CREDENTIALS,
                scopes: ['https://www.googleapis.com/auth/drive']
            });
            const drive = google.drive({ version: 'v3', auth });
            try {
                await drive.files.create({
                    resource: {
                        name: `${stamp}.sql`,
                        parents: [process.env.GOOGLE_DRIVE_FOLDER_ID],
                    },
                    media: {
                        mimeType: 'application/sql',
                        body: fs.createReadStream(dumpFile),
                    },
                    fields: 'id',
                });
            } catch (err) {
                console.error('Google Drive ga yuklashda xatolik:', err.message);
            }
        })
        .catch(err => {
            console.error('Zaxira nusxa olishda xatolik:', err.message);
        });
}

module.exports = Run;
