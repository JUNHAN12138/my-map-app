"use client";

import React from "react";
import { Button, ConfigProvider } from "antd";

import theme from "@/theme/themeConfig";
import { useRouter } from "next/navigation";

const HomePage = () => {
  const router = useRouter();

  return (
    <ConfigProvider theme={theme}>
      <div className="App">
        <div
          onClick={() => {
            router.push("/map");
          }}
          className="bg-gray-0 group block space-y-2 rounded-md border border-gray-200 p-6 pt-5 shadow-md shadow-black/5 transition-shadow duration-300 hover:shadow-lg w-64 "
        >
          地图
        </div>
      </div>
    </ConfigProvider>
  );
};

export default HomePage;
