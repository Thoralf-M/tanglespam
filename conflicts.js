const config = require('./config.json');
const axios = require('axios');
const { composeAPI, generateAddress } = require('@iota/core');
const { asTransactionObject } = require('@iota/transaction-converter');
const { powBundleFunc } = require('entangled-node');
const iota = composeAPI({
    provider: config.node
})


main()
async function main() {
    try {
        let { balance, address } = await getIotas()
        let oldAddress = address
        console.log("First address: " + oldAddress);
        let nextAddress = ""
        for (let j = 1; j < 10000; j++) {
            nextAddress = generateAddress(config.seed, j, 1, false)
            for (let i = 1; i < 10000; i++) {
                let tailHash1 = await sendToNextIndex(balance, oldAddress, nextAddress, j)
                console.log(`Conflict tx ${j} 1 sent ${config.explorer + tailHash1}`)
                let tailHash2 = await sendToNextIndex(balance, oldAddress, nextAddress, j)
                console.log(`Conflict tx ${j} 2 sent ${config.explorer + tailHash2}`)
                if (i % 10 == 0) {
                    let balances = await iota.getBalances([nextAddress])
                    if (balances.balances[0] > 0) {
                        console.log("Transfers confirmed: " + j);
                        oldAddress = nextAddress
                        break
                    }
                }
            }
        }

    }
    catch (err) {
        console.log(err)
    }
}

async function getIotas() {
    try {
        let address = generateAddress(config.seed, 0, 1, true)
        let res = await axios.post("https://faucet.comnet.einfachiota.de/pay_tokens", {
            "address": address,
            "value": 1,
        })
        if (typeof res.data.msg != 'undefined') {
            throw res.data.msg
        }
        for (let j = 0; j < 100; j++) {
            await new Promise(resolve => setTimeout(resolve, 1000));
            let balances = await iota.getBalances([address])
            if (balances.balances[0] > 0) {
                console.log(`Received ${balances.balances[0]}i`);
                return { balance: balances.balances[0], address }
            }
        }
        throw "Couldn't get funds"
    }
    catch (err) {
        console.log(err)
    }
}

async function sendToNextIndex(balance, currentAddress, nextAddress, index) {
    try {
        let transfers = [{
            value: balance,
            address: nextAddress,
            tag: config.tag
        }]
        let options = {
            'inputs': [{
                address: currentAddress,
                keyIndex: index - 1,
                balance: balance,
                security: 1,
            }]
        }
        let trytes = await iota.prepareTransfers(config.seed, transfers, options)
        let tips = await iota.getTransactionsToApprove(1)
        let attachedTrytes = await powBundleFunc(trytes, tips.trunkTransaction, tips.branchTransaction, config.mwm)
        iota.storeAndBroadcast(attachedTrytes)
        return asTransactionObject(attachedTrytes[0]).hash
    }
    catch (err) {
        console.log(err)
    }
}