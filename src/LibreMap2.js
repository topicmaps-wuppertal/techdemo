import React, { useRef, useEffect, useState } from "react";
// eslint-disable-next-line import/no-webpack-loader-syntax
import maplibregl from "!maplibre-gl";
import maplibreglWorker from "maplibre-gl/dist/maplibre-gl-csp-worker";

import "maplibre-gl/dist/maplibre-gl.css";
import "./mapLibre.css";
import { Button } from "react-bootstrap";
import { Map } from "maplibre-gl";
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

maplibregl.workerClass = maplibreglWorker;

export default function LibreMap(props = { opacity: 0.1 }) {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [lng] = useState(7.20009);
  const [lat] = useState(51.272034);
  const [zoom] = useState(18);
  let opacity, textOpacity, iconOpacity; // } = props;

  //   opacity = 0.5;
  //   textOpacity = 1;
  //   iconOpacity = 1;
  useEffect(() => {
    if (map.current) return;
    map.current = new maplibregl.Map({
      container: mapContainer.current,
      style: `https://omt.map-hosting.de/styles/osm-bright/style.json`,
  //  style: `https://sgx.geodatenzentrum.de/gdz_basemapde_vektor/styles/bm_web_col.json`,
      // style: `https://sgx.geodatenzentrum.de/gdz_basemapde_vektor/styles/bm_web_top.json`,
      // style: `https://sgx.geodatenzentrum.de/gdz_basemapde_vektor/styles/bm_web_gry.json`,
      center: [lng, lat],
      zoom: zoom,
      opacity: 1,
      maxZoom: 19,
      pitch:45  
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


      //model
      // parameters to ensure the model is georeferenced correctly on the map
      var modelOrigin = [7.199939,51.272400];
      var modelAltitude = 0;
      var modelRotate = [Math.PI / 2, 0, 0];

      var modelAsMercatorCoordinate = maplibregl.MercatorCoordinate.fromLngLat(
          modelOrigin,
          modelAltitude
      );

      // transformation parameters to position, rotate and scale the 3D model onto the map
      var modelTransform = {
          translateX: modelAsMercatorCoordinate.x,
          translateY: modelAsMercatorCoordinate.y,
          translateZ: modelAsMercatorCoordinate.z,
          rotateX: modelRotate[0],
          rotateY: modelRotate[1],
          rotateZ: modelRotate[2],
          /* Since our 3D model is in real world meters, a scale transform needs to be
          * applied since the CustomLayerInterface expects units in MercatorCoordinates.
          */
          scale: modelAsMercatorCoordinate.meterInMercatorCoordinateUnits()
      };
console.log("THREE",THREE)
// configuration of the custom layer for a 3D model per the CustomLayerInterface
var customLayer = {
  id: '3d-model',
  type: 'custom',
  renderingMode: '3d',
  onAdd: function (map, gl) {
      this.camera = new THREE.Camera();
      this.scene = new THREE.Scene();

      // create two three.js lights to illuminate the model
      var directionalLight = new THREE.DirectionalLight(0xffffff);
      directionalLight.position.set(0, -70, 100).normalize();
      this.scene.add(directionalLight);

      var directionalLight2 = new THREE.DirectionalLight(0xffffff);
      directionalLight2.position.set(0, 70, 100).normalize();
      this.scene.add(directionalLight2);

      // use the three.js GLTF loader to add the 3D model to the three.js scene
      var loader = new GLTFLoader();
      loader.load(
          'https://3dmodels.cismet.de/rathaus-altbau/523274.gltf',
          function (gltf) {
          console.log("gltf",gltf);
              this.scene.add(gltf.scene);
          }.bind(this)
      );
      this.map = map;

      // use the MapLibre GL JS map canvas for three.js
      this.renderer = new THREE.WebGLRenderer({
          canvas: map.getCanvas(),
          context: gl,
          antialias: true
      });

      this.renderer.autoClear = false;
  },
  render: function (gl, matrix) {
      var rotationX = new THREE.Matrix4().makeRotationAxis(
          new THREE.Vector3(1, 0, 0),
          modelTransform.rotateX
      );
      var rotationY = new THREE.Matrix4().makeRotationAxis(
          new THREE.Vector3(0, 1, 0),
          modelTransform.rotateY
      );
      var rotationZ = new THREE.Matrix4().makeRotationAxis(
          new THREE.Vector3(0, 0, 1),
          modelTransform.rotateZ
      );

      var m = new THREE.Matrix4().fromArray(matrix);
      var l = new THREE.Matrix4()
          .makeTranslation(
              modelTransform.translateX,
              modelTransform.translateY,
              modelTransform.translateZ
          )
          .scale(
              new THREE.Vector3(
                  modelTransform.scale,
                  -modelTransform.scale,
                  modelTransform.scale
              )
          )
          .multiply(rotationX)
          .multiply(rotationY)
          .multiply(rotationZ);

      this.camera.projectionMatrix = m.multiply(l);
      this.renderer.state.reset();
      this.renderer.render(this.scene, this.camera);
      this.map.triggerRepaint();
  }
};




      map.current.addSource("wms-test-source", {
        type: "raster",
        // use the tiles option to specify a WMS tile source URL
        // https://maplibre.org/maplibre-gl-js-docs/style-spec/sources/
        tiles: [
          "https://maps.wuppertal.de/deegree/wms?service=WMS&request=GetMap&layers=R102%3Atrueortho202010&styles=&format=image%2Fpng&transparent=false&version=1.1.1&tiled=true&type=wms&cssFilter=undefined&width=256&height=256&srs=EPSG%3A3857&bbox={bbox-epsg-3857}",
        ],
        tileSize: 256,
      });
      map.current.addSource("terrainSource", {
        type: "raster-dem",
        tiles: ["https://wuppertal-terrain.cismet.de/services/wupp_dgm_01/tiles/{z}/{x}/{y}.png"],
        tileSize: 512,
        maxzoom: 15,
      });
      map.current.addSource("hillshadeSource", {
        type: "raster-dem",
        tiles: ["https://wuppertal-terrain.cismet.de/services/wupp_dgm_01/tiles/{z}/{x}/{y}.png"],
        tileSize: 512,
        maxzoom: 15,
      });

      // Layers ------------------------------------------------------------------------------
    

      // map.current.addLayer({
      //   id: "hillshade",
      //   type: "hillshade",
      //   source: "hillshadeSource",
      //   layout: { visibility: "visible" },
      //   paint: {
      //     "hillshade-accent-color": "#5a5a5a",
      //     "hillshade-exaggeration": 0.5,
      //     "hillshade-highlight-color": "#FFFFFF",
      //     "hillshade-illumination-anchor": "viewport",
      //     "hillshade-illumination-direction": 335,
      //     "hillshade-shadow-color": "#5a5a5a",
      //   },
      // });

      // map.current.addLayer(customLayer);


      map.current.addLayer({
        id: "3d-buildings",
        source: "openmaptiles",
        "source-layer": "building",

        type: "fill-extrusion",
        minzoom: 12,
        paint: {
          "fill-extrusion-color": "#aaa",
          // "fill-extrusion-height": {
          //   type: "identity",
          //   property: "render_height",
          // },
          "fill-extrusion-height":["get","render_height"],
          // "fill-extrusion-height":["+",["get","render_height"],["get","render_height"]],

          "fill-extrusion-base": ["get","render_min_height"],
          "fill-extrusion-opacity": 0.6,
        },
      });
      map.current.addLayer({
        id: "3d-buildings-roofs",
        source: "openmaptiles",
        "source-layer": "building",

        type: "fill-extrusion",
        minzoom: 12,
        paint: {
          "fill-extrusion-color": "red",
          "fill-extrusion-height": ["+",["get","render_min_height"],["get","render_height"],0.1],
          "fill-extrusion-base": ["+",["get","render_min_height"],["get","render_height"]],
          "fill-extrusion-opacity": 1,
        },
      });
      //   map.current.addLayer({
      //   id: "wms-test-layer",
      //   type: "raster",
      //   opacity: 0.25,

      //   source: "wms-test-source",
      //   paint: { "raster-opacity": 0.5 },
      // });

    //   console.log("map.current", map.current);
    });

    map.current.addControl(new maplibregl.NavigationControl(), "top-left");
    map.current.addControl(
      new maplibregl.TerrainControl({
        source: "terrainSource",
        maxzoom: 16,

        exaggeration: 1,
      }),
      "top-left"
    );
  });

  return (
    <div className='map-wrap'>
      <div ref={mapContainer} className='map' />
    </div>
  );
}
