'use client'

import React, { useEffect, useRef, useState } from 'react'
import { FormikProvider, useFormik } from "formik";
import * as Yup from 'yup';
import { useHeader } from '@/app/context/HeaderContext'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/component/common/Tabs'
import TabItem1 from './components/TabItem1'
import TabItem2 from './components/TabItem2'
import TabItem3 from './components/TabItem3'
import TabItem4 from './components/TabItem4'
import TabItem5 from './components/TabItem5'
import TabItem6 from './components/TabItem6'

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

  const { setTitle } = useHeader();

  useEffect(() => {
    setTitle("楽天GOLD ヘッダー生成");
  }, [setTitle]);

  const tabsRef = useRef<any>(null);
  const [isTab1Valid, setIsTab1Valid] = useState(false);

  // 2. メニュー設定
  const [navigationList, setNavigationList] = useState<navigationMenu[]>([
    {
      id: 1,
      name: "",
      url: "",
    },
  ]);
  const [iconMenuList, setIconMenuList] = useState<iconMenu[]>([
    {
      id: 1,
      img: "",
      text: "",
      url: "",
    },
  ]);
  const [suggestKeywordList, setSuggestKeywordList] = useState<suggestKeyword[]>([
    {
      id: 1,
      keyword: "",
      url: "",
    },
  ]);
  const [slideList, setSlideList] = useState<slide[]>([
    {
      id: 1,
      slideImg: "",
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

  const formik = useFormik({
    initialValues: {
      // 1.基本設定
      topMessage: "",
      storeLogoUrl: "",
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
      featureTitle: Yup.string().trim(),
      buttonText: showButtonSetting
        ? Yup.string().trim().required("入力してください。")
        : Yup.string().trim(),
      buttonLink: showButtonSetting
        ? Yup.string().trim().required("入力してください。")
        : Yup.string().trim(),
    }),
    onSubmit: async (values) => {
      // Lấy template HTML
      const responseHtml = await fetch("/template_html/tools/4/header.html");
      let templateHtml = await responseHtml.text();

      templateHtml = editHtmlContent(templateHtml, values)

      reviewLivePage(templateHtml);
    },
  });

  useEffect(() => {
    const checkTab1Valid = async () => {
      const errors = await formik.validateForm();

      const tab1Errors = (({ topMessage, storeLogoUrl, hexColor }) => ({
        topMessage,
        storeLogoUrl,
        hexColor,
      }))(errors);

      const valid = Object.values(tab1Errors).every((v) => !v);

      setIsTab1Valid(valid);
    };

    checkTab1Valid();
  }, [formik.values.topMessage, formik.values.storeLogoUrl, formik.values.hexColor]);


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
      if (awardUrl !== "") {
        awardIconHtml += `
        <img src=${awardUrl} alt="award">
      `
      }
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
    if (awardIconHtml !== "") {
      templateHtml = templateHtml.replace("{{IMG_AWARD}}", awardIconHtml);
    } else {
      templateHtml = templateHtml.replace("{{IMG_AWARD}}", "");
    }
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

  // Table input
  const addNavigationRow = (numberRow: number = 1) => {
    setNavigationList((prev) => {
      const newRows: navigationMenu[] = [];
      for (let i = 0; i < numberRow; i++) {
        newRows.push({
          id: prev.length + i + 1,
          name: "",
          url: "",
        });
      }
      return [...prev, ...newRows];
    });
  };

  const deleteNavigationRow = (id: number) => {
    setNavigationList((prev) => {
      const filtered = prev.filter((r) => r.id !== id);
      return filtered.map((r, index) => ({ ...r, id: index + 1 }));
    });
  };

  const addIconMenuRow = (numberRow: number = 1) => {
    setIconMenuList((prev) => {
      const newRows: iconMenu[] = [];
      for (let i = 0; i < numberRow; i++) {
        newRows.push({
          id: prev.length + i + 1,
          img: "",
          text: "",
          url: "",
        });
      }
      return [...prev, ...newRows];
    });
  };

  const deleteIconMenuRow = (id: number) => {
    setIconMenuList((prev) => {
      const filtered = prev.filter((r) => r.id !== id);
      return filtered.map((r, index) => ({ ...r, id: index + 1 }));
    });
  };

  const addSuggestKeywordRow = (numberRow: number = 1) => {
    setSuggestKeywordList((prev) => {
      const newRows: suggestKeyword[] = [];
      for (let i = 0; i < numberRow; i++) {
        newRows.push({
          id: prev.length + i + 1,
          keyword: "",
          url: "",
        });
      }
      return [...prev, ...newRows]
    })
  };

  const deleteSuggestKeywordRow = (id: number) => {
    setSuggestKeywordList((prev) => {
      const filtered = prev.filter((r) => r.id !== id);
      return filtered.map((r, index) => ({ ...r, id: index + 1 }));
    });
  };

  const addSlideRow = (numberRow: number = 1) => {
    setSlideList((prev) => {
      const newRows: slide[] = [];
      for (let i = 0; i < numberRow; i++) {
        newRows.push({
          id: prev.length + i + 1,
          slideImg: "",
          url: "",
        });
      }
      return [...prev, ...newRows]
    })
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
    setFeatureList((prev) => {
      const newRows: feature[] = [];
      for (let i = 0; i < numberRow; i++) {
        newRows.push({
          id: prev.length + i + 1,
          img: "",
          url: "",
          colWidth: "2",
        });
      }
      return [...prev, ...newRows]
    })
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
          <Tabs ref={tabsRef} defaultTab={"tab1"}>
            <TabsList>
              <TabsTrigger value="tab1">基本設定</TabsTrigger>
              <TabsTrigger disabled={!isTab1Valid} value="tab2">ナビゲーションメニュー設定</TabsTrigger>
              <TabsTrigger disabled={!isTab1Valid} value="tab3">アイコン付きメニュー設定</TabsTrigger>
              <TabsTrigger disabled={!isTab1Valid} value="tab4">注目キーワード設定</TabsTrigger>
              <TabsTrigger disabled={!isTab1Valid} value="tab5">スライドバナー設定</TabsTrigger>
              <TabsTrigger disabled={!isTab1Valid} value="tab6">特集設定</TabsTrigger>
            </TabsList>
            <TabsContent value="tab1">
              <TabItem1
                formik={formik}
                createInputAwardImg={createInputAwardImg}
                deleteInputAwardImg={deleteInputAwardImg}
                tabsRef={tabsRef}
              />
            </TabsContent>
            <TabsContent value="tab2">
              <TabItem2
                addNavigationRow={addNavigationRow}
                deleteNavigationRow={deleteNavigationRow}
                navigationList={navigationList}
                setNavigationList={setNavigationList}
                tabsRef={tabsRef}
              />
            </TabsContent>
            <TabsContent value="tab3">
              <TabItem3
                addIconMenuRow={addIconMenuRow}
                iconMenuList={iconMenuList}
                setIconMenuList={setIconMenuList}
                deleteIconMenuRow={deleteIconMenuRow}
                tabsRef={tabsRef}
              />
            </TabsContent>
            <TabsContent value="tab4">
              <TabItem4
                suggestKeywordList={suggestKeywordList}
                setSuggestKeywordList={setSuggestKeywordList}
                addSuggestKeywordRow={addSuggestKeywordRow}
                deleteSuggestKeywordRow={deleteSuggestKeywordRow}
                tabsRef={tabsRef}
              />
            </TabsContent>
            <TabsContent value="tab5">
              <TabItem5
                slideList={slideList}
                setSlideList={setSlideList}
                addSlideRow={addSlideRow}
                deleteSlideRow={deleteSlideRow}
                tabsRef={tabsRef}
              />
            </TabsContent>
            <TabsContent value="tab6">
              <TabItem6
                formik={formik}
                showButtonSetting={showButtonSetting}
                setShowButtonSettting={setShowButtonSettting}
                addFeatureRow={addFeatureRow}
                deleteFeatureRow={deleteFeatureRow}
                featureList={featureList}
                setFeatureList={setFeatureList}
              />
            </TabsContent>
          </Tabs>
        </form>
      </FormikProvider>
    </>
  )
}

export default page
