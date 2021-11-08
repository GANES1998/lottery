const {bytecode, interface} = require('../complie');
const ganache = require('ganache-cli');
const Web3 = require('web3');
const assert = require('assert');

const web3 = new Web3(ganache.provider());

let lottery;
let accounts;

beforeEach(async () => {

    accounts = await web3.eth.getAccounts();

    lottery = await new web3.eth.Contract(JSON.parse(interface))
        .deploy({data: bytecode})
        .send({from: accounts[0], gas: '1000000' });
})

describe('Test Lottery Contract', () => {

    it('Check deployment', function () {

        assert(lottery.options.address);

    });

    it('should set manager correctly', async function () {

        const message = await lottery.methods.manager().call();
        assert(message === accounts[0]);

    });

    it('should test entering the lottery', async function () {

        try {
            const transactionHash = await lottery.methods.enter().call({});
            assert.fail(`The contract is passing with no payment`);
        } catch (err) {
            assert.ok(err);
        }

    });

    it('should test a player entering a lottery', async function () {

        const transactionHash = await lottery.methods.enter().send({
            from: accounts[1],
            value: web3.utils.toWei('0.01')
        });

        const players = await lottery.methods.getPlayers().call();
        assert.equal(players[0], accounts[1]);

        const manager = await lottery.methods.manager().call();
        assert.equal(manager, accounts[0]);

    });

    it('should test only manager can pick a winner', async function () {

        try {
            const txnHash = await lottery.methods.pickWinner().send({
                from: accounts[1]
            });

            assert.fail('Not even a manager can pick a winner')
        } catch (err) {
            assert.ok(err);
        }

        await lottery.methods.enter().send({
            from: accounts[1],
            value: web3.utils.toWei('0.01')
        });
        const txtHash = await lottery.methods.pickWinner().send({
            from: accounts[0]
        });
        const players = await lottery.methods.getPlayers().call();
        assert.equal(players.length, 0);
        // assert.equal(accounts[0].value, account1Value + account2Value);

    });

    it('should test pickWinner', async function () {

        const acc1balance = await web3.eth.getBalance(accounts[1]);
        const acc2balance = await web3.eth.getBalance(accounts[2]);

        await lottery.methods.enter().send({
            from: accounts[1],
            value: web3.utils.toWei('0.01', 'ether')
        });

        await lottery.methods.enter().send({
            from: accounts[2],
            value: web3.utils.toWei('0.01', 'ether')
        });

        const players = await lottery.methods.getPlayers().call();

        assert.equal(players.length, 2)
        assert.equal(players[0], accounts[1]);
        assert.equal(players[1], accounts[2]);


        await lottery.methods.pickWinner().send({
            from: accounts[0]
        });

        const newAcc1Balance = await web3.eth.getBalance(accounts[1]);
        const newAcc2Balance = await web3.eth.getBalance(accounts[2]);

        console.log(`${acc1balance} ${newAcc1Balance} ${acc2balance} ${newAcc2Balance}`);

        if(newAcc1Balance > acc1balance) {
            assert(newAcc1Balance - acc1balance > web3.utils.toWei('0.009', 'ether'));
        } else {
            assert(newAcc2Balance - acc2balance > web3.utils.toWei('0.009', 'ether'));
        }

    });

})