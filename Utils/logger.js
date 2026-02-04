const fs = require('fs');
const path = require('path');

const logsDir = path.join(process.cwd(), 'logs');
const logFile = path.join(logsDir, 'automation.log');

if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir);
}

function writeLog(level, message, testInfo) {
  const timestamp = new Date().toISOString();
  const logLine = `[${timestamp}] [${level}] ${message}\n`;

  // terminal
  console.log(logLine.trim());

  // file
  fs.appendFileSync(logFile, logLine);

  // ✅ SAFE attachment
  if (testInfo) {
    testInfo.attach(`${level} Log`, {
      body: logLine,
      contentType: 'text/plain'
    });
  }
}

module.exports = {
  logger: {
    info: (msg, testInfo) => writeLog('INFO', msg, testInfo),
    warn: (msg, testInfo) => writeLog('WARN', msg, testInfo),
    error: (msg, testInfo) => writeLog('ERROR', msg, testInfo),
  }
};
