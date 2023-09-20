
const fs = require('fs');
const path = require('path');

const logDirectory = 'server'; 
const logFilePath = path.join(logDirectory, 'server.log');


if (!fs.existsSync(logDirectory)) {
  fs.mkdirSync(logDirectory);
}

function log(message) {
  const timestamp = new Date().toISOString();
  const logMessage = `${timestamp}: ${message}\n`;

  fs.appendFile(logFilePath, logMessage, (err) => {
    if (err) {
      console.error('Error writing to log file:', err);
    }
  });
}

module.exports = { log };
