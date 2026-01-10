export let EXPLORER_URL = "";
let TESTNET = process.env.TESTNET

if (TESTNET) {
    EXPLORER_URL = "https://testnet.bscscan.com/";
} else {
    EXPLORER_URL = "https://testnet.bscscan.com/";
}
