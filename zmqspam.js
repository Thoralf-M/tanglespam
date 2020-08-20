const config = require('./config.json');
const zmq = require("zeromq")
const { composeAPI } = require('@iota/core');
const { asTransactionObject } = require('@iota/transaction-converter');
const { powBundleFunc } = require('entangled-node');
const iota = composeAPI({
    provider: config.node
})
let transfers = [{
    value: 0,
    address: config.address,
    tag: config.tag
}]

var tips = [];

run()
async function run() {
    const sock = new zmq.Subscriber
    sock.connect(config.zmqnode)
    sock.subscribe('tx')
    for await (const msg of sock) {
        const data = msg.toString().split(' ')
        switch (
        data[0] // Use index 0 to match topic
        ) {
            case 'tx':
                // Only use tail txs
                if (data[6] == 0) {
                    tips.push(data[1])
                }
        }
    }
}
spam()

async function spam() {
    trytes = await iota.prepareTransfers(config.seed, transfers)
    for (let i = 0; i < 10000; i++) {
        await new Promise(resolve => setTimeout(resolve, 100));
        try {
            for (let j = 0; j < 600; j++) {
                if (tips.length > 1) {
                    let attachedTrytes = await powBundleFunc(trytes, tips.shift(), tips[0], config.mwm)
                    iota.storeAndBroadcast(attachedTrytes)
                    // console.log(`Zmq tx sent ${config.explorer + asTransactionObject(attachedTrytes[0]).hash}`)
                    await new Promise(resolve => setTimeout(resolve, 1));
                    if (tips.length > 100) {
                        tips = tips.slice(tips.length - 30, tips.length - 1)
                    }
                }
            }
        } catch (e) {
            console.log(e)
        }
    }

}
