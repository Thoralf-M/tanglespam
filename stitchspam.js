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

spam(100000)

async function spam(length, time) {
    try {
        for (let j = 0; j < length; j++) {
            try {
                let trytes = await iota.prepareTransfers(config.seed, transfers)
                let tips = await iota.getTransactionsToApprove(2)
                let attachedTrytes = await powBundleFunc(trytes, tips.trunkTransaction, tips.branchTransaction, config.mwm)
                timeout(attachedTrytes, j)
                await new Promise(resolve => setTimeout(resolve, 20));
            } catch (err) { console.log(err) }
        }
    } catch (e) {
        console.log(e)
    }
}

async function timeout(attachedTrytes, j) {
    try {
        await new Promise(resolve => setTimeout(resolve, 50000));
        iota.storeAndBroadcast(attachedTrytes)
        let txHash = asTransactionObject(attachedTrytes[0]).hash
        // console.log(`Stitchspam tx ${j}/1 sent ${config.explorer + txHash}`)
        tips = await iota.getTransactionsToApprove(2)
        let trytes = await iota.prepareTransfers(config.seed, transfers)
        if (j % 2 == 0) {
            attachedTrytes = await powBundleFunc(trytes, txHash, tips.trunkTransaction, config.mwm)
        } else {
            attachedTrytes = await powBundleFunc(trytes, txHash, tips.branchTransaction, config.mwm)
        }
        iota.storeAndBroadcast(attachedTrytes)
        // console.log(`Stitchspam tx ${j}/2 sent ${config.explorer + asTransactionObject(attachedTrytes[0]).hash}`)
    } catch (er) { console.log(er) }
}