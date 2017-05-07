var p = require('path');
var copy = require('copy');

var source = p.resolve(__dirname, '..', 'src', 'public');
var dest = p.resolve(__dirname, '..', 'dist', 'public');
copy(source + '/*', dest, (err, file) => {
    if (err) {
        console.log('Could not copy files');
    } else {
        console.log('Files copied.');
    }
});