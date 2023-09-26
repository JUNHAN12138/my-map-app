"use client";

import React, { useEffect, useState } from "react";
import {
  Layout,
  Select,
  Upload,
  Button,
  message,
  Modal,
  Form,
  Input,
} from "antd";
import L7Map from "@/components/l7Map/L7Map";
import request from "@/utils/request";
import { PointLayer } from "@antv/l7-layers";
import { UploadOutlined } from "@ant-design/icons";
import type { RcFile, UploadFile, UploadProps } from "antd/es/upload/interface";

const { Header, Footer, Sider, Content } = Layout;

const headerStyle: React.CSSProperties = {
  textAlign: "center",
  color: "#fff",
  height: 64,
  paddingInline: 50,
  lineHeight: "64px",
  backgroundColor: "#7dbcea",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

const contentStyle: React.CSSProperties = {
  textAlign: "center",
  height: "calc(100vh - 64px)",
  lineHeight: "120px",
  color: "#fff",
  backgroundColor: "#fff",
};

type FieldType = {
  username?: string;
  password?: string;
  remember?: string;
};

const Page = () => {
  const [dataSource, setDataSource] = useState([]);
  const [data, setData] = useState<any>();
  const [visible, setVisible] = useState(false);
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [lng, setLng] = useState();
  const [lat, setLat] = useState();
  const [form] = Form.useForm();
  useEffect(() => {
    getDataSource();
  }, []);
  const getDataSource = () => {
    request({
      url: "files/getData",
      method: "get",
    }).then((res: any) => {
      setDataSource(
        res.map((item: any) => {
          return { ...item, label: item.name, value: item.id };
        })
      );
    });
  };
  const props: UploadProps = {
    name: "file",

    beforeUpload: (file) => {
      setFileList([...fileList, file]);

      return false;
    },
    onRemove: (file) => {
      const index = fileList.indexOf(file);
      const newFileList = fileList.slice();
      newFileList.splice(index, 1);
      setFileList(newFileList);
    },
  };

  return (
    <Layout>
      <Header style={headerStyle}>
        <span>叶绿素地图</span>

        <Select
          style={{ width: "100px", marginLeft: "20px" }}
          options={dataSource}
          onChange={(val: any) => {
            request({
              url: `files/content/${val}`,
              method: "get",
              responseType: "arrayBuffer",
            }).then((res: any) => {
              const { lng, lat, data } = JSON.parse(res);
              setLng(lng);
              setLat(lat);
              const pointLayer = new PointLayer({})
                .source(data, {
                  parser: {
                    type: "json",
                    x: "lng",
                    y: "lat",
                  },
                })
                .shape("circle")
                .size(10)
                .color("chlorophyll", (chlorophyll) => {
                  if (chlorophyll > 0 && chlorophyll < 5) {
                    return "#fcffe6";
                  } else if (chlorophyll > 5 && chlorophyll < 6) {
                    return "#f4ffb8";
                  } else if (chlorophyll > 6 && chlorophyll < 6.5) {
                    return "#eaff8f";
                  } else if (chlorophyll > 6.5 && chlorophyll < 7) {
                    return "#d3f261";
                  } else if (chlorophyll > 7 && chlorophyll < 7.5) {
                    return "#bae637";
                  } else if (chlorophyll > 7.5 && chlorophyll < 8) {
                    return "#a0d911";
                  } else if (chlorophyll > 8 && chlorophyll < 8.5) {
                    return "#7cb305";
                  } else if (chlorophyll > 8.5 && chlorophyll < 9) {
                    return "#5b8c00";
                  } else if (chlorophyll > 9 && chlorophyll < 9.5) {
                    return "#3f6600";
                  } else if (chlorophyll > 9.5 && chlorophyll < 10) {
                    return "#254000";
                  }
                })
                .style({
                  opacity: 1,
                });
              setData(pointLayer);
            });
          }}
        ></Select>
        <Button
          onClick={() => {
            setVisible(true);
          }}
          type="primary"
          style={{ marginLeft: "20px" }}
        >
          上传
        </Button>
      </Header>
      <div style={contentStyle}>
        <L7Map dataSource={data} lng={lng} lat={lat}></L7Map>
      </div>
      <Modal
        title="上传文件"
        open={visible}
        onOk={() => {
          form.validateFields().then((values) => {
            const formData = new FormData();
            fileList.forEach((file) => {
              formData.append("file", file as RcFile);
            });
            formData.append("lng", values.lng);
            formData.append("lat", values.lat);

            // You can use any AJAX library you like
            fetch("http://localhost:8888/files/upload", {
              method: "POST",
              body: formData,
            })
              .then((res) => res.json())
              .then(() => {
                setFileList([]);
                message.success("upload successfully.");
                setVisible(false);
                getDataSource();
              })
              .catch(() => {
                message.error("upload failed.");
              });
          });
        }}
        onCancel={() => {
          setVisible(false);
        }}
      >
        <Form
          form={form}
          name="basic"
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          style={{ maxWidth: 600 }}
          initialValues={{ remember: true }}
          autoComplete="off"
          // onFinish={onFinish}
        >
          <Form.Item<FieldType>
            label="经度"
            name="lng"
            rules={[{ required: true, message: "请填写经度" }]}
          >
            <Input></Input>
          </Form.Item>
          <Form.Item<FieldType>
            label="纬度"
            name="lat"
            rules={[{ required: true, message: "请填写纬度" }]}
          >
            <Input></Input>
          </Form.Item>
          <Form.Item<FieldType>
            label="上传"
            name="file"
            rules={[{ required: true, message: "Please input your password!" }]}
          >
            <Upload {...props} maxCount={1}>
              <Button icon={<UploadOutlined />}>Click to Upload</Button>
            </Upload>
          </Form.Item>
        </Form>
      </Modal>
    </Layout>
  );
};

export default Page;
