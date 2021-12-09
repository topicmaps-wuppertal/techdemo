import React, { useRef, useEffect, useState } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import "./mapLibre.css";

export default function Map(props = { opacity: 0.1 }) {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [lng] = useState(7.150764);
  const [lat] = useState(51.256);
  const [zoom] = useState(14);
  let opacity, textOpacity, iconOpacity; // } = props;

  //   opacity = 0.5;
  //   textOpacity = 1;
  //   iconOpacity = 1;
  useEffect(() => {
    if (map.current) return;
    map.current = new maplibregl.Map({
      container: mapContainer.current,
      style: `https://omt.map-hosting.de/styles/osm-bright/style.json`,
      center: [lng, lat],
      zoom: zoom,
    });
    console.log("map.current", map.current);

    if (opacity || textOpacity || iconOpacity) {
      map.current.getStyle().layers.map((layer) => {
        if (layer.type === "symbol") {
          map.current.setPaintProperty(layer.id, `icon-opacity`, iconOpacity || opacity || 1);
          map.current.setPaintProperty(layer.id, `text-opacity`, textOpacity || opacity || 1);
        } else {
          map.current.setPaintProperty(layer.id, `${layer.type}-opacity`, opacity || 1);
        }
      });
    }

    map.current.on("load", function () {
      console.log('on"load"');

      map.current.addSource("wms-test-source", {
        type: "raster",
        // use the tiles option to specify a WMS tile source URL
        // https://maplibre.org/maplibre-gl-js-docs/style-spec/sources/
        tiles: [
          "https://maps.wuppertal.de/deegree/wms?service=WMS&request=GetMap&layers=R102%3Atrueortho202010&styles=&format=image%2Fpng&transparent=false&version=1.1.1&tiled=true&type=wms&cssFilter=undefined&width=256&height=256&srs=EPSG%3A3857&bbox={bbox-epsg-3857}",
        ],
        tileSize: 256,
      });
      map.current.addLayer(
        {
          id: "wms-test-layer",
          type: "raster",
          opacity: 0.5,
          source: "wms-test-source",
          paint: {},
        },
        "waterway-name"
      );

      map.current.setPaintProperty("wms-test-layer", "raster-opacity", 0.5);
    });

    map.current.addControl(new maplibregl.NavigationControl(), "top-left");
  });

  return (
    <div className='map-wrap'>
      <div ref={mapContainer} className='map' />
    </div>
  );
}
