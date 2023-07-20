import '@nomiclabs/hardhat-waffle';
import { task } from 'hardhat/config';
import { HardhatRuntimeEnvironment } from 'hardhat/types';

task('deploy', 'Deploy Basic Dutch Auction contract').setAction(
  async (_, hre: HardhatRuntimeEnvironment): Promise<void> => {

    const BasicDutchAuction = await hre.ethers.getContractFactory('BasicDutchAuction');
    const basicDutchAuction = await BasicDutchAuction.deploy(50,10,0.1);

    await basicDutchAuction.deployed();

    console.log('BasicDutchAuction deployed to:', basicDutchAuction.address);
  }
);
