'use client'

import Image from "next/image";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./component/common/Card";
import { TextBox } from "./component/common/TextBox";
import { Button } from "./component/common/Button";
import { Alert } from "./component/common/Alert";
import * as Yup from 'yup';
import { Field, FormikProvider, useFormik } from "formik";
import { toast } from "react-toastify";
import { NumberBox } from "./component/common/NumberBox";
import SelectBox from "./component/common/SelectBox";
import { IconAdjustments, IconAdOff } from "@tabler/icons-react";
import Link from "next/link";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./component/common/Tabs";
import { Grid, GridCol, GridRow } from "./component/common/Grid";
import { Table } from "./component/common/Table";
import { Badge } from "./component/common/Badge";
// import { ErrorMessage, Field, Form, Formik } from 'formik';

export default function Home() {

  const formik = useFormik({
    initialValues: {
      title: "title",
      age: "10",
      price: "12.50",
      selectBoxValue: "",
    },
    validationSchema: Yup.object({
      title: Yup.string().required("Title must not be empty"),
      age: Yup.number().required("Number must not be empty")
        .min(0, "Min value is 0")
        .max(9999, "Max value is 9999"),
      price: Yup.number()
        .required("Price is required")
        .min(0, `Min value is 0`)
        .max(9999.99, `Max value is 9999.99`),
      selectBoxValue: Yup.string().required("Chọn selectBoxValue"),
      // .min(0.0, "Price must be >= 0")
      // .max(99999.9, "Price must be <= 10000"),
    }),
    onSubmit: async (values) => {
      console.log("Form submitted:", values);
    },
  });

  return (
    <>
      <Tabs defaultTab="tab3">
        <TabsList>
          <TabsTrigger value="tab1">Mẫu các component</TabsTrigger>
          <TabsTrigger value="tab2">サムネ画像自動更新</TabsTrigger>
          <TabsTrigger value="tab3">サムネ画像予約一覧</TabsTrigger>
        </TabsList>

        <TabsContent value="tab1">
          <div className="">
            <h1 className="text-2xl font-bold text-gray-800 mb-2">Form test</h1>
            <Card>
              <CardHeader>
                <CardTitle>Thư viện Formik</CardTitle>
              </CardHeader>
              <CardContent>
                <IconAdjustments
                  size={48}
                  strokeWidth={2}
                  color={'black'}
                />;
                <FormikProvider value={formik}>
                  <form onSubmit={formik.handleSubmit}>
                    <TextBox
                      id="title"
                      name="title"
                      type="text"
                      isRequired={true}
                      label={"イベント名を入力"}
                      value={formik.values.title}
                      width="lg"
                      placeholder="カスタムイベント名"
                      onChange={formik.handleChange}
                      direction="vertical"
                    />
                    {formik.touched.title && formik.errors.title && (
                      <div className="text-red-500 text-sm mt-1">{formik.errors.title}</div>
                    )}
                    <TextBox
                      id="age"
                      name="age"
                      type="number"
                      isRequired={true}
                      label={"イベント"}
                      value={formik.values.age}
                      width="sm"
                      placeholder="カスタムイベント名"
                      onChange={formik.handleChange}
                      direction="vertical"
                    />
                    {formik.touched.age && formik.errors.age && (
                      <div className="text-red-500 text-sm mt-1">{formik.errors.age}</div>
                    )}
                    <TextBox
                      id="price"
                      name="price"
                      type="number"
                      isRequired={true}
                      label={"イベント"}
                      value={formik.values.price}
                      width="md"
                      placeholder="カスタムイベント名"
                      onChange={formik.handleChange}
                      direction="vertical"
                    />
                    {formik.touched.price && formik.errors.price && (
                      <div className="text-red-500 text-sm mt-1">{formik.errors.price}</div>
                    )}
                    <TextBox
                      id=""
                      name=""
                      type="number"
                      isRequired={true}
                      label={"イベントsacsac"}
                      value={""}
                      width="full"
                      placeholder="カスタムイベント名"
                      onChange={formik.handleChange}
                      direction="vertical"
                    />
                    <SelectBox
                      id="selectBoxValue"
                      label="Chọn selectBoxValue"
                      name="selectBoxValue"
                      width="md"
                      value={formik.values.selectBoxValue}
                      options={[
                        { value: "", label: "choose" },
                        { value: "apple", label: "apple" },
                        { value: "banana", label: "banana" },
                        { value: "orange", label: "orange" },
                      ]}
                      isRequired={true}
                      onChange={formik.handleChange}
                    />
                    {formik.touched.selectBoxValue && formik.errors.selectBoxValue && (
                      <div className="text-red-500 text-sm mt-1">{formik.errors.selectBoxValue}</div>
                    )}
                  </form>
                </FormikProvider>
              </CardContent>
              <CardFooter>
                <Button type='submit' onClick={formik.submitForm}>
                  excecute
                </Button>
              </CardFooter>
            </Card>

            <h1 className="text-2xl font-bold text-gray-800 mb-2">セールページ作成</h1>
            <Card>
              <CardHeader>
                <CardTitle>カードタイトル</CardTitle>
                <CardDescription>カードdes</CardDescription>
              </CardHeader>
              <CardContent>
                <TextBox
                  id="custom-event-name"
                  name="custom-event-name"
                  isRequired={true}
                  label={"イベント名を入力"}
                  value={"aaaa"}
                  direction="horizontal"
                  placeholder="カスタムイベント名"
                  onChange={() => {

                  }}
                />
                <div className="flex flex-row">
                  <TextBox
                    id="custom-event-name"
                    name="custom-event-name"
                    isRequired={false}
                    label={"イベント名を入力"}
                    value={"aaaa"}
                    placeholder="カスタムイベント名"
                    onChange={() => {

                    }}
                  />
                  <TextBox
                    id="custom-event-name"
                    name="custom-event-name"
                    form="formName"
                    isRequired={false}
                    className="ml-1"
                    label={"イベント名を入力"}
                    value={"aaaa"}
                    placeholder="カスタムイベント名"
                    onChange={() => {

                    }}
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button color="primary">Button footer</Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Component alert</CardTitle>
                <CardDescription>aaaa</CardDescription>
              </CardHeader>
              <CardContent>
                <Alert variant="info">
                  thong bao info
                </Alert>
                <Alert variant="success">
                  thong bao success
                </Alert>
                <Alert variant="error">
                  thong bao error
                </Alert>
                <Alert variant="warning">
                  thong bao warning
                </Alert>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Component Button</CardTitle>
                <CardDescription>mau nut button</CardDescription>
              </CardHeader>
              <CardContent>
                <Button style={{ background: "darkblue" }} color="primary">primary</Button>
                <Button color="secondary">secondary</Button>
                <Button color="primary">primary</Button>
                <Button>sssss</Button>
                <div className="">
                  <Button size="sm">Size</Button>
                  <Button size="md">Size</Button>
                  <Button size="lg">Size</Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Component Icon</CardTitle>
                <CardDescription>aaaa</CardDescription>
              </CardHeader>
              <CardContent>
                <IconAdOff
                  size={48}
                  strokeWidth={2}
                  color={'#000000'}
                />
                <p>Xem icon sử dụng tại: </p>
                <Link href="https://tabler-icons-react.vercel.app/">https://tabler-icons-react.vercel.app/</Link>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Component Icon</CardTitle>
                <CardDescription>aaaa</CardDescription>
              </CardHeader>
              <CardContent>
                <Badge color="primary">
                  primary
                </Badge>
                <Badge color="secondary">
                  secondary
                </Badge>
                <Badge color="success">
                  success
                </Badge>
                <Badge color="warning">
                  warning
                </Badge>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        <TabsContent value="tab2">

          <Grid>
            <GridRow cols={12} gap="gap-2">
              <GridCol md={2} lg={2}>
                <Card>
                  <CardHeader>
                    <CardTitle>Component Button</CardTitle>
                    <CardDescription>mau nut button</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button style={{ background: "darkblue" }} color="primary">primary</Button>
                    <Button color="secondary">secondary</Button>
                    <Button color="primary">primary</Button>
                    <Button>sssss</Button>
                  </CardContent>
                </Card>

              </GridCol>

              <GridCol md={6} lg={4}>
                <Card>
                  <CardHeader>
                    <CardTitle>Component Button</CardTitle>
                    <CardDescription>mau nut button</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button style={{ background: "darkblue" }} color="primary">primary</Button>
                    <Button color="secondary">secondary</Button>
                    <Button color="primary">primary</Button>
                    <Button>sssss</Button>
                  </CardContent>
                </Card>
              </GridCol>

              <GridCol md={12} lg={4}>
                <Card>
                  <CardHeader>
                    <CardTitle>Component Button</CardTitle>
                    <CardDescription>mau nut button</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button style={{ background: "darkblue" }} color="primary">primary</Button>
                    <Button color="secondary">secondary</Button>
                    <Button color="primary">primary</Button>
                    <Button>sssss</Button>
                  </CardContent>
                </Card>
              </GridCol>
            </GridRow>
          </Grid>

        </TabsContent>
        <TabsContent value="tab3">
          <Table.Root>
            <Table.Head>
              <Table.Row>
                <Table.Th width="w-16">#</Table.Th>
                <Table.Th width="w-40">商品管理番号*</Table.Th>
                <Table.Th width="w-48">代替商品画像URL</Table.Th>
                <Table.Th width="w-32">識別用文字列</Table.Th>
                <Table.Th width="w-16" center>削除</Table.Th>
              </Table.Row>
            </Table.Head>
            <Table.Body>
              <Table.Row>
                <Table.Td>1</Table.Td>
                <Table.Td>AB123</Table.Td>
                <Table.Td>https://example.com/image.png</Table.Td>
                <Table.Td>id_string</Table.Td>
                <Table.Td center>
                  <button className="text-red-500 hover:text-red-700">削除</button>
                </Table.Td>
              </Table.Row>
              {/* More rows */}
            </Table.Body>
          </Table.Root>
        </TabsContent>
      </Tabs>


    </>
  );
}
