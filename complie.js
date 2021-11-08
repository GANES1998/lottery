const fs = require('fs');
const path = require('path');
const solc = require('solc');

const LOTTERY_CONTRACT = 'Lottery';

const CONTRACT_PATH = path.resolve(__dirname, 'contracts', 'Lottery.sol');
const contract = fs.readFileSync(CONTRACT_PATH, 'utf8');
const compiledSource = solc.compile(contract);

const extractContract = (compiledSource, contractName) => compiledSource.contracts[`:${contractName}`];

module.exports = extractContract(compiledSource, LOTTERY_CONTRACT);







