const config = require('./config.json');
const { finalizeBundle, createBundle } = require('@iota/bundle');
const { trytesToTrits, valueToTrits, tritsToTrytes } = require('@iota/converter');
const { composeAPI } = require('@iota/core');
const { digests, normalizedBundle, signatureFragment, address } = require('@iota/signing');
const { asTransactionObject, asTransactionTrytes } = require('@iota/transaction-converter');
const { powBundleFunc } = require('entangled-node');

const iota = composeAPI({
    provider: config.node
})

main(5000, 4)
async function main(bundles, bundlesize) {
    let key = trytesToTrits("ADQAIFYKUTSTSRYELEDVCRMB9YAWXRRUADCCIWRJWRT9XCITNSKOOKLAWOVMCUWMCIMWWWTQIGDSNQPECFAEQICTHWGRQAIFYKUTSTSRYELEDVCRMB9YWWXRRUAKCCIWRJWRT9XCITNSKOOKLAWOVMCUWMCIMWWWTQIGDSNQPECFAEQICTHWGRQAIFYKUTSTSRYELEDVCRMB9YWWXRRUAKCCIWRJWRT9XCITNSKOOKLAWOVMCUWMCIMWWWTQIGDSNQPECFAEQICTHWGRQAIFYKUTSTSRYELEDVCRMB9YWWXRRUAKCCIWRJWRT9XCITNSKOOKLAWOVMCUWMCIMWWWTQIGDSNQPECFAEQICTHWGRQAIFYKUTSTSRYELEDVCRMB9YWWXRRUAKCCIWRJWRT9XCITNSKOOKLAWOVMCUWMCIMWWWTQIGDSNQPECFAEQICTHWGRQAIFYKUTSTSRYELEDVCRMB9YWWXRRUAKCCIWRJWRT9XCITNSKOOKLAWOVMCUWMCIMWWWTQIGDSNQPECFAEQICTHWGRQAIFYKUTSTSRYELEDVCRMB9YWWXRRUAKCCIWRJWRT9XCITNSKOOKLAWOVMCUWMCIMWWWTQIGDSNQPECFAEQICTHWGRQAIFYKUTSTSRYELEDVCRMB9YWWXRRUAKCCIWRJWRT9XCITNSKOOKLAWOVMCUWMCIMWWWTQIGDSNQPECFAEQICTHWGRQAIFYKUTSTSRYELEDVCRMB9YWWXRRUAKCCIWRJWRT9XCITNSKOOKLAWOVMCUWMCIMWWWTQIGDSNQPECFAEQICTHWGRQAIFYKUTSTSRYELEDFCRMB9YWWXRRUAKCCIWRJWRT9XCITNSKOOKLAWOVMCUWMCIMWWWTQIGDSNQPECFAEQICTHWGRQAIFYKUTSTSRYELEDVCRMB9YWWXRRUAKCCIWRJWRT9XCITNSKOOKLAWOVMCUWMCIMWWWTQIGDSNQPECFAEQICTHWGRQAIFYKUTSTSRYELEDVCRMB9YWWXRRUAKCCIWRJWRT9XCITNSKOOKLAWOVMCUWMCIMWWWTQIGDSNQPECFAEQICTHWGRQAIFYKUTSTSRYELEDVCRMB9YWWXRRUAKCCIWRJWRT9XCITNSKOOKLAWOVMCUWMCIMWWWTQIGDSNQPECFAEQICTHWGRQAIFYKUTSTSRYELEDVCRMB9YWWXRRUAKCCIWRJWRT9XCITNSKOOKLAWOVMCUWMCIMWWWTQIGDSNQPECFAEQICTHWGRQAIFYKUTSTSRYELEDVCRMB9YWWXRRUAKCCIWRJWRT9XCITNSKOOKLAWOVMCUWMCIMWWWTQIGDSNQPECFAEQICTHWGRQAIFYKUTSTSRYELEDVCRMB9YWWXRRUAKCCIWRJWRT9XCITNSKOOKLAWOVMCUWMCIAWWWTQIGDSNQPECFAEQICTHWGRQAIFYKUTSTSRYELEDVCRMB9YWWXRRUAKCCIWRJWRT9XCITNSKOOKLAWOVMCUWMCIMWWWTQIGDSNQPECFAEQICTHWGRQAIFYKUTSTSRYELEDVCRMB9YWWXRRUAKCCIWRJWRT9XCITNSKOOKLAWOVMCUWMCIMWWWTQIGDSNQPECFAEQICTHWGRQAIFYKUTSTSRYELEDVCRMB9YWWXRRUAKCCIWRJWRT9XCITNSKOOKLAWOVMCUWMCIMWWWTQIGDSNQPECFAEQICTHWGRQAIFYKUTSTSRYELEDVCRMB9YWWXRRUAKCCIWRJWFT9XCITNSKOOKLAWOVMCUWMCIMWWWTQIGDSNQPECFAEQICTHWGRQAIFYKUTSTSRYELEDVCRMB9YWWXRRUAKCCIWRJWRT9XCITNSKOOKLAWOVMCUWMCIMWWWTQIGDSNQPECFAEQICTHWGRQAIFYKUTSTSRYELEDVCRMB9YWWXRRUAKCCIWRJWRT9XCITCSKOOKLAWOVMCUWMCIMWWWTQIGDSNQPECFAEQICTHWGRQAIFYKUTSTSRYELEDVCRMB9YWWXRRUAKCCIWRJWRT9XCITNSKOOKLAWOVMCUWMCIMWWWTQIGDSNQPECFAEQICTHWGRQAIFYKUTSTSRYELEDVCRMB9YWWXRRUAKCCIWRJWRT9XCITNSKOOKLAWOVMCUWMCIMWWWTQIGDSNQPECFAEQICTHWGRQAIFYKUTSTSRYELEDVCRMB9YW")
    let digest = digests(key)
    let inputAddress = tritsToTrytes(address(digest))
    let issuanceTimestamp = valueToTrits(Math.floor(Date.now() / 1000))
    let amount = Math.floor(bundlesize / 2)
    let transfers = []
    for (let k = 0; k < amount; k++) {
        transfers.push({
            address: trytesToTrits(inputAddress),
            value: valueToTrits(2779530283277761),
            issuanceTimestamp
        }, {
            address: trytesToTrits(inputAddress),
            value: valueToTrits(-2779530283277761),
            issuanceTimestamp
        })
    }
    let createBundled = createBundle(transfers)
    let finalizedBundle = finalizeBundle(createBundled)
    let finalizedBundleTrytes = []
    for (let offset = 0; offset < finalizedBundle.length; offset += 8019) {
        finalizedBundleTrytes.push(tritsToTrytes(finalizedBundle.subarray(offset, offset + 8019)))
    }
    let finalizedBundleObjects = finalizedBundleTrytes.map(tx => asTransactionObject(tx))
    let finalizedBundleHash = finalizedBundleObjects[0].bundle
    let normalizedBundleHash = normalizedBundle(trytesToTrits(finalizedBundleHash))
    let signatureFragmentOne = tritsToTrytes(signatureFragment(normalizedBundleHash, key))
    for (var i = 0; i < finalizedBundleObjects.length; i++) {
        if (i % 2 != 0) {
            finalizedBundleObjects[i].signatureMessageFragment = signatureFragmentOne.slice(0, 2187)
        }
    }
    let finalTrytes = finalizedBundleObjects.map(e => asTransactionTrytes(e))
    for (let j = 0; j < bundles; j++) {
        try {
            let tips = await iota.getTransactionsToApprove(2)
            let attachedTrytes = await powBundleFunc(finalTrytes, tips.trunkTransaction, tips.branchTransaction, config.mwm)
            await iota.storeAndBroadcast(attachedTrytes)
            let tailhash = asTransactionObject(attachedTrytes[0]).hash
            console.log(`MoreThanSupply tx ${j} sent ${config.explorer + tailhash}`)
        } catch (e) {
            console.log(e)
        }
    }
}