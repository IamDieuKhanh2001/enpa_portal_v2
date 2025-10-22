'use client'

import React, { useEffect, useState } from 'react'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '../../../component/common/Card'
import { TextBox } from '../../../component/common/TextBox'
import { cn } from '../../../lib/utils'
import { Button } from '../../../component/common/Button'
import { Table } from '../../../component/common/Table'
import { IconTrash } from '@tabler/icons-react'
import SelectBox from '../../../component/common/SelectBox'
import { FormikProvider, FormikValues, useFormik } from "formik";
import * as Yup from 'yup';
import Label from '@/component/common/Label'
import { toast } from 'react-toastify'

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
    {
      id: 2,
      name: "Home",
      url: "https://web20.empowerment-town.com/storejob_set/",
    },
    {
      id: 3,
      name: "Help",
      url: "https://mail.google.com/chat/u/0/#chat/home",
    },
  ]);
  const [iconMenuList, setIconMenuList] = useState<iconMenu[]>([
    {
      id: 1,
      img: "",
      text: "",
      url: "",
    },
    {
      id: 2,
      img: "https://tshop.r10s.jp/ricetanaka/cabinet/imgrc0106013990.jpg?fitin=100:100",
      text: "令和3年産 備蓄米 米 ",
      url: "https://item.rakuten.co.jp/ricetanaka/r-0000/?s-id=top_normal_rk_hashist",
    },
    {
      id: 3,
      img: "https://ias.r10s.jp/dst/ec/162381/23585571/1-1-1/d91a13ed7386113e8ee8f52bf9494d4b.png",
      text: "【3袋セット】元気あふれる毎日をサポート",
      url: "https://item.rakuten.co.jp/kenkoukazoku/6933/",
    },
  ]);
  const [suggestKeywordList, setSuggestKeywordList] = useState<suggestKeyword[]>([
    {
      id: 1,
      keyword: "",
      url: "",
    },
    {
      id: 2,
      keyword: "フィギュア",
      url: "https://search.rakuten.co.jp/search/mall/%E3%83%95%E3%82%A3%E3%82%AE%E3%83%A5%E3%82%A2+%E6%A3%9A/?l-id=pc_header_search_suggest",
    },
    {
      id: 3,
      keyword: "カレー",
      url: "https://search.rakuten.co.jp/search/mall/%E3%82%AB%E3%83%AC%E3%83%BC/?l-id=pc_header_search_suggest",
    },
  ]);
  const [slideList, setSlideList] = useState<slide[]>([
    {
      id: 1,
      slideImg: "",
      url: "",
    },
    {
      id: 2,
      slideImg: "https://r.r10s.jp/com/img/EMP/202510/a875956f-0ea8-45ae-9303-f602660445fa-20251001_toshikoshi_bn1_3_top_big_1890x300_v2.jpg",
      url: "https://event.rakuten.co.jp/toshikoshi/?l-id=top_normal_bigbnr_pc_HEBCJJJA_157737_0",
    },
    {
      id: 3,
      slideImg: "https://r.r10s.jp/com/img/EMP/202510/d555a7b9-affa-4389-9edc-9edbb7fe1629-bigbanner_1890_300_ALL_logo_02-color-04.jpg",
      url: "https://brandavenue.rakuten.co.jp/contents/coupon/?l-id=top_normal_bigbnr_pc_HGHHEEZH_157543_0",
    },
    {
      id: 4,
      slideImg: "https://r.r10s.jp/com/img/EMP/202510/94f29082-3246-49dd-bd2d-dcbd650fd627-dailypoint5_02_1890x300.jpg",
      url: "",
    },
    {
      id: 5,
      slideImg: "https://r.r10s.jp/com/img/EMP/202510/3d338ab0-1a37-4cc9-aaa2-591bd0e51c1e-20250919_awlife_bn1_1_top_big_1890x300.jpg",
      url: "",
    },
  ]);

  const [showButtonSetting, setShowButtonSettting] = useState<boolean>(false);

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
      topMessage: "３０００円最上部メッセージ",
      storeLogoUrl: "https://web20.empowerment-town.com/static/img/emportal_logo.png",
      hexColor: "#3B82F6",
      awards: [""],
    },
    validationSchema: Yup.object({
      topMessage: Yup.string().trim().required("最上部メッセージを入力してください。"),
      storeLogoUrl: Yup.string().trim().required("店舗ロゴURLを入力してください。"),
      hexColor: Yup.string().trim().required("メインカラーを選択してください。"),
      awards: Yup.array()
        .of(
          Yup.string()
            .required("受賞を記入してください。")
            .trim()
            .min(1, "必須") // không được để trống
        )
        .min(1, "少なくとも1つ必要です") // ít nhất 1 phần tử trong mảng
    }),
    onSubmit: async (values) => {
      console.log("Form submitted:", values);

      // Lấy template HTML
      const responseHtml = await fetch("/template_html/tools/4/header.html");
      let templateHtml = await responseHtml.text();

      templateHtml = editHtmlContent(templateHtml, values)

      reviewLivePage(templateHtml);
    },
  });

  // const uploadToRakutenGold = async (htmlContent: string) => {

  //   try {
  //     const res = await fetch("/api/tools/4", {
  //       method: "POST",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify({ fileName: "header_4.html", content: htmlContent }),
  //     });
  //     const data = await res.json();
  //     toast.success(data.message);
  //     console.log(data)
  //   } catch (err) {
  //     toast.error("アップロード中にエラーが発生しました。");
  //   }
  // }

  const editHtmlContent = (templateHtml: string, values: any) => {

    // 3️⃣ Thêm <base href> để trình duyệt hiểu đường dẫn tương đối
    // 👉 Chèn ngay sau <head>
    templateHtml = templateHtml.replace(
      /<head[^>]*>/i,
      `<head><base href="${window.location.origin}/template_html/tools/4/">`
    );

    templateHtml = templateHtml.replace("{{PAGE_TITLE}}", "PC用ヘッダー作成");
    templateHtml = templateHtml.replace("{{MAIN_COLOR}}", `style="background-color:${values.hexColor};"`);
    templateHtml = templateHtml.replace("{{TOP_MSG}}", `${values.topMessage}`);

    // ナビゲーションメニュー
    let navigationHtml = navigationList
      .filter(item => !(item.name === "" && item.url === "")) // bỏ item toàn rỗng
      .map(item => `<li><a href="${item.url}">${item.name}</a></li>`)
      .join("\n");

    templateHtml = templateHtml.replace("{{NAVIGATION_MENU}}", navigationHtml);

    // 店舗ロゴURL
    templateHtml = templateHtml.replace("{{STORE_LOGO_URL}}", `${values.storeLogoUrl}`);

    // 受賞ロゴ
    let awardIconHtml = "";
    values.awards?.map((awardUrl: string) => {
      awardIconHtml += `
        <img src=${awardUrl} alt="award">
      `
    })
    templateHtml = templateHtml.replace("{{IMG_AWARD}}", awardIconHtml);

    // アイコン付きメニュー
    let iconMenuHtml = "";
    let iconMenuFilteredList = iconMenuList.filter(item => !(item.img === "" && item.url === "" && item.text === "")) // bỏ item toàn rỗng
    for (let i = 0; i < iconMenuFilteredList.length; i += 5) {
      // lấy 5 item 1 nhóm gom vào <div class="icons-row">{{5 item}}</div>
      const group = iconMenuFilteredList.slice(i, i + 5);

      iconMenuHtml += `<div class="icons-row">\n`;

      group.forEach(item => {
        iconMenuHtml += `
          <a href=${item.url}>
            <div class="icon-cell">
              <img src="${item.img}" alt="${item.text}">
              <p>${item.text}</p>
            </div>
          </a>
        `;
      });

      iconMenuHtml += `</div>\n`;
    }
    templateHtml = templateHtml.replace("{{ICON_MENU}}", iconMenuHtml);

    // 注目キーワード
    let suggestKeywordHtml = suggestKeywordList
      .filter(item => !(item.keyword === "" && item.url === "")) // bỏ item toàn rỗng
      .map(item => `
          <a
            href=${item.url}>
              <p>#${item.keyword}</p>
          </a>
        `)
      .join("\n");
    templateHtml = templateHtml.replace("{{SUGGEST_KEYWORD}}", suggestKeywordHtml);

    // スライドバナー
    let slideHtml = slideList
      .filter(item => !(item.slideImg === "" && item.url === "")) // bỏ item toàn rỗng
      .map(item => `
          <div class="slider-img">

              <a href=${item.url}>
                  <img src=${item.slideImg} alt="バナー">
              </a>

          </div>
        `)
      .join("\n");
    templateHtml = templateHtml.replace("{{SLIDE}}", slideHtml);



    return templateHtml;
  }

  const reviewLivePage = (templateHtml: string) => {

    // 4️⃣ Tạo Blob để mở trong tab mới
    // const blob = new Blob([templateHtml], { type: "text/html" });
    // const url = URL.createObjectURL(blob);

    // 5️⃣ Mở tab preview
    // window.open(url, "_blank");

    // Lưu template tạm thời
    sessionStorage.setItem("reviewHtml", templateHtml);
    // Mở tab mới cùng origin
    window.open("/tools/4/review", "_blank");
  }

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

  const addSuggestKeywordRow = () => {
    let newRow: suggestKeyword = {
      id: suggestKeywordList.length + 1,
      keyword: "",
      url: "",
    };
    setSuggestKeywordList((prev) => [...prev, newRow]);
  };

  const deleteSuggestKeywordRow = (id: number) => {
    setSuggestKeywordList((prev) => {
      const filtered = prev.filter((r) => r.id !== id);
      return filtered.map((r, index) => ({ ...r, id: index + 1 }));
    });
  };

  const addSlideRow = () => {
    let newRow: slide = {
      id: slideList.length + 1,
      slideImg: "",
      url: "",
    };
    setSlideList((prev) => [...prev, newRow]);
  };

  const deleteSlideRow = (id: number) => {
    setSlideList((prev) => {
      const filtered = prev.filter((r) => r.id !== id);
      return filtered.map((r, index) => ({ ...r, id: index + 1 }));
    });
  };

  const createInputAwardImg = () => {
    if (formik.values.awards.length >= 3) {
      console.log(formik.values.awards.length)
      return;
    }
    formik.setFieldValue("awards", [...formik.values.awards, ""])

  }

  const deleteInputAwardImg = (index: number) => {

    const newAwards = [...formik.values.awards];
    if (newAwards.length === 1) {
      return
    }
    newAwards.splice(index, 1); // xóa phần tử index
    formik.setFieldValue("awards", newAwards);
  }

  useEffect(() => {
    console.log(formik.values)
  }, [formik])

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
                {/* 基本設定 Col 1  */}
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
                  <Label htmlFor='hexColor'>
                    メインカラー
                  </Label>
                  <input
                    id={"hexColor"}
                    name={"hexColor"}
                    type='color'
                    value={formik.values.hexColor}
                    className={cn(
                      "h-10 w-32 rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm mb-2",
                      "focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 focus:border-red-500",
                      "disabled:cursor-not-allowed disabled:bg-gray-100",
                    )}
                    onChange={formik.handleChange}
                  />
                  <div className="flex items-center space-x-2 mb-3">
                    {selectColorList?.map((color, index) => (
                      <div key={index} className="w-8 h-8 rounded-full cursor-pointer shadow-md"
                        style={{ backgroundColor: color }}
                        onClick={() => selectColor(color)}
                      />
                    ))}
                  </div>
                  <span className="font-mono">HEX: {formik.values.hexColor}</span>
                  {formik.touched.hexColor && formik.errors.hexColor && (
                    <p className="text-red-500 text-sm">{formik.errors.hexColor}</p>
                  )}
                </div>
                {/* 基本設定 Col 2  */}
                <div>
                  {formik.values.awards?.map((url, index) => (
                    <TextBox
                      key={index}
                      id={`award-${index}`}
                      name={`awards[${index}]`}
                      label={`受賞ロゴ ${index + 1}`}
                      type="text"
                      isRequired={true}
                      value={url}
                      onChange={formik.handleChange}
                      width='lg'
                      className='flex-1'
                      placeholder="https://image.rakuten.co.jp/empoportal/empo.jpg"
                      direction="vertical"
                      suffix={
                        <Button
                          size='sm'
                          color='textOnly'
                          disabled={formik.values.awards.length === 1 ? true : false}
                          onClick={() => deleteInputAwardImg(index)}
                        >
                          削除
                        </Button>
                      }
                      error={Array.isArray(formik.errors.awards) ? formik.errors.awards[index] : undefined}
                      touched={Array.isArray(formik.touched.awards) ? formik.touched.awards[index] : false}
                    />
                  ))}

                  <Button
                    size='sm'
                    color='secondary'
                    disabled={formik.values.awards.length >= 3 ? true : false}
                    onClick={() => createInputAwardImg()}
                  >
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
              <Table.Container>
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
                      <Table.Button onClick={() => deleteNavigationRow(item.id)}>
                        <IconTrash
                          size={20}
                          strokeWidth={0.5}
                          color='black'
                        />
                      </Table.Button>
                    </Table.Row>
                  ))}
                </Table.Body>
              </Table.Container>
              <Button
                color='secondary'
                size='sm'
                onClick={() => addNavigationRow()}
              >
                ナビゲーションを追加
              </Button>

              <label
                htmlFor={""}
                className={cn(
                  'block text-sm font-medium text-gray-800 mb-1',
                )}>
                アイコン付きメニュー
              </label>
              <Table.Container>
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
                      <Table.Button onClick={() => deleteIconMenuRow(item.id)}>
                        <IconTrash
                          size={20}
                          strokeWidth={0.5}
                          color='black'
                        />
                      </Table.Button>
                    </Table.Row>
                  ))}
                </Table.Body>
              </Table.Container>
              <Button
                color='secondary'
                size='sm'
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
              <Table.Container>
                <Table.Head>
                  <Table.Row>
                    <Table.Th>キーワード</Table.Th>
                    <Table.Th>検索URL</Table.Th>
                    <Table.Th>削除</Table.Th>
                  </Table.Row>
                </Table.Head>

                <Table.Body>
                  {suggestKeywordList?.map((item, index) => (
                    <Table.Row key={`keyword-${index}`}>
                      <Table.InputCell
                        value={item.keyword}
                        onChange={(e) => {
                          setSuggestKeywordList((prevRows) =>
                            prevRows.map((r) =>
                              r.id === item.id
                                ? { ...r, keyword: e.target.value }
                                : r
                            )
                          )
                        }}
                      />
                      <Table.InputCell
                        value={item.url}
                        onChange={(e) => {
                          setSuggestKeywordList((prevRows) =>
                            prevRows.map((r) =>
                              r.id === item.id
                                ? { ...r, url: e.target.value }
                                : r
                            )
                          )
                        }}
                      />
                      <Table.Button onClick={() => deleteSuggestKeywordRow(item.id)}>
                        <IconTrash
                          size={20}
                          strokeWidth={0.5}
                          color='black'
                        />
                      </Table.Button>
                    </Table.Row>
                  ))}
                </Table.Body>
              </Table.Container>
              <Button
                color='secondary'
                size='sm'
                onClick={() => addSuggestKeywordRow()}
              >
                キーワードを追加
              </Button>
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
              <Table.Container>
                <Table.Head>
                  <Table.Row>
                    <Table.Th>スライドバナー画像URL</Table.Th>
                    <Table.Th>リンク先URL</Table.Th>
                    <Table.Th>削除</Table.Th>
                  </Table.Row>
                </Table.Head>
                <Table.Body>
                  {slideList?.map((item, index) => (
                    <Table.Row key={`slide-${index}`}>
                      <Table.InputCell
                        value={item.slideImg}
                        onChange={(e) => {
                          setSlideList((prevRows) =>
                            prevRows.map((r) =>
                              r.id === item.id
                                ? { ...r, slideImg: e.target.value }
                                : r
                            )
                          )
                        }}
                      />
                      <Table.InputCell
                        value={item.url}
                        onChange={(e) => {
                          setSlideList((prevRows) =>
                            prevRows.map((r) =>
                              r.id === item.id
                                ? { ...r, url: e.target.value }
                                : r
                            )
                          )
                        }}
                      />
                      <Table.Button onClick={() => deleteSlideRow(item.id)}>
                        <IconTrash
                          size={20}
                          strokeWidth={0.5}
                          color='black'
                        />
                      </Table.Button>
                    </Table.Row>
                  ))}
                </Table.Body>
              </Table.Container>
              <Button
                color='secondary'
                size='sm'
                onClick={() => addSlideRow()}
              >
                スライドを追加
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className='flex flex-row items-center justify-between'>
                <CardTitle>4. 特集設定</CardTitle>
                <Button color='secondary' size='sm'>
                  特集を追加
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <TextBox
                id=""
                name=""
                type="text"
                width='lg'
                isRequired={true}
                label={"見出し"}
                value={""}
                placeholder="例：新商品"
                direction="vertical"
                readOnly={true}
              // onChange={formik.handleChange}
              // error={formik.errors.}
              // touched={formik.touched.}
              />
              <Table.Container>
                <Table.Head>
                  <Table.Row>
                    <Table.Th>画像URL</Table.Th>
                    <Table.Th>リンク先URL</Table.Th>
                    <Table.Th>画像の横幅</Table.Th>
                    <Table.Th>削除</Table.Th>
                  </Table.Row>
                </Table.Head>
                <Table.Body>
                  <Table.Row>
                    <Table.InputCell />
                    <Table.InputCell />
                    <Table.SelectBox>
                      <Table.Option value={"1"}>aaaa</Table.Option>
                      <Table.Option value={"2"}>bbbb</Table.Option>
                    </Table.SelectBox>
                    <Table.Button>
                      <IconTrash
                        size={20}
                        strokeWidth={0.5}
                        color='black'
                      />
                    </Table.Button>
                  </Table.Row>
                </Table.Body>
              </Table.Container>
              <Button
                className='mb-2'
                size='sm'
                color='secondary'
              >
                項目を追加
              </Button>
              <SelectBox
                id=''
                name=''
                label='ボタン有無'
                width='sm'
                value={"0"}
                options={[
                  { value: '1', label: '有' },
                  { value: '0', label: '無' },
                ]}
                onChange={(e) => {
                  setShowButtonSettting(e.target.value === "1" ? true : false);
                }}
              />
              {showButtonSetting &&
                (
                  <>
                    <TextBox
                      id=""
                      name=""
                      type="text"
                      width='lg'
                      isRequired={true}
                      label={"ボタンカラー"}
                      value={""}
                      placeholder="例：#3B82F6"
                      direction="vertical"
                    // onChange={formik.handleChange}
                    // error={formik.errors.}
                    // touched={formik.touched.}
                    />
                    <TextBox
                      id=""
                      name=""
                      type="text"
                      width='lg'
                      isRequired={true}
                      label={"ボタン文言"}
                      value={""}
                      placeholder="例：楽天に遷移する"
                      direction="vertical"
                    // onChange={formik.handleChange}
                    // error={formik.errors.}
                    // touched={formik.touched.}
                    />
                    <TextBox
                      id=""
                      name=""
                      type="text"
                      width='lg'
                      isRequired={true}
                      label={"ボタンリンク先"}
                      value={""}
                      placeholder="例：https://www.rakuten.co.jp/"
                      direction="vertical"
                    // onChange={formik.handleChange}
                    // error={formik.errors.}
                    // touched={formik.touched.}
                    />
                  </>
                )
              }
            </CardContent>
          </Card>
          <div className='flex justify-center'>
            <Button
              size='lg'
              type='submit'
              disabled={!(formik.isValid && formik.dirty)}
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
