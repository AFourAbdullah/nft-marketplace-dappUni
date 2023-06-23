import { ethers } from "ethers";
import React, { useEffect, useState } from "react";
import { Row, Col, Card, Button, Spinner } from "react-bootstrap";

const Home = ({ marketplace, nft }) => {
  const [items, setItems] = useState([]);
  const [loading, setloading] = useState(true);

  const loadMarketplaceItems = async () => {
    const itemCount = await marketplace.itemCount();
    let items = [];
    for (let index = 0; index < itemCount; index++) {
      const item = marketplace.items[index];
      if (!item.isSold) {
        const uri = await nft.tokenURI(item.tokenId);
        const res = await fetch(uri);
        const metadata = await res.json();
        const totalPrice = await marketplace.getTotalPrice(item.itemId);
        items.push({
          totalPrice,
          itemId: item.itemId,
          seller: item.seller,
          name: metadata.name,
          description: metadata.description,
          image: metadata.image,
        });
      }
    }
    setItems(items);
    setloading(false);
  };
  const buyItems = async (item) => {
    await (
      await marketplace.purchaseNft(item.itemId, { value: item.totalPrice })
    ).wait(1);
    loadMarketplaceItems();
  };
  useEffect(() => {
    loadMarketplaceItems();
  }, []);
  return (
    <div className="flex justify-center">
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
          <p className="mx-3 my-0">Loading Nfts...</p>
        </div>
      ) : items.length > 0 ? (
        <div className="px-5 container">
          <Row className="g-4 py-5">
            {items.map((item, idx) => (
              <Col key={idx} className="overflow-hidden">
                <Card>
                  <Card.Img variant="top" src={item.image} />
                  <Card.Body color="secondary">
                    <Card.Title>{item.name}</Card.Title>
                    <Card.Text>{item.description}</Card.Text>
                  </Card.Body>
                  <Card.Footer>
                    <div className="d-grid">
                      <Button
                        onClick={() => buyItems(item)}
                        variant="primary"
                        size="lg"
                      >
                        Buy for {ethers.utils.formatEther(item.totalPrice)} ETH
                      </Button>
                    </div>
                  </Card.Footer>
                </Card>
              </Col>
            ))}
          </Row>
        </div>
      ) : (
        <div>NO Nfts Found..</div>
      )}
    </div>
  );
};

export default Home;
