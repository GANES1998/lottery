const HDWalletProvider = require('@truffle/hdwallet-provider');
const Web3 = require('web3');
const {bytecode, interface} = require('./complie');

const hdProvider = new HDWalletProvider(
    'suit abuse lyrics jeans defy enroll profit menu pill oak margin myself',
    'https://ropsten.infura.io/v3/0df6654d885a4f3697fffa8e0fdbf8e9'
);

const web3 = new Web3(hdProvider);

const deploy = async () => {

    try {
        const accounts = await web3.eth.getAccounts();
        const mainAccount = accounts[0];

        const lottery = await new web3.eth.Contract(JSON.parse(interface))
            .deploy({data: bytecode})
            .send({from: mainAccount, gas: '1000000'});

        console.log(lottery.options.address);
        console.log(interface);
    } catch (err) {
        console.error(err);
    }
}

deploy();