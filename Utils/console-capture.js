import fs from 'fs';
import path from 'path';

const logDir = path.join(process.cwd(), 'logs');
if (!fs.existsSync(logDir)) fs.mkdirSync(logDir);

const logFile = path.join(logDir, 'console.log');

const originalLog = console.log;
const originalError = console.error;

//Remove ANSI colors
const stripAnsi = str =>
  str.replace(/\x1B\[[0-9;]*m/g, '');

function format(args) {
  return args
    .map(a => {
      if (typeof a === 'object') {
        return JSON.stringify(a, null, 2);
      }
      return stripAnsi(String(a));
    })
    .join(' ');
}

console.log = (...args) => {
  const msg = format(args);
  fs.appendFileSync(logFile, msg + '\n');
  originalLog(...args);
};

console.error = (...args) => {
  const msg = format(args);
  fs.appendFileSync(logFile, msg + '\n');
  originalError(...args);
};
