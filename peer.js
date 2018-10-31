var ipfsAPI = require('ipfs-api');
var ipfs = ipfsAPI('/ip4/127.0.0.1/tcp/5001');

exports.app = () => {
    ipfs.swarm.peers(function(err, peers){
      if (err){
        throw err;
      }
      console.log(peers);
    });
}