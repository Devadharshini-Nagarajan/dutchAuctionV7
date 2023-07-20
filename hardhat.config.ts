import * as dotenv from 'dotenv';

import { HardhatUserConfig } from 'hardhat/config';
import '@nomiclabs/hardhat-etherscan';
import '@nomiclabs/hardhat-waffle';
import '@typechain/hardhat';
import 'hardhat-gas-reporter';
import 'solidity-coverage';

import './tasks/deploy';

dotenv.config();

const INFURA_API_KEY = "269244dc1eee422fa70b94d8b2d584e3";

// Account 3 - 1 - Metamask 
const GOERLI_PRIVATE_KEY = "59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d";

const config: HardhatUserConfig = {
  solidity: '0.8.4',
  paths: {
    artifacts: './frontend/src/artifacts'
  },
  networks: {
    hardhat: {
      mining: {
        auto: false,
        interval: 1000
      }
    },
    goerli: {
      url: `https://goerli.infura.io/v3/${INFURA_API_KEY}`,
      accounts: [`${GOERLI_PRIVATE_KEY}`]
    },
    sepolia: {
      url: `https://sepolia.infura.io/v3/${INFURA_API_KEY}`,
      accounts: [`${GOERLI_PRIVATE_KEY}`]
    }
    // ropsten: {
    //   url: process.env.ROPSTEN_URL || '',
    //   accounts:
    //     process.env.TEST_ETH_ACCOUNT_PRIVATE_KEY !== undefined
    //       ? [process.env.TEST_ETH_ACCOUNT_PRIVATE_KEY]
    //       : []
    // }
  },
  gasReporter: {
    enabled: process.env.REPORT_GAS !== undefined,
    currency: 'USD'
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY
  }
};

export default config;
