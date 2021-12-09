import { Link } from "react-router-dom";
import { Card, Row, Col } from "antd";

const { Meta } = Card;

export default function Landing() {
  return (
    <div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <h2 style={{ width: "80%", margin: 20 }}>
          Demo Basistechnologie für dig. FußgängerIS (WIP)
        </h2>
        <a href={"/#/topicmapWithNewLocator"}>
          <Card
            hoverable
            style={{ width: 240, margin: 20 }}
            cover={<img alt='example' src={process.env.PUBLIC_URL + "/locator.jpeg"} />}
          >
            <Meta title='Standortvisualisierung' description='mit Richtungsanzeige' />
          </Card>
        </a>
        <a href={"/#/turnableTopicMap"}>
          <Card
            hoverable
            style={{ width: 240, margin: 20 }}
            cover={<img alt='example' src={process.env.PUBLIC_URL + "/turnableMap.jpeg"} />}
          >
            <Meta title='TopicMap 3.0?' description='dreh- und kippbare Karte' />
          </Card>
        </a>
        {/* <a href='/sensorDemo'>
          <Card
            hoverable
            style={{ width: 240, margin: 20 }}
            cover={
              <img alt='example' src='https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png' />
            }
          >
            <Meta title='Kompass auslesen' description='Techdemo' />
          </Card>
        </a> */}
      </div>
    </div>
  );
}
