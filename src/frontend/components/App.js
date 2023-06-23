import logo from "./logo.png";
import "./App.css";
import { ethers } from "ethers";
import { useState } from "react";
import MarketplaceAddressFile from "../contractsData/Marketplace-address.json";
import NftAddressFile from "../contractsData/NFT-address.json";
import MarketplaceAbi from "../contractsData/Marketplace.json";
import NftAbi from "../contractsData/NFT.json";
import Navigation from "./Navbar";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./Home";
import Create from "./Create";
import MyListedItems from "./MyListedItems";
import MyPurchaseItems from "./MyPurchaseItems";
import { Spinner } from "react-bootstrap";
function App() {
  const [accountConnected, setAccountConnected] = useState(null);
  const [loading, setloading] = useState(true);
  const [NftContract, setNftContract] = useState({});
  const [MarketplaceContract, setMarketplaceContract] = useState({});
  const web3Handler = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const accounts = await window.ethereum.request({
      method: "eth_requestAccounts",
    });
    setAccountConnected(accounts[0]);
    const signer = provider.getSigner();
  };
  const loadContracts = async (signer) => {
    const marketplaceContract = await ethers.Contract(
      MarketplaceAddressFile.address,
      MarketplaceAbi.abi,
      signer
    );
    setMarketplaceContract(marketplaceContract);
    const nftContract = await ethers.Contract(
      NftAddressFile.address,
      NftAbi.abi,
      signer
    );
    setNftContract(nftContract);
    setloading(false);
  };
  return (
    <BrowserRouter>
      <div>
        <Navigation web3Handler={web3Handler} account={accountConnected} />
        {loading ? (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              minHeight: "80vh",
            }}
          >
            <Spinner animation="border" style={{ display: "flex" }} />
            <p className="mx-3 my-0">Awaiting Metamask Connection...</p>
          </div>
        ) : (
          <Routes>
            <Route
              exact
              path="/"
              element={
                <Home marketplace={MarketplaceContract} nft={NftContract} />
              }
            />
            <Route
              exact
              path="/create"
              element={
                <Create marketplace={MarketplaceContract} nft={NftContract} />
              }
            />
            <Route exact path="/my-listed-items" element={<MyListedItems />} />
            <Route
              exact
              path="/my-purchase-items"
              element={<MyPurchaseItems />}
            />
          </Routes>
        )}
      </div>
    </BrowserRouter>
  );
}

export default App;
