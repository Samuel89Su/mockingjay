'use strict';


async function Home(ctx, next) {
    ctx.body = 'Hello World!';
    await next();
}

exports = module.exports = Home;