const secret = Math.random().toString(36).substring(7);

module.exports = {
    secret,
    lobbyTimeout: 10000,
    lobbyTimeoutCheckInterval: 5000,
    port: 3000,
    baseUrl: '/ludo/'      //For use with reverse proxies.
};
