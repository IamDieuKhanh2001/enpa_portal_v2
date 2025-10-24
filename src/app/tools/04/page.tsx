'use client'

import React, { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader } from '../../../component/common/Card'
import { TextBox } from '../../../component/common/TextBox'
import { cn } from '../../../lib/utils'
import { Button } from '../../../component/common/Button'
import { Table } from '../../../component/common/Table'
import { IconTrash } from '@tabler/icons-react'
import SelectBox from '../../../component/common/SelectBox'
import { FormikProvider, FormikValues, useFormik } from "formik";
import * as Yup from 'yup';
import Label from '@/component/common/Label'
import ColorPicker from '@/component/common/ColorPicker'

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
type feature = {
  id: number,
  img: string,
  url: string,
  colWidth: string,
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
  const [featureList, setFeatureList] = useState<feature[]>([
    {
      id: 1,
      img: "",
      url: "",
      colWidth: "2",
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
      featureTitle: "",
      buttonText: "",
      buttonLink: "",
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
        .min(1, "少なくとも1つ必要です"), // ít nhất 1 phần tử trong mảng
      featureTitle: Yup.string().trim().required("見出しを入力してください。"),
      buttonText: showButtonSetting
        ? Yup.string().trim().required("入力してください。")
        : Yup.string().trim(),
      buttonLink: showButtonSetting
        ? Yup.string().trim().required("入力してください。")
        : Yup.string().trim(),
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

  const editHtmlContent = (templateHtml: string, values: any) => {

    // ナビゲーションメニュー
    let navigationHtml = navigationList
      .filter(item => !(item.name === "" && item.url === "")) // bỏ item toàn rỗng
      .map(item => `<li><a href="${item.url}" target="_blank" rel="noopener noreferrer">${item.name}</a></li>`)
      .join("\n");

    // 店舗ロゴURL
    // 受賞ロゴ
    let awardIconHtml = "";
    values.awards?.map((awardUrl: string) => {
      awardIconHtml += `
        <img src=${awardUrl} alt="award">
      `
    })

    // アイコン付きメニュー
    let iconMenuHtml = "";
    let iconMenuFilteredList = iconMenuList.filter(item => !(item.img === "" && item.url === "" && item.text === "")) // bỏ item toàn rỗng
    for (let i = 0; i < iconMenuFilteredList.length; i += 5) {
      // lấy 5 item 1 nhóm gom vào <div class="icons-row">{{5 item}}</div>
      const group = iconMenuFilteredList.slice(i, i + 5);

      iconMenuHtml += `<div class="icons-row">\n`;

      group.forEach(item => {
        iconMenuHtml += `
          <a href=${item.url} target="_blank" rel="noopener noreferrer">
            <div class="icon-cell">
              <img src="${item.img}" alt="${item.text}">
              <p>${item.text}</p>
            </div>
          </a>
        `;
      });

      iconMenuHtml += `</div>\n`;
    }

    // 注目キーワード
    let suggestKeywordHtml = suggestKeywordList
      .filter(item => !(item.keyword === "" && item.url === "")) // bỏ item toàn rỗng
      .map(item => `
          <a
            href=${item.url} target="_blank" rel="noopener noreferrer">
              <p>#${item.keyword}</p>
          </a>
        `)
      .join("\n");

    // スライドバナー
    const validSlides = slideList.filter(item => !(item.slideImg === "" && item.url === ""));

    let slideHtml = "";
    if (validSlides.length > 0) {
      const innerSlides = validSlides
        .map(item => `
          <div class="slider-img">
            <a href="${item.url}" target="_blank" rel="noopener noreferrer">
              <img src="${item.slideImg}" alt="バナー">
            </a>
          </div>
        `)
        .join("\n");

      slideHtml = `
        <div class="slider">
          ${innerSlides}
        </div>
      `;
    }

    // 特集設定
    const validFeatures = featureList.filter(item => !(item.img === "" && item.url === ""));
    let featureHtml = "";
    if (validFeatures.length > 0 && values.featureTitle !== "") {
      const innerFeature = validFeatures
        .map(item => `
            <div class="item">
              <a href=${item.url} target="_blank" rel="noopener noreferrer">
                <img class=${`img-` + item.colWidth + `col`} src=${item.img}>
              </a>
            </div>
        `)
        .join("\n");

      let innerButton = ``;
      if (showButtonSetting) {
        innerButton = `
          <div class="button" style="background-color:${values.hexColor};">
            <a href=${values.buttonLink} target="_blank" rel="noopener noreferrer">
              <p>${values.buttonText}</p>
            </a>
          </div>
        `
      }

      featureHtml = `
              <div class="items">
                  <div class="title" style="background-color:${values.hexColor};">
                      ${values.featureTitle}
                  </div>
                  <div class="items-container">

                      ${innerFeature}

                  </div>

                  ${innerButton}

              </div>
        `;
    }

    // Thêm <base href> để trình duyệt hiểu đường dẫn tương đối
    templateHtml = templateHtml.replace(
      /<head[^>]*>/i,
      `<head><base href="${window.location.origin}/template_html/tools/4/">`
    );
    // Gán các giá trị vào template
    templateHtml = templateHtml.replace("{{PAGE_TITLE}}", "PC用ヘッダー作成");
    templateHtml = templateHtml.replace(/{{MAIN_COLOR}}/g, values.hexColor);
    templateHtml = templateHtml.replace("{{TOP_MSG}}", `${values.topMessage}`);
    templateHtml = templateHtml.replace("{{NAVIGATION_MENU}}", navigationHtml);
    templateHtml = templateHtml.replace("{{STORE_LOGO_URL}}", `${values.storeLogoUrl}`);
    templateHtml = templateHtml.replace("{{IMG_AWARD}}", awardIconHtml);
    templateHtml = templateHtml.replace("{{ICON_MENU}}", iconMenuHtml);
    templateHtml = templateHtml.replace("{{SUGGEST_KEYWORD}}", suggestKeywordHtml);
    if (slideHtml !== "") {
      templateHtml = templateHtml.replace("{{SLIDE}}", slideHtml);
    } else {
      templateHtml = templateHtml.replace("{{SLIDE}}", "");
    }
    if (featureHtml !== "") {
      templateHtml = templateHtml.replace("{{FEATURE}}", featureHtml);
    } else {
      templateHtml = templateHtml.replace("{{FEATURE}}", "");
    }

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
    window.open("/tools/04/review", "_blank");
  }

  const selectColor = (color: string) => {

    formik.setFieldValue("hexColor", color)
  }

  // Table input
  const addNavigationRow = (numberRow: number = 1) => {

    for (let i = 0; i < numberRow; i++) {
      let newRow: navigationMenu = {
        id: navigationList.length + 1,
        name: "",
        url: "",
      };
      setNavigationList((prev) => [...prev, newRow]);
    }
  };

  const deleteNavigationRow = (id: number) => {

    setNavigationList((prev) => {
      const filtered = prev.filter((r) => r.id !== id);
      return filtered.map((r, index) => ({ ...r, id: index + 1 }));
    });
  };

  const addIconMenuRow = (numberRow: number = 1) => {

    for (let i = 0; i < numberRow; i++) {
      let newRow: iconMenu = {
        id: iconMenuList.length + 1,
        img: "",
        text: "",
        url: "",
      };
      setIconMenuList((prev) => [...prev, newRow]);
    }
  };

  const deleteIconMenuRow = (id: number) => {
    setIconMenuList((prev) => {
      const filtered = prev.filter((r) => r.id !== id);
      return filtered.map((r, index) => ({ ...r, id: index + 1 }));
    });
  };

  const addSuggestKeywordRow = (numberRow: number = 1) => {

    for (let i = 0; i < numberRow; i++) {
      let newRow: suggestKeyword = {
        id: suggestKeywordList.length + 1,
        keyword: "",
        url: "",
      };
      setSuggestKeywordList((prev) => [...prev, newRow]);
    }
  };

  const deleteSuggestKeywordRow = (id: number) => {
    setSuggestKeywordList((prev) => {
      const filtered = prev.filter((r) => r.id !== id);
      return filtered.map((r, index) => ({ ...r, id: index + 1 }));
    });
  };

  const addSlideRow = (numberRow: number = 1) => {
    for (let i = 0; i < numberRow; i++) {
      let newRow: slide = {
        id: slideList.length + 1,
        slideImg: "",
        url: "",
      };
      setSlideList((prev) => [...prev, newRow]);
    }
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

  const addFeatureRow = (numberRow: number = 1) => {
    for (let i = 0; i < numberRow; i++) {
      let newRow: feature = {
        id: featureList.length + 1,
        img: "",
        url: "",
        colWidth: "2",
      };
      setFeatureList((prev) => [...prev, newRow]);
    }
  };

  const deleteFeatureRow = (id: number) => {

    setFeatureList((prev) => {
      const filtered = prev.filter((r) => r.id !== id);
      return filtered.map((r, index) => ({ ...r, id: index + 1 }));
    });
  };

  return (
    <>
      <FormikProvider value={formik}>
        <form onSubmit={formik.handleSubmit}>
          <Card>
            <CardHeader title='1.基本設定' />
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
                  <ColorPicker
                    id='hexColor'
                    name='hexColor'
                    value={formik.values.hexColor}
                    onColorChange={(color) => {
                      formik.setFieldValue("hexColor", color);
                    }}
                  />
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
                          className='px-0'
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
            <CardHeader title='2. メニュー設定' />
            <CardContent>
              <div className='flex items-center justify-between mb-2'>
                <label
                  htmlFor={""}
                  className={cn(
                    'block text-sm font-medium text-gray-800',
                  )}>
                  ナビゲーションメニュー
                </label>
                <div className='flex gap-2'>
                  <Button
                    color='primary'
                    size='sm'
                    onClick={() => addNavigationRow(1)}
                  >
                    行を追加
                  </Button>
                  <Button
                    color='secondary'
                    size='sm'
                    onClick={() => addNavigationRow(5)}
                  >
                    5行追加
                  </Button>
                </div>
              </div>
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
              <div className='flex items-center justify-between mb-2'>
                <label
                  htmlFor={""}
                  className={cn(
                    'block text-sm font-medium text-gray-800',
                  )}>
                  アイコン付きメニュー
                </label>
                <div className='flex gap-2'>
                  <Button
                    color='primary'
                    size='sm'
                    onClick={() => addIconMenuRow(1)}
                  >
                    行を追加
                  </Button>
                  <Button
                    color='secondary'
                    size='sm'
                    onClick={() => addIconMenuRow(5)}
                  >
                    5行追加
                  </Button>
                </div>
              </div>

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
              <div className='flex items-center justify-between mb-2'>
                <label
                  htmlFor={""}
                  className={cn(
                    'block text-sm font-medium text-gray-800',
                  )}>
                  注目キーワード
                </label>
                <div className='flex gap-2'>
                  <Button
                    color='primary'
                    size='sm'
                    onClick={() => addSuggestKeywordRow(1)}
                  >
                    行を追加
                  </Button>
                  <Button
                    color='secondary'
                    size='sm'
                    onClick={() => addSuggestKeywordRow(5)}
                  >
                    5行追加
                  </Button>
                </div>
              </div>

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
            </CardContent>
          </Card>

          <Card>
            <CardHeader title='3. バナー設定' />
            <CardContent>
              <div className='flex items-center justify-between mb-2'>
                <label
                  htmlFor={""}
                  className={cn(
                    'block text-sm font-medium text-gray-800',
                  )}>
                  スライドバナー
                </label>
                <div className='flex gap-2'>
                  <Button
                    color='primary'
                    size='sm'
                    onClick={() => addSlideRow(1)}
                  >
                    行を追加
                  </Button>
                  <Button
                    color='secondary'
                    size='sm'
                    onClick={() => addSlideRow(5)}
                  >
                    5行追加
                  </Button>
                </div>
              </div>

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
            </CardContent>
          </Card>

          <Card>
            <CardHeader title='4. 特集設定' />
            <CardContent>
              <TextBox
                id="featureTitle"
                name="featureTitle"
                type="text"
                width='lg'
                isRequired={true}
                label={"見出し"}
                value={formik.values.featureTitle}
                placeholder="例：新商品"
                direction="vertical"
                onChange={formik.handleChange}
                error={formik.errors.featureTitle}
                touched={formik.touched.featureTitle}
              />
              <div className='flex justify-end gap-2 mb-2'>
                <Button
                  color='primary'
                  size='sm'
                  onClick={() => addFeatureRow(1)}
                >
                  行を追加
                </Button>
                <Button
                  color='secondary'
                  size='sm'
                  onClick={() => addFeatureRow(5)}
                >
                  5行追加
                </Button>
              </div>
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
                  {featureList?.map((item, index) => (
                    <Table.Row key={`feature-${index}`}>
                      <Table.InputCell
                        value={item.img}
                        onChange={(e) => {
                          setFeatureList((prevRows) =>
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
                          setFeatureList((prevRows) =>
                            prevRows.map((r) =>
                              r.id === item.id
                                ? { ...r, url: e.target.value }
                                : r
                            )
                          )
                        }}
                      />
                      <Table.SelectBox
                        value={item.colWidth}
                        onChange={(e) => {
                          setFeatureList((prevRows) =>
                            prevRows.map((r) =>
                              r.id === item.id
                                ? { ...r, colWidth: e.target.value }
                                : r
                            )
                          )
                        }}
                      >
                        <Table.Option value={"2"}>2列用</Table.Option>
                        <Table.Option value={"3"}>3列用</Table.Option>
                        <Table.Option value={"4"}>4列用</Table.Option>
                        <Table.Option value={"6"}>6列用</Table.Option>
                      </Table.SelectBox>
                      <Table.Button
                        onClick={() => deleteFeatureRow(item.id)}
                      >
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
              <SelectBox
                id=''
                name=''
                label='ボタン有無'
                width='sm'
                value={showButtonSetting ? "1" : "0"}
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
                      id="buttonText"
                      name="buttonText"
                      type="text"
                      width='lg'
                      isRequired={true}
                      label={"ボタン文言"}
                      value={formik.values.buttonText}
                      placeholder="例：楽天に遷移する"
                      direction="vertical"
                      onChange={formik.handleChange}
                      error={formik.errors.buttonText}
                      touched={formik.touched.buttonText}
                    />
                    <TextBox
                      id="buttonLink"
                      name="buttonLink"
                      type="text"
                      width='lg'
                      isRequired={true}
                      label={"ボタンリンク先"}
                      value={formik.values.buttonLink}
                      placeholder="例：https://www.rakuten.co.jp/"
                      direction="vertical"
                      onChange={formik.handleChange}
                      error={formik.errors.buttonLink}
                      touched={formik.touched.buttonLink}
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
