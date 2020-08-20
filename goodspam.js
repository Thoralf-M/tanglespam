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

spam(190000)
async function spam(length) {
    try {
        let trytes = await iota.prepareTransfers(config.seed, transfers)
        for (let j = 0; j < length; j++) {
            let tips = await iota.getTransactionsToApprove(2)
            let attachedTrytes = await powBundleFunc(trytes, tips.trunkTransaction, tips.branchTransaction, config.mwm)
            iota.storeAndBroadcast(attachedTrytes)
            // console.log(`Goodspam tx ${j} sent ${config.explorer + asTransactionObject(attachedTrytes[0]).hash}`)
        }
    } catch (e) {
        console.log(e)
    }
}