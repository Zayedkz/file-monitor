const chokidar = require('chokidar');
const fs = require('fs')
const ip = require('ip')
const logs = require('./log')

chokidar.watch('./files').on('all', (event, path, stats) => {
  createLog(event, path, stats);
});

function createLog(event, path, stats) {
    var message = "";
    switch(event) {
        case('add'): 
            message = `Created new file: ${path}`;
            break;
        case('change'):
            message = `Changed file at ${path}`;
            break;
        case('unlink'):
            message = `Deleted file at ${path}`;
            break; 
        case('addDir'):
            message = `Created new directory at ${path}`;
            break; 
        case('unlinkDir'):
            message = `Deleted directory at ${path}`;
            break;  
        default:
            message = "Unknown event"
            break;
    }
    let date = new Date();
    const newLog = {
        ip: ip.address(),
        date: date.toDateString() + ' ' + date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds(),
        event: event,
        path: path,
        stats: stats,
        message: message
    }
    logs.logs.push(newLog);
    let data = JSON.stringify(logs, null, 2);
    fs.writeFileSync('log.json', data);
    console.log('[' + newLog.date, newLog.ip + ']',  newLog.message)
}
