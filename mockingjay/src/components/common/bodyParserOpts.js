'use strict';

const Opts = {
    common: {
        enableTypes: ['json', 'form', 'text'],
        onerror: function (err, ctx) {
            logger.error(err);
        }
    }
};

exports = module.exports = Opts;