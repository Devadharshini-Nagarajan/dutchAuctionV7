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

// Account" 1 - Metamask 
const SEPOLIA_PRIVATE_KEY = "e75d907474395a60f67a1a09b62c0b780b4ebef6a107e313ce5f70c4475d038e";

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
      accounts: [`${SEPOLIA_PRIVATE_KEY}`]
    },
    sepolia: {
      url: `https://sepolia.infura.io/v3/${INFURA_API_KEY}`,
      accounts: [`${SEPOLIA_PRIVATE_KEY}`]
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
