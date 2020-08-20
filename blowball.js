const config = require('./config.json');
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

sendBlowball(190000)
async function sendBlowball(length) {
    try {
        let nodeinfo
        let milestone
        let trytes = await iota.prepareTransfers(config.seed, transfers)
        for (let j = 0; j < length; j++) {
            let attachedTrytes = []
            if (j % 700 == 0) {
                nodeinfo = await iota.getNodeInfo()
                milestone = nodeinfo.latestMilestone

                attachedTrytes = await powBundleFunc(trytes, milestone, milestone, config.mwm)
            } else {
                attachedTrytes = await powBundleFunc(trytes, milestone, milestone, config.mwm)
            }
            iota.storeAndBroadcast(attachedTrytes)
            // console.log(`Blowball tx ${j} sent ${config.explorer + asTransactionObject(attachedTrytes[0]).hash}`)
            if (j % 30 == 0) {
                //timeout so txs get broadcasted
                await new Promise(resolve => setTimeout(resolve, 20));
            }
        }
    } catch (e) {
        console.log(e)
    }
}