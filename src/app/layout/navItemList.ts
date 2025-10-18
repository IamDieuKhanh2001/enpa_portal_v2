import { IconBox, IconChartBar, IconFileText, IconPlug, IconTable } from "@tabler/icons-react";

const navItems = [
    {
        label: "SEO対策",
        icon: IconFileText,
        children: [
            {
                label: "検索結果 ダウンロードツール",
                href: "/52"
            },
            {
                label: "カテゴリ内表示順位更新ツール",
                href: "/1"
            },
        ],
    },
    {
        label: "データ分析",
        icon: IconBox,
        children: [
            {
                label: "商品レビュー取得ツール",
                href: "/4"
            },
            {
                label: "カテゴリ内表示順位更新ツール",
                href: "/1"
            },
        ],
    },
];

export default navItems;