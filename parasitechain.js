const config = require('./config.json');
const { composeAPI } = require('@iota/core');
const { asTransactionObject } = require('@iota/transaction-converter');
const { powBundleFunc } = require('entangled-node');

const iota = composeAPI({
    provider: config.node
})

sendSidetangle(1000, 10)
async function sendSidetangle(length, width) {
    try {
        let nodeInfo = await iota.getNodeInfo()
        let txs = []
        let sidetangleTips
        let transfers = []
        let transfer = {
            value: 0,
            address: config.address,
            tag: config.tag
        }
        let bundlesize = 1
        for (let i = 0; i < bundlesize; i++) {
            transfers.push(transfer)
        }
        let trytes = await iota.prepareTransfers(config.seed, transfers)
        for (let j = 0; j < length; j++) {
            let attachedTrytes = []
            if (j == 0) {
                //  let tips = await iota.getTransactionsToApprove(2)
                attachedTrytes = await powBundleFunc(trytes, nodeInfo.latestMilestone, nodeInfo.latestMilestone, config.mwm)
            } else {
                if (j % 1000 == 0) {
                    nodeInfo = await iota.getNodeInfo()
                }
                attachedTrytes = await powBundleFunc(trytes, sidetangleTips[0], sidetangleTips[Math.floor(Math.random() * sidetangleTips.length)], config.mwm)
                // attachedTrytes = await powBundleFunc(trytes, sidetangleTips[0], nodeInfo.latestMilestone, config.mwm)
            }
            iota.storeAndBroadcast(attachedTrytes)
            await new Promise(resolve => setTimeout(resolve, 70));
            let txHash = asTransactionObject(attachedTrytes[0]).hash
            console.log(`Sidetangle tx ${j} sent ${config.explorer + txHash}`)
            txs.push(txHash)
            if (j == 0) {
                sidetangleTips = Array(width).fill(txHash)
            } else {
                sidetangleTips.push(txHash)
                sidetangleTips.shift()
            }
        }
    } catch (e) {
        console.log(e)
    }
}

