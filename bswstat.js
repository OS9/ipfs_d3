var ipfsAPI = require('ipfs-api');
var ipfs = ipfsAPI('/ip4/127.0.0.1/tcp/5001');

exports.app = () => {
    ipfs.bitswap.stat((err, stats) => {
        // console.log(stats);
        return stats
    });
}