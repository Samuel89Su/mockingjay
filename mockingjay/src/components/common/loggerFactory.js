'use strict';

const Bunyan = require('bunyan');
const fs = require('fs');
const path = require('path');

class LoggerFactory {
    constructor(arg) {
        if (arg.env) {
            this.env = arg.env;
        }
        if (arg.folder) {
            this.folder = arg.folder;
        }
        if (arg.option) {
            
        }
        this.Options = {
            dev: {
                level: 'debug',      // Optional, see "Levels" section
                streams:             // Optional, see "Streams" section 
                    [ 
                        {
                            level: 'debug',
                            type: 'file',
                        }
                    ]
            },
            default: {
                level: 'warn',      // Optional, see "Levels" section
                streams: [{
                    level: 'warn',
                    type: 'file',
                }]
            },
        };
    }

    createLogger(name) {
        if (!fs.existsSync(this.folder)) {
            fs.mkdirSync(this.folder);
        }

        let option = this.Options.default;
        if (this.Options[this.env]) {
            option = this.Options[this.env];
        }
        option.name = name;
        option.streams.map((stream) => {
            stream.path = path.join(this.folder, stream.level + '.log');
            // if (!fs.existsSync(stream.path)) {
            //     fs.writeFileSync(stream.path, '', 'utf8');
            // }
        });
        let logger = Bunyan.createLogger(option);
        return logger;
    }
}


exports = module.exports = LoggerFactory;