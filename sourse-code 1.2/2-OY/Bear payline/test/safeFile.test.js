const test = require('node:test');
const assert = require('node:assert/strict');
const { safeFileName, isAllowedUpload, remoteFileName } = require('../server/resurs/funtion/safeFile');

test('safeFileName: yo\'l ajratgichlar va g\'alati belgilar olib tashlanadi', () => {
    assert.equal(safeFileName('../../etc/passwd.png'), 'passwd.png');
    assert.equal(safeFileName('..\\..\\win.jpg'), 'win.jpg');
    assert.equal(safeFileName('my photo (1).JPG'), 'my_photo__1_.jpg');
    assert.equal(safeFileName('shell.php'), 'shell');
    assert.equal(safeFileName(''), 'file');
});

test('isAllowedUpload: mime va kengaytma ikkalasi mos bo\'lishi kerak', () => {
    assert.equal(isAllowedUpload('image/png', 'a.png'), true);
    assert.equal(isAllowedUpload('application/pdf', 'a.PDF'), true);
    assert.equal(isAllowedUpload('image/png', 'a.php'), false);
    assert.equal(isAllowedUpload('text/html', 'a.png'), false);
    assert.equal(isAllowedUpload('application/x-sh', 'a.sh'), false);
});

test('remoteFileName: faqat fayl nomi qaytadi (path traversal yo\'q)', () => {
    const base = 'https://files.example.uz';
    assert.equal(remoteFileName(base + '/images/file-1.jpg', base), 'file-1.jpg');
    assert.equal(remoteFileName(base + '/images/../../etc/passwd', base), 'passwd');
    assert.equal(remoteFileName('', base), '');
});
