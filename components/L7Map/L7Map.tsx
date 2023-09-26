"use client";

import React, { useEffect, useRef } from "react";

import { Scene, LayerPopup } from "@antv/l7";
import { GaodeMap } from "@antv/l7-maps";

function L7Map(props: any) {
  const { dataSource, lng, lat } = props;
  const containerRef = useRef(null);

  useEffect(() => {
    if (dataSource) {
      // 在组件挂载后初始化 L7 地图
      const scene = new Scene({
        id: "map",
        map: new GaodeMap({
          pitch: 0,
          style: "dark", // 可根据需求调整地图样式
          zoom: 10,
          center: [Number(lng), Number(lat)], // 设置地图中心点坐标
        }),
      });

      scene.addLayer(dataSource);
      // 将 L7 地图绑定到容器中

      const layerPopup = new LayerPopup({
        items: [
          {
            layer: dataSource,
            fields: [
              {
                field: "name",
                formatValue: (name?: string) => name.trim() ?? "-",
              },
            ],
          },
        ],
        trigger: "hover",
      });
      scene.addPopup(layerPopup);
      return () => {
        scene.destroy();
      };
    }
  }, [dataSource]);

  return (
    <div>
      {dataSource ? (
        <div
          id="map"
          ref={containerRef}
          style={{
            position: "relative",
            height: "calc(100vh - 64px)",
          }}
        ></div>
      ) : null}
    </div>
  );
}

export default L7Map;
