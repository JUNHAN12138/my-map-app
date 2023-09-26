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
        <Button
          onClick={() => {
            router.push("/map");
          }}
          type="primary"
        >
          Button
        </Button>
      </div>
    </ConfigProvider>
  );
};

export default HomePage;
