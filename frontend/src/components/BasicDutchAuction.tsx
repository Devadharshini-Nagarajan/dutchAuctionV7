import { useWeb3React } from '@web3-react/core';
import { Contract, ethers, Signer } from 'ethers';
import {
  ChangeEvent,
  MouseEvent,
  ReactElement,
  useEffect,
  useState
} from 'react';
import { Provider } from '../utils/provider';
import { SectionDivider } from './SectionDivider';
import AuctionArtifact from '../artifacts/contracts/BasicDutchAuction.sol/BasicDutchAuction.json';

export function BasicDutchAuction(): ReactElement {
  const context = useWeb3React<Provider>();
  const { account, active, library } = context;

  const [signer, setSigner] = useState<Signer>();
  const [basicAuctionContract, setBasicAuctionContract] = useState<Contract>();
  const [basicAuctionContractAddr, setBasicAuctionContractAddr] =
    useState<string>('');
  const [reservePriceField, setReservePriceField] = useState<string>('');
  const [numBlocksAuctionOpenField, setNumBlocksAuctionOpenField] =
    useState<string>('');
  const [offerPriceDecrementField, setOfferPriceDecrementField] =
    useState<string>('');
  const [reservePrice, setReservePrice] = useState<string>('');
  const [numBlocksAuctionOpen, setNumBlocksAuctionOpen] = useState<string>('');
  const [offerPriceDecrement, setOfferPriceDecrement] = useState<string>('');
  const [currentPrice, setCurrentPrice] = useState<string>('');
  const [initialPrice, setInitialPrice] = useState<string>('');
  const [winner, setWinner] = useState<string>('');
  const [ownerAddr, setOwnerAddr] = useState<string>('');

  const [contractAddrField, setContractAddrField] = useState<string>('');
  const [contractAddr, setContractAddr] = useState<string>('');

  const [bidField, setBidField] = useState<string>('');
  const [bidResult, setBidResult] = useState<string>('');

  useEffect((): void => {
    if (!library) {
      setSigner(undefined);
      return;
    }
    setSigner(library.getSigner());
  }, [library]);

  const deployAuction = () => {
    // only deploy the Greeter contract one time, when a signer is defined
    if (basicAuctionContract || !signer) {
      return;
    }

    async function deployAuctionContract(signer: Signer): Promise<void> {
      const auction = new ethers.ContractFactory(
        AuctionArtifact.abi,
        AuctionArtifact.bytecode,
        signer
      );

      try {
        const auctionContract = await auction.deploy(
          ethers.utils.parseEther(reservePriceField),
          numBlocksAuctionOpenField,
          ethers.utils.parseEther(offerPriceDecrementField)
        );

        await auctionContract.deployed();
        let ownerAddr = await auctionContract.owner();
        setOwnerAddr(ownerAddr);

        setBasicAuctionContract(auctionContract);

        window.alert(
          `Auction contract deployed to: ${auctionContract.address}`
        );

        setBasicAuctionContractAddr(auctionContract.address);
      } catch (error: any) {
        window.alert(
          'Error!' + (error && error.message ? `\n\n${error.message}` : '')
        );
      }
    }

    deployAuctionContract(signer);
  };

  const showAuctionInfo = () => {
    if (!basicAuctionContract) {
      window.alert('Undefined Auction Contract');
      return;
    }

    if (!contractAddrField) {
      window.alert('Address cannot be empty');
      return;
    }

    async function submitAdress(auctionContract: Contract): Promise<void> {
      try {
        const reservePrice = await auctionContract.reservePrice();
        setReservePrice(ethers.utils.formatEther(reservePrice));

        const numBlocksAuctionOpen =
          await auctionContract.numBlocksAuctionOpen();
        setNumBlocksAuctionOpen(numBlocksAuctionOpen.toNumber().toString());

        const offerPriceDecrement = await auctionContract.offerPriceDecrement();
        const formattedOfferPriceDecrement: any =
          ethers.utils.formatEther(offerPriceDecrement);
        setOfferPriceDecrement(formattedOfferPriceDecrement);

        const initialPrice = await auctionContract.initialPrice();
        const formattedInitialPrice: any =
          ethers.utils.formatEther(initialPrice);
        setInitialPrice(formattedInitialPrice);

        const currentBlock = library ? await library.getBlockNumber() : 0;
        const startBlock = await auctionContract.auctionStartBlock();

        const blockPassed = currentBlock - startBlock.toNumber();

        const currentPrice: any =
          parseFloat(formattedInitialPrice) -
          blockPassed * parseFloat(formattedOfferPriceDecrement);
        setCurrentPrice(currentPrice.toString());

        console.log(
          'formattedInitialPrice - ',
          formattedInitialPrice,
          'currentBlock - ',
          currentBlock,
          'startBlock -',
          startBlock.toNumber(),
          'blockPassed - ',
          blockPassed,
          'currentPrice - ',
          currentPrice
        );

        const winner = await auctionContract.winner();
        setWinner(winner ? winner : 'winner not decided');
      } catch (error: any) {
        window.alert(
          'Error!' + (error && error.message ? `\n\n${error.message}` : '')
        );
      }
    }

    submitAdress(basicAuctionContract);
  };
  const submitBid = () => {
    if (!basicAuctionContract) {
      window.alert('Undefined Auction Contract');
      return;
    }

    if (!bidField) {
      window.alert('Bid amount cannot be empty');
      return;
    }

    async function submitBid(auctionContract: Contract): Promise<void> {
      try {
        const bidxn = await auctionContract.bid({
          value: ethers.utils.parseEther(bidField)
        });

        await bidxn.wait();
        setBidResult('Successfully placed bid');
        window.alert(`Successfully placed bid of ${bidField}`);
      } catch (error: any) {
        window.alert(
          'Error!' + (error && error.message ? `\n\n${error.message}` : '')
        );
        setBidResult(
          `Bid failed! ${
            error && error.data?.message ? error.data?.message : ''
          } - ${error && error.message ? `\n\n${error.message}` : ''})`
        );
      }
    }

    submitBid(basicAuctionContract);
  };

  return (
    <>
      <div>
        <h2> Deployment</h2>
        <div className="input-field">
          <label>Reserve Price:</label>
          <input
            type="number"
            value={reservePriceField}
            readOnly={basicAuctionContract ? true : false}
            onChange={(e) => setReservePriceField(e.target.value)}
          />
        </div>
        <br />
        <div className="input-field">
          <label>Number of Blocks Auction Open:</label>
          <input
            type="number"
            value={numBlocksAuctionOpenField}
            readOnly={basicAuctionContract ? true : false}
            onChange={(e) => setNumBlocksAuctionOpenField(e.target.value)}
          />
        </div>
        <br />
        <div className="input-field">
          <label>Offer Price Decrement:</label>
          <input
            type="number"
            value={offerPriceDecrementField}
            readOnly={basicAuctionContract ? true : false}
            onChange={(e) => setOfferPriceDecrementField(e.target.value)}
          />
        </div>
        <br />
        <button
          onClick={deployAuction}
          disabled={!active || (active && basicAuctionContract) ? true : false}
          className={`button ${
            !active || (active && basicAuctionContract)
              ? 'btndisabled'
              : 'button1'
          } `}
        >
          Deploy
        </button>
        <br />

        {basicAuctionContract && (
          <div>
            <div className="details-row">
              <label>Newly Created Auction Address:</label>
              <span>{basicAuctionContractAddr}</span>
            </div>

            <h2>Section 2: Look up info on an auction</h2>
            <div className="input-field">
              <label>Auction Address:</label>
              <input
                type="text"
                value={contractAddrField}
                onChange={(e) => setContractAddrField(e.target.value)}
              />
            </div>
            <br />
            <button
              onClick={showAuctionInfo}
              className={`button ${!active ? 'btndisabled' : 'button2'} `}
            >
              Show Info
            </button>

            <br />
            <div className="details-row">
              <label>Winner:</label>
              <span>{winner}</span>
            </div>
            <br />
            <div className="details-row">
              <label>Reserve Price:</label>
              <span>{reservePrice}</span>
            </div>
            <br />
            <div className="details-row">
              <label>No of Blocks Auction Open:</label>
              <span>{numBlocksAuctionOpen}</span>
            </div>
            <br />
            <div className="details-row">
              <label>Offer Price Decrement:</label>
              <span>{offerPriceDecrement}</span>
            </div>
            <br />
            <div className="details-row">
              <label>Initial Price:</label>
              <span>{initialPrice}</span>
            </div>
            <br />
            <div className="details-row">
              <label>Current Price:</label>
              <span>{currentPrice}</span>
            </div>
            <br />
            {ownerAddr !== account && (
              <div>
                <h2>Section 3: Submit a bid</h2>
                <div className="input-field">
                  <label>Bid Amount:</label>
                  <input
                    type="number"
                    value={bidField}
                    onChange={(e) => setBidField(e.target.value)}
                  />
                </div>
                <br />

                <button
                  onClick={submitBid}
                  className={`button ${!active ? 'btndisabled' : 'button1'} `}
                >
                  Place Bid
                </button>
                <br />
                <div className="details-row">
                  <label>Bid Result:</label>
                  <span>{bidResult}</span>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}
