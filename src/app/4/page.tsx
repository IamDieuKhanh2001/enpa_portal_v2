'use client'

import React, { useEffect, useState } from 'react'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '../../component/common/Card'
import { TextBox } from '../../component/common/TextBox'
import { cn } from '../../lib/utils'
import { Button } from '../../component/common/Button'
import { Table } from '../../component/common/Table'
import { IconTrash } from '@tabler/icons-react'
import SelectBox from '../../component/common/SelectBox'
import { FormikProvider, useFormik } from "formik";
import * as Yup from 'yup';

type navigationMenu = {
  id: number,
  name: string,
  url: string,
}
type iconMenu = {
  id: number,
  img: string,
  url: string,
  text: string,
}
type suggestKeyword = {
  id: number,
  keyword: string,
  url: string,
}
type slide = {
  id: number,
  slideImg: string
  url: string
}
const page = () => {

  // 2. メニュー設定
  const [navigationList, setNavigationList] = useState<navigationMenu[]>([
    {
      id: 1,
      name: "",
      url: "",
    },
  ]);
  const [iconMenuList, setIconMenuList] = useState<iconMenu[]>([]);
  const [suggestKeywordList, setSuggestKeywordList] = useState<suggestKeyword[]>([]);
  const [slideList, setSlideList] = useState<slide[]>([]);

  const selectColorList = [
    "#3B82F6", // blue
    "#10B981", // green
    "#F59E0B", // yellow
    "#EF4444", // red
    "#8B5CF6", // purple
    "#06B6D4", // cyan
  ];

  const formik = useFormik({
    initialValues: {
      // 1.基本設定
      topMessage: "",
      storeLogoUrl: "",
      hexColor: "#0e3600",
      awardUrl1: "",
      awardUrl2: "",
    },
    validationSchema: Yup.object({
      topMessage: Yup.string().required("最上部メッセージを入力してください。"),
      storeLogoUrl: Yup.string().required("店舗ロゴURLを入力してください。"),
      hexColor: Yup.string().required("メインカラーを選択してください。"),
    }),
    onSubmit: async (values) => {
      console.log("Form submitted:", values);

    },
  });

  const selectColor = (color: string) => {

    formik.setFieldValue("hexColor", color)
  }

  // Table input
  const addNavigationRow = () => {

    let newRow: navigationMenu = {
      id: navigationList.length + 1,
      name: "",
      url: "",
    };
    setNavigationList((prev) => [...prev, newRow]);
  };

  const deleteNavigationRow = (id: number) => {

    setNavigationList((prev) => {
      const filtered = prev.filter((r) => r.id !== id);
      return filtered.map((r, index) => ({ ...r, id: index + 1 }));
    });
  };

  const handleNavigationNameChange = (id: number, value: string) => {
    setNavigationList((prevRows) =>
      prevRows.map((r) =>
        r.id === id
          ? { ...r, name: value }
          : r
      )
    );
  };

  const addIconMenuRow = () => {
    let newRow: iconMenu = {
      id: iconMenuList.length + 1,
      img: "",
      text: "",
      url: "",
    };
    setIconMenuList((prev) => [...prev, newRow]);
  };

  const deleteIconMenuRow = (id: number) => {
    setIconMenuList((prev) => {
      const filtered = prev.filter((r) => r.id !== id);
      return filtered.map((r, index) => ({ ...r, id: index + 1 }));
    });
  };

  useEffect(() => {
    console.log(navigationList)
  }, [navigationList])

  return (
    <>
      <FormikProvider value={formik}>
        <form onSubmit={formik.handleSubmit}>
          <Card>
            <CardHeader>
              <CardTitle>1.基本設定</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                <div>
                  <TextBox
                    id="topMessage"
                    name="topMessage"
                    type="text"
                    isRequired={true}
                    label={"最上部メッセージ"}
                    value={formik.values.topMessage}
                    placeholder="3,980円以上で送料無料"
                    direction="vertical"
                    onChange={formik.handleChange}
                    error={formik.errors.topMessage}
                    touched={formik.touched.topMessage}
                  />
                  <TextBox
                    id="storeLogoUrl"
                    name="storeLogoUrl"
                    type="text"
                    isRequired={true}
                    label={"店舗ロゴURL"}
                    value={formik.values.storeLogoUrl}
                    placeholder="https://example.com/logo.png"
                    direction="vertical"
                    onChange={formik.handleChange}
                    error={formik.errors.storeLogoUrl}
                    touched={formik.touched.storeLogoUrl}
                  />
                  <label
                    htmlFor={""}
                    className={cn(
                      'block text-sm font-medium text-gray-800 mb-1',
                    )}>
                    メインカラー
                  </label>
                  <div className="flex items-center space-x-2 mb-3">
                    {selectColorList?.map((color, index) => (
                      <div key={index} className="w-8 h-8 rounded-full cursor-pointer shadow-md"
                        style={{ backgroundColor: color }}
                        onClick={() => selectColor(color)}
                      />
                    ))}
                  </div>
                  <input
                    id={"hexColor"}
                    name={"hexColor"}
                    type='color'
                    value={formik.values.hexColor}
                    className={cn(
                      "h-10 w-32 rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm",
                      "focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 focus:border-red-500",
                      "disabled:cursor-not-allowed disabled:bg-gray-100",
                    )}
                    onChange={formik.handleChange}
                  />
                  <span className="font-mono">HEX: {formik.values.hexColor}</span>
                  {formik.touched.hexColor && formik.errors.hexColor && (
                    <p className="text-red-500 text-sm">{formik.errors.hexColor}</p>
                  )}
                </div>
                <div>
                  <TextBox
                    id=""
                    name=""
                    type="text"
                    isRequired={true}
                    label={"ロゴURL 1"}
                    value={""}
                    placeholder="https://image.rakuten.co.jp/empoportal/empo.jpg"
                    direction="vertical"
                    readOnly={true}
                  />
                  <Button size='sm' className='flex-shrink-0'>
                    削除
                  </Button>
                  <Button size='sm' color='secondary' className='mx-2'>
                    受賞ロゴを追加
                  </Button>
                </div>
              </div>

            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>2. メニュー設定</CardTitle>
            </CardHeader>
            <CardContent>
              <label
                htmlFor={""}
                className={cn(
                  'block text-sm font-medium text-gray-800 mb-1',
                )}>
                ナビゲーションメニュー
              </label>
              <Table.Container className='mb-1'>
                <Table.Head>
                  <Table.Row>
                    <Table.Th>項目名</Table.Th>
                    <Table.Th>リンク先URL</Table.Th>
                    <Table.Th>削除</Table.Th>
                  </Table.Row>
                </Table.Head>

                <Table.Body>
                  {navigationList?.map((item, index) => (
                    <Table.Row key={`navigation-${index}`}>
                      <Table.InputCell
                        value={item.name}
                        onChange={(e) => {
                          setNavigationList((prevRows) =>
                            prevRows.map((r) =>
                              r.id === item.id
                                ? { ...r, name: e.target.value }
                                : r
                            )
                          )
                        }}
                      />
                      <Table.InputCell
                        value={item.url}
                        onChange={(e) => {
                          setNavigationList((prevRows) =>
                            prevRows.map((r) =>
                              r.id === item.id
                                ? { ...r, url: e.target.value }
                                : r
                            )
                          )
                        }}
                      />
                      <Table.Td>
                        <button
                          className="text-sm bg-transparent border-none text-gray-700 hover:text-red-500"
                          onClick={() => deleteNavigationRow(item.id)}>
                          <IconTrash
                            size={20}
                            strokeWidth={0.5}
                            color='black'
                          />
                        </button>
                      </Table.Td>
                    </Table.Row>
                  ))}
                </Table.Body>
              </Table.Container>
              <Button
                onClick={() => addNavigationRow()}>
                ナビゲーションを追加
              </Button>

              <label
                htmlFor={""}
                className={cn(
                  'block text-sm font-medium text-gray-800 mb-1',
                )}>
                アイコン付きメニュー
              </label>
              <Table.Container className='mb-1'>
                <Table.Head>
                  <Table.Row>
                    <Table.Th>画像URL</Table.Th>
                    <Table.Th>リンク先URL</Table.Th>
                    <Table.Th>テキスト</Table.Th>
                    <Table.Th>削除</Table.Th>
                  </Table.Row>
                </Table.Head>
                <Table.Body>
                  {iconMenuList?.map((item, index) => (
                    <Table.Row key={`iconMenu-${index}`}>
                      <Table.InputCell
                        value={item.img}
                        onChange={(e) => {
                          setIconMenuList((prevRows) =>
                            prevRows.map((r) =>
                              r.id === item.id
                                ? { ...r, img: e.target.value }
                                : r
                            )
                          )
                        }}
                      />
                      <Table.InputCell
                        value={item.url}
                        onChange={(e) => {
                          setIconMenuList((prevRows) =>
                            prevRows.map((r) =>
                              r.id === item.id
                                ? { ...r, url: e.target.value }
                                : r
                            )
                          )
                        }}
                      />
                      <Table.InputCell
                        value={item.text}
                        onChange={(e) => {
                          setIconMenuList((prevRows) =>
                            prevRows.map((r) =>
                              r.id === item.id
                                ? { ...r, text: e.target.value }
                                : r
                            )
                          )
                        }}
                      />
                      <Table.Td>
                        <button
                          className="text-sm bg-transparent border-none text-gray-700 hover:text-red-500"
                          onClick={() => deleteIconMenuRow(item.id)}
                        >
                          <IconTrash
                            size={20}
                            strokeWidth={0.5}
                            color='black'
                          />
                        </button>
                      </Table.Td>
                    </Table.Row>
                  ))}
                </Table.Body>
              </Table.Container>
              <Button
                onClick={() => addIconMenuRow()}
              >
                アイコンメニューを追加
              </Button>

              <label
                htmlFor={""}
                className={cn(
                  'block text-sm font-medium text-gray-800 mb-1',
                )}>
                注目キーワード
              </label>
              <Table.Container className='mb-1'>
                <Table.Head>
                  <Table.Row>
                    <Table.Th>キーワード</Table.Th>
                    <Table.Th>検索URL</Table.Th>
                    <Table.Th>削除</Table.Th>
                  </Table.Row>
                </Table.Head>

                <Table.Body>
                  <Table.Row>
                    <Table.InputCell />
                    <Table.InputCell />
                    <Table.Td>
                      <button className="text-sm bg-transparent border-none text-gray-700 hover:text-red-500">
                        <IconTrash
                          size={20}
                          strokeWidth={0.5}
                          color='black'
                        />
                      </button>
                    </Table.Td>
                  </Table.Row>
                </Table.Body>
              </Table.Container>
              <Button>キーワードを追加</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>3. バナー設定</CardTitle>
            </CardHeader>
            <CardContent>
              <label
                htmlFor={""}
                className={cn(
                  'block text-sm font-medium text-gray-800 mb-1',
                )}>
                スライドバナー
              </label>
              <Table.Container className='mb-1'>
                <Table.Head>
                  <Table.Row>
                    <Table.Th>スライドバナー画像URL</Table.Th>
                    <Table.Th>リンク先URL</Table.Th>
                    <Table.Th>削除</Table.Th>
                  </Table.Row>
                </Table.Head>

                <Table.Body>
                  <Table.Row>
                    <Table.InputCell />
                    <Table.InputCell />
                    <Table.Td>
                      <button className="text-sm bg-transparent border-none text-gray-700 hover:text-red-500">
                        <IconTrash
                          size={20}
                          strokeWidth={0.5}
                          color='black'
                        />
                      </button>
                    </Table.Td>
                  </Table.Row>
                </Table.Body>
              </Table.Container>
              <Button>スライドを追加</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              特集設定
            </CardHeader>
            <CardContent>
              <SelectBox
                id=""
                label="レイアウト選択"
                name=""
                width="sm"
                value={"2"}
                readOnly={true}
                options={[
                  { value: "", label: "choose" },
                  { value: "2", label: "2列" },
                  { value: "3", label: "3列" },
                  { value: "4", label: "4列" },
                ]}
                isRequired={true}
              />

              <Table.Container className='mb-1'>
                <Table.Head>
                  <Table.Row>
                    <Table.Th>画像URL</Table.Th>
                    <Table.Th>リンク先URL</Table.Th>
                    <Table.Th>削除</Table.Th>
                  </Table.Row>
                </Table.Head>

                <Table.Body>
                  <Table.Row>
                    <Table.InputCell />
                    <Table.InputCell />
                    <Table.Td>
                      <button className="text-sm bg-transparent border-none text-gray-700 hover:text-red-500">
                        <IconTrash
                          size={20}
                          strokeWidth={0.5}
                          color='black'
                        />
                      </button>
                    </Table.Td>
                  </Table.Row>
                </Table.Body>
              </Table.Container>
              <Button>項目を追加</Button>
            </CardContent>
          </Card>
          <div className='flex justify-center'>
            <Button
              size='lg'
              type='submit'
              onClick={formik.submitForm}>
              プレビュー
            </Button>
          </div>
        </form>
      </FormikProvider>
    </>
  )
}

export default page
