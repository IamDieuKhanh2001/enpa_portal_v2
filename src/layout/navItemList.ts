import {
  IconBell,
  IconBrush,
  IconCalendarEvent,
  IconAd,
  IconChartBar,
  IconSettings,
} from "@tabler/icons-react";

const navItems = [
  {
    label: "自動掲載・通知ツール",
    icon: IconBell,
    children: [
      { label: "ランキング受賞バナー自動掲載", href: "/1" },
      { label: "レビュー評価バナー自動掲載", href: "/2" },
      { label: "売上急変動アラート", href: "/3" },
      { label: "楽天市場日報", href: "/4" },
      { label: "RPP予算消化アラート", href: "/5" },
    ],
  },
  {
    label: "デザイン・ページ制作",
    icon: IconBrush,
    children: [
      { label: "PC用ヘッダー作成", href: "/tools/4" },
      { label: "楽天GOLDヘッダー生成", href: "/6" },
      { label: "商品紹介パーツ生成", href: "/7" },
      { label: "コンテンツページ自動生成", href: "/8" },
      { label: "クーポンバナー生成", href: "/9" },
    ],
  },
  {
    label: "イベント・セール更新",
    icon: IconCalendarEvent,
    children: [
      { label: "サムネコロ一括生成・反映予約", href: "/10" },
      { label: "楽天GOLDセール会場生成", href: "/11" },
      { label: "二重価格セール画像生成", href: "/tools/03" },
      { label: "セール更新エクセル予約", href: "/13" },
      { label: "CSVアップロード予約", href: "/14" },
      { label: "カテゴリ別商品順位最適化", href: "/15" },
    ],
  },
  {
    label: "RPP広告管理",
    icon: IconAd,
    children: [
      { label: "RPPキーワードCPC自動調整", href: "/16" },
      { label: "RPP予算スケジュール", href: "/17" },
    ],
  },
  {
    label: "分析・レポート",
    icon: IconChartBar,
    children: [
      { label: "楽天サーチ検索結果一括ダウンロード", href: "/18" },
      { label: "楽天サーチ検索順位変動レポート", href: "/19" },
      { label: "サジェストワード調査", href: "/20" },
      { label: "楽天サーチ流入分析", href: "/21" },
      { label: "商品レビュー一括ダウンロード", href: "/22" },
      { label: "ギフト割合レポート", href: "/23" },
      { label: "RMS問い合わせ一括ダウンロード", href: "/24" },
      { label: "同梱率・併売商品レポート", href: "/25" },
      { label: "商品別売上分析レポート", href: "/26" },
    ],
  },
  {
    label: "商品管理・メンテナンス",
    icon: IconSettings,
    children: [
      { label: "商品一覧一括ダウンロード", href: "/27" },
      { label: "商品登録日チェックツール", href: "/28" },
      { label: "お気に入り登録URL一括ダウンロード", href: "/29" },
      { label: "モール接続確認", href: "/30" },
    ],
  },
];

export default navItems;
