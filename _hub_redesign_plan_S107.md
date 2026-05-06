# SoloBuild Hub 首頁改造完整規劃 S107
> 建立日期：2026-04-27
> 作者：研究員外包（S107）
> 狀態：草稿，待 Harvey 拍板

---

## 1. 執行摘要（500 字內）

**要做什麼**：把 `solobuildtw.github.io/`（現為經驗包銷售頁）改造為 SoloBuild 品牌 Hub，集中導流到旗下所有子站（Pick-tw、Podcast 5 頻道、經驗包、接案外包）。現有經驗包頁面整體搬到 `/products/` 子路徑，Hub 根路徑改放品牌總覽與四象限導覽。

**多久**：8 個 Phase，保守估計 10-14 個工作天（Harvey 不用動，純外包執行）。Phase 1-3 可並行，最快 7 天能看到 Hub 上線雛形。

**哪些子站進入 Hub 導航**：
- Pick-tw（聯盟行銷）
- Podcast 5 頻道（SoloBuildTW / 冷知識電波 / 史上最蠢人類 / 地球的角落 / 燭光怪譚）
- 經驗包（教學包 + 靈魂包 + 組合包）
- 接案外包 TaskerGo（服務目錄）

**主要風險**：
- 現有 `/` 經驗包頁 SEO 權重隨 301 搬移，遷移前 1-2 週可能流量下跌 10-20%
- 多語三倍工作量（中/EN/JA），每次內容改動需同步三語
- Hub 首頁若設計不佳，可能降低訪客直接購買意願（轉換率風險）

**建議框架**：Hugo（跟 Pick-tw 一致，工具鏈共用，部署到 GitHub Pages 不增加費用）

---

## 2. 現況盤點

### 2.1 solobuildtw.github.io 當前內容

**倉庫路徑**：`D:/GitHub/solobuildtw.github.io/`

| 檔案 / 資料夾 | 類型 | 字數估計 | 當前 URL | 備註 |
|---|---|---|---|---|
| index.html | 經驗包繁中銷售頁 | ~598 行 | / | 主力 Landing，GA4 追蹤 G-DWXVFMH12H |
| en/index.html | 經驗包英文銷售頁 | 類似行數 | /en/ | hreflang=en |
| ja/index.html | 經驗包日文銷售頁 | 類似行數 | /ja/ | hreflang=ja |
| style.css | 共用樣式表 | 941 行 | /style.css | 含響應式設計 |
| main.js | 金流 CTA 邏輯 | 未知 | /main.js | CF Worker 呼叫邏輯 |
| privacy.html / .en.html / .ja.html | 隱私政策三語 | 各約 200 行 | /privacy.html 等 | 法務必要頁 |
| terms.html / .en.html / .ja.html | 服務條款三語 | 各約 200 行 | /terms.html 等 | 法務必要頁 |
| refund.html / .en.html / .ja.html | 退款政策三語 | 各約 200 行 | /refund.html 等 | 法務必要頁 |
| sitemap.xml | XML sitemap | 12 個 URL | /sitemap.xml | 含三語主要頁 |
| robots.txt | 爬蟲規則 | 7 行 | /robots.txt | /checkout/ /thank-you/ /test-pay 已封 |
| thank-you.html | 購買完成頁 | 小 | /thank-you.html | 藍新付款成功回來 |
| test-pay.html | 金流測試頁 | 小 | /test-pay.html | robots disallow |
| images/ | 產品圖資料夾 | — | /images/ | combo_1200x675.png 等 OG 圖 |
| podcast/ | Podcast RSS + 封面 | 5 子資料夾 | /podcast/{頻道}/ | feed.xml + cover.jpg × 5 頻道 |
| api/ | API 路由（未確認用途） | — | /api/ | 可能是舊版殘留 |
| charts/ | 圖表資料 | — | /charts/ | 可能是分析工具 |
| ai/ | AI 相關（未確認） | — | /ai/ | 可能是 llms.txt 或 AI 工具 |
| index_C路線_2026-04-18.html | 未上線備份版 | — | 無 URL | 本地備份 v4 |
| index_C路線_v5_2026-04-18.html | 未上線備份版 | — | 無 URL | 本地備份 v5（最新三語未推版） |

**Podcast 子資料夾（已確認）**：
- `podcast/yuching-tech-daily/` — CH1 SoloBuildTW（雨晴）
- `podcast/cold-knowledge/` — CH2 冷知識電波（芸芸）
- `podcast/earth-corners/` — CH4 地球的角落（熙熙）
- `podcast/stupid-humans/` — CH3 史上最蠢人類（阿佑）
- `podcast/candlelight-stories/` — CH5 燭光怪譚（燭先生）

**已知自訂域名**：`solobuildtw.com`（Cloudflare DNS 指向 GitHub Pages，$10.5/年，2026-04-12 購入）

---

### 2.2 現有 SoloBuild 相關子站

| 子站 | URL | 受眾 | 商業模式 | 進 Hub 導航？ | 備註 |
|------|-----|------|---------|------------|------|
| Pick-tw | https://pick-tw.com（CF Pages） | TW 消費者找比較/評測 | 聯盟分潤（MOMO 短連結） | **YES** | Hugo build，S87+ 修 SEO |
| Podcast CH1 SoloBuildTW | Apple/Spotify/SoundOn RSS | 想學 AI 工具的上班族 | Podcast 曝光 → 引流經驗包 | **YES** | 每週 3 集，雨晴 |
| Podcast CH2 冷知識電波 | Apple/Spotify/SoundOn RSS | 廣泛娛樂聽眾 | 月流量 + 廣告潛力 | **YES**（列出即可） | 每日，芸芸 |
| Podcast CH3 史上最蠢人類 | Apple/Spotify/SoundOn RSS | 搞笑/社會新聞聽眾 | 月流量 + 廣告潛力 | **YES**（列出即可） | 每日，阿佑 |
| Podcast CH4 地球的角落 | Apple/Spotify/SoundOn RSS | 地理旅遊聽眾 | 月流量 + 廣告潛力 | **YES**（列出即可） | 每日，熙熙 |
| Podcast CH5 燭光怪譚 | Apple/Spotify/SoundOn RSS | 恐怖/懸疑聽眾 | 月流量 + 廣告潛力 | **YES**（列出即可） | 每日，燭先生 |
| 經驗包 | solobuildtw.github.io（現在 /） | 上班族/Solo Builder/副業人 | 直接銷售 NT$499-999 | **YES（核心）** | 遷到 /products/ |
| TaskerGo 接案外包 | TaskerGo 平台（非獨立 URL） | 需要外包服務的小業主 | 接案抽成 NT$2,000+/月目標 | **YES** | 導到服務說明頁 |
| PokerBot | 無公開 URL | Harvey 個人 | 個人工具，無商業模式 | **NO** | 內部工具，不進 Hub |
| YT 三頻道 | YouTube（A沉靜/B不可能/C漫畫） | 廣泛 YouTube 觀眾 | YPP 廣告收入（長期） | **待拍板** | 企劃完成未啟動，建議 Hub 內保留佔位 |
| B 站代理 | Bilibili（8 WF inactive） | 大陸觀眾 | B 站流量 | **NO**（暫） | credentials 未綁定 |
| Amazon JP | Amazon Japan | 日本買家（實體商品） | 商品差價 | **NO** | 實體商品，與 Hub 定位不符 |
| BOOTH JP | booth.pm/solobuildtw（推測） | 日本創作者市場 | 虛擬商品銷售 JPY | **YES**（連結到 /products/ 即可） | 三品項公開 |
| Gumroad/Ko-fi/LS | 各平台連結 | 國際買家 | 直接銷售 USD | **YES**（在 /products/ 內列） | 不單獨在 Hub 一級導航 |

---

### 2.3 現有經驗包 SEO 狀況

**已確認事項**（來自 solobuildtw_landing 專案腦 + sitemap）：
- Google Search Console：已驗證，sitemap 已提交
- Canonical URL：https://solobuildtw.github.io/（目前根路徑）
- hreflang 三語：zh-Hant / en / ja 均已設置
- FAQPage JSON-LD：已注入（富文本結構化資料）
- Organization + ItemList Schema：已注入

**推測（未確認，標記為推測）**：
- GSC 收錄量：sitemap 共 12 個 URL，預估全部已收錄（推測，未查 GSC 實際數字）
- 主關鍵字：「Claude Code 經驗包」「AI 教學包」相關（推測，未查 GSC Search Analytics）
- 流量來源：有機搜尋為主，可能含 Podcast 引流（推測）

**不能破壞的 URL**：
- `https://solobuildtw.github.io/` — 現有經驗包頁，有 GA4 + GSC 紀錄
- `https://solobuildtw.github.io/en/` — EN 版
- `https://solobuildtw.github.io/ja/` — JA 版
- 9 個法律頁（privacy / terms / refund × 3 語）

**遷移後必須 301 redirect 保留所有舊 URL 權重**。

---

## 3. SoloBuild Hub 概念設計

### 3.1 Hub 定位

**品牌核心訴求**：SoloBuild 是一個用 AI 工具打造一人公司的方法論與內容品牌。

**建議 Tagline（草案，待 Harvey 確認）**：
- 主選：「一個人，做一家公司的事」
- 備選 A：「AI 幫你做事，你只需要做決定」
- 備選 B：「Solo Builder 的工具集」

**受眾分類與對應路徑**：

| 受眾 | 描述 | Hub 路徑 |
|------|------|---------|
| 想學 AI 工具的上班族 | 有工作、想用 AI 提效/副業 | → 經驗包（/products/） |
| Solo Builder / 微型創業者 | 已在創業、想自動化 | → Pick-tw 工具比較 + 經驗包 |
| Podcast 聽眾 | 碎片時間聽內容 | → Podcast 5 頻道（/podcast/） |
| 有外包需求的小業主 | 需要短期技術外包 | → 接案服務（/services/） |
| 日本市場 / 國際市場 | 英日語 Hub 版本 | → /en/ 或 /ja/ |

---

### 3.2 頁面結構（線框圖）

```
[HERO]
   Logo + Tagline：「一個人，做一家公司的事」
   Sub-headline：Harvey 第一人稱介紹 SoloBuild 是什麼
   主要 CTA：「看看我們的工具」（scroll 到象限）
   次要 CTA：「聽 Podcast」

[四象限導覽]
   +-----------------------+-----------------------+
   |  1. 學（知識/教學）   |  2. 聽（Podcast）     |
   |  經驗包               |  5 個頻道             |
   |  Claude Code 教學包   |  SoloBuildTW 等       |
   |  靈魂包               |                       |
   |  [立即購買]           |  [開始收聽]           |
   +-----------------------+-----------------------+
   |  3. 找（比較/選品）   |  4. 請（外包服務）    |
   |  Pick-tw              |  接案外包             |
   |  AI工具/產品比較評測  |  自動化/AI建置服務    |
   |  MOMO聯盟分潤         |                       |
   |  [前往 Pick-tw]       |  [了解服務]           |
   +-----------------------+-----------------------+

[社群驗證]
   數字：已服務 X 人 / X 個 Podcast 集 / X 篇評測
   （只列可確認的數字，勿虛報）

[關於 SoloBuild]
   Harvey 一段話 + 品牌故事

[最新動態]（選用）
   最新 Podcast 集 / 最新 Pick-tw 文章（可 iframe 或靜態列表）

[Footer]
   多語切換 | 隱私政策 | 服務條款 | 退款政策 | 聯繫
```

---

### 3.3 導航設計

**Top Nav 項目（建議 6 個）**：
1. 首頁（Logo 點擊）
2. 學（Products）— 下拉：教學包 / 靈魂包 / 組合包
3. 聽（Podcast）— 下拉：5 頻道列表
4. 找（Pick-tw）— 外開 pick-tw.com
5. 請（Services）— 接案外包說明
6. 關於（About）

**多語切換**：右上角旗幟圖示，TW / EN / JA 三語。

**子站連結格式**：
- Pick-tw：直連 `https://pick-tw.com`（target="_blank"，獨立網站）
- Podcast 頻道：連到各平台（Apple / Spotify / SoundOn），在 `/podcast/` 頁聚合
- 法律頁：Footer 連結，路徑統一到 `/legal/`（301 從舊路徑）

---

### 3.4 視覺風格

**建議方向**：
- **配色**：沿用現有經驗包主色（深色系 + 強調色），避免二次設計成本。現有 style.css 941 行可作基礎。
- **字體**：現有使用 Noto Sans TC + Inter，保留即可（已有 Google Fonts 預加載）。
- **動效**：簡潔優先（Karpathy 原則 2）。Hover 效果保留，不加 scroll animation 除非有必要。
- **圖片**：Hub 首頁需要一張 Harvey 品牌照或品牌主圖（**待 Harvey 提供或確認**）。

**待 Harvey 確認**：
- 品牌色是否要統一（現在經驗包深色 Landing 風格是否要延伸到 Hub？）
- Hub 首頁是否需要 Harvey 個人照？

---

## 4. URL 結構規劃

### 4.1 新 URL 配置（完整）

```
/ → Hub 首頁（新）

/products/ → 經驗包總覽（從 / 遷移）
/products/teaching-pack → 教學包說明 + 購買 CTA
/products/soul-pack → 靈魂包說明 + 購買 CTA
/products/combo → 組合包說明 + 購買 CTA

/podcast/ → 5 頻道總覽（新）
/podcast/solobuildtw → CH1 SoloBuildTW（雨晴）
/podcast/cold-knowledge → CH2 冷知識電波（芸芸）
/podcast/stupid-humans → CH3 史上最蠢人類（阿佑）
/podcast/earth-corners → CH4 地球的角落（熙熙）
/podcast/candlelight-stories → CH5 燭光怪譚（燭先生）

/picktw → 301 redirect 到 https://pick-tw.com

/services → 接案外包說明（新）

/about → 關於 SoloBuild（新）
/contact → 聯繫（選用，或合併到 about）

/legal/privacy → 隱私政策
/legal/privacy/en → 英文版
/legal/privacy/ja → 日文版
/legal/terms → 服務條款
/legal/terms/en → 英文版
/legal/terms/ja → 日文版
/legal/refund → 退款政策
/legal/refund/en → 英文版
/legal/refund/ja → 日文版

/en/ → Hub 英文首頁
/en/products/ → 英文經驗包
/en/podcast/ → 英文 Podcast 頁
/en/services → 英文接案頁
/en/about → 英文關於

/ja/ → Hub 日文首頁
/ja/products/ → 日文經驗包
/ja/podcast/ → 日文 Podcast 頁
/ja/services → 日文接案頁
/ja/about → 日文關於
```

---

### 4.2 多語結構

**建議採用路徑前綴制**（現有架構已採此模式）：
- `/` → 繁中
- `/en/` → 英文
- `/ja/` → 日文

**優點**：符合現有 hreflang 設置，GSC 不需大改。
**缺點**：三倍維護工作量。

**替代方案（不建議）**：`?lang=en` 查詢字串 — SEO 效果較差，已確認現有 index.html 有做 `?lang=en` 自動 redirect 到 `/en/`，遷移時可保留此邏輯。

---

### 4.3 301 Redirect 計畫（完整對應表）

| 舊 URL | 新 URL | 備註 |
|--------|--------|------|
| `/` | `/products/` | 主力頁面遷移，權重轉移 |
| `/en/` | `/en/products/` | EN 版遷移 |
| `/ja/` | `/ja/products/` | JA 版遷移 |
| `/privacy.html` | `/legal/privacy` | 法務頁統一入 /legal/ |
| `/privacy.en.html` | `/legal/privacy/en` | |
| `/privacy.ja.html` | `/legal/privacy/ja` | |
| `/terms.html` | `/legal/terms` | |
| `/terms.en.html` | `/legal/terms/en` | |
| `/terms.ja.html` | `/legal/terms/ja` | |
| `/refund.html` | `/legal/refund` | |
| `/refund.en.html` | `/legal/refund/en` | |
| `/refund.ja.html` | `/legal/refund/ja` | |
| `/podcast/yuching-tech-daily/` | `/podcast/solobuildtw` | Podcast RSS 路徑不動（feed.xml 保留） |
| `/podcast/cold-knowledge/` | `/podcast/cold-knowledge` | 同上 |
| `/podcast/stupid-humans/` | `/podcast/stupid-humans` | 同上 |
| `/podcast/earth-corners/` | `/podcast/earth-corners` | 同上 |
| `/podcast/candlelight-stories/` | `/podcast/candlelight-stories` | 同上 |

**重要**：Podcast `feed.xml` 和 `cover.jpg` 的完整路徑**不可改動**，Apple Podcast / Spotify 已抓取這些 RSS URL。只需在新 /podcast/ 頁面建立展示頁，不動實際 RSS 位置。

**GitHub Pages 301 redirect 實作方式**：
- 純 HTML/JS：在舊路徑放 `<meta http-equiv="refresh">` + JS `location.replace()`（非真 301，SEO 效果差）
- **正確方式**：若改用 Hugo，可透過 `aliases` 功能自動產生 301
- 若維持純 HTML：改用 Cloudflare Page Rules 或 CF Workers 做真 301（成本 $0，已有 CF 帳號）

---

## 5. 經驗包遷移策略

### 5.1 內容遷移

| 現有檔案 | 目標路徑 | 備註 |
|---------|---------|------|
| index.html（繁中） | /products/index.html | 內容原封不動，僅更新 canonical + CTA |
| en/index.html（英文） | /en/products/index.html | 同上 |
| ja/index.html（日文） | /ja/products/index.html | 同上 |
| style.css | /style.css（共用）| Hub + Products 共用，加 Hub 相關樣式 |
| main.js | /main.js（共用）| 金流邏輯不動 |
| images/ | /images/（原位）| 不需搬移，相對路徑需檢查 |
| index_C路線_v5_*.html | /products/index_v5（備份）| Landing C v5 未推版，遷移時評估是否直接用 v5 |

**建議**：遷移時直接採用 Landing C v5（已完成三語，存在 `index_C路線_v5_2026-04-18.html`），不用再改一次舊版。等 Harvey 視覺審查後再推。

---

### 5.2 SEO 保留策略

1. **所有舊 URL 設 301 redirect**（透過 CF Workers 或 Hugo aliases）
2. **Canonical 更新**：所有 /products/ 頁面 canonical 指向新路徑
3. **hreflang 更新**：三語 hreflang 對應到新 /en/products/ /ja/products/
4. **sitemap.xml 更新**：同時含新路徑 + 舊路徑（前 3 個月保留舊路徑在 sitemap，之後移除）
5. **GSC 重新提交**：新 sitemap 推送後到 GSC Search Console 點「要求索引」
6. **GA4 追蹤碼**：Hub 首頁加入同一個 G-DWXVFMH12H，確保流量連續追蹤

---

### 5.3 多語遷移

- 三語版 products 頁面一次完成，不分批
- Hub 首頁三語版可先做繁中，EN/JA 可用 DeepL 協助（按 feedback_deepl_all_foreign 規定需回譯驗證）
- 法律頁三語已存在，搬到 /legal/ 路徑即可，內容不需改動

---

## 6. 技術選型

### 6.1 框架評估

| 選項 | 簡介 | 優點 | 缺點 | 費用 |
|------|------|------|------|------|
| A. 純 HTML/CSS/JS | 維持現有方式 | 零學習成本、即用 | 多語管理痛苦（檔案爆炸）、無法 component 化 | $0 |
| B. Hugo | 靜態 SSG，Pick-tw 已用 | 工具鏈共用、build 秒級、i18n 原生支援、GitHub Pages 免費 | Harvey 或外包需熟悉 Hugo 模板 | $0 |
| C. Astro | 現代 SSG，component-first | 性能優秀、MDX 支援、Islands 架構 | Pick-tw 不用 Astro，工具鏈不共用 | $0（部署到 CF Pages 免費） |
| D. Next.js | React SSR/SSG | 功能最強 | 維護成本高、overkill for 靜態 Hub | CF Pages 免費，但 build 較慢 |

**推薦：B. Hugo**

理由：
1. Pick-tw 已採用 Hugo + CF Pages，外包有現成工具鏈
2. Hugo i18n 原生支援繁中/EN/JA，比純 HTML 三份檔案易管理
3. GitHub Pages 直接部署（不需新增付費服務）
4. 如果後續要轉 CF Pages 也容易（Pick-tw 的 deploy 指令可直接參考）

**備選：A. 純 HTML**（若 Harvey 想最快速上線且不想動 Build pipeline）

---

### 6.2 部署方案

| 選項 | 速度 | 費用 | 難度 |
|------|------|------|------|
| GitHub Pages（現用） | 慢（1-2 min 生效，全球不均）| $0 | 低 |
| Cloudflare Pages | 快（邊緣快取，全球秒級）| $0（免費層）| 低（有 Pick-tw 先例）|
| CF Pages + R2 靜態資源 | 最快 | $0 小流量 | 中 |

**建議**：改用 Cloudflare Pages（與 Pick-tw 一致）。$0 費用，速度優於 GitHub Pages，且已有 solobuildtw.com 域名接在 Cloudflare DNS，config 最簡單。

---

## 7. 開發階段（Phase 拆解）

| Phase | 名稱 | Goal | 驗證標準 | 預估時長 | 依賴 |
|---|---|---|---|---|---|
| 1 | 規劃定稿 | Harvey 拍板此規劃文件 | Harvey 回覆「OK」| 0（本文件即 Phase 1）| — |
| 2 | 視覺 Mockup | Hub 首頁線框圖 → HTML 靜態 mockup（繁中版）| Harvey 視覺審查 OK | 1 天 | Phase 1 |
| 3 | 建站初始化 | Hugo init + theme 選定 + 主結構（頁面骨架）| `hugo server` 本地跑通，4 個主要路徑 200 | 0.5 天 | Phase 1 |
| 4 | 內容遷移 | 經驗包 → /products/，Landing C v5 → /products/（若 Harvey 批准 v5）| /products/ 頁面完整，GA4 追蹤正常，CTA 金流連結正常 | 1 天 | Phase 3 |
| 5 | Hub 首頁刻 | 四象限 + Hero + About，繁中版 | 本地 mockup → 真實 HTML，所有 CTA 連結正確 | 2 天 | Phase 2,3 |
| 6 | Podcast 頁 | /podcast/ 總覽 + 5 頻道子頁（feed.xml 不動）| 5 頻道各有展示頁，Apple/Spotify 連結正確 | 0.5 天 | Phase 3 |
| 7 | 多語 i18n | EN/JA 版 Hub 首頁 + Products + Podcast + Services | hreflang 正確，三語 DeepL 回譯驗證 | 2 天 | Phase 5,6 |
| 8 | 301 + SEO + 上線 | 全部舊 URL 301 設好，sitemap 更新，CF Pages 部署，GSC 重提交 | 舊 URL curl 返回 301，新 URL 200，GSC 提交成功 | 0.5 天 | Phase 4-7 |

**總計預估**：7-8 工作天（排除 Harvey review 等待時間）
**最快時程**：Phase 2+3 並行 → 7 天看到 Hub 上線

---

## 8. 風險評估

| 風險 | 機率 | 影響 | 緩解方案 |
|------|------|------|---------|
| 遷移後 SEO 流量下跌 | 中（任何 301 都有短期跌）| 中（2-4 週恢復）| 確保 301 全部設好 + GSC 重提交 + sitemap 同步更新 |
| 多語維護成本超出預期 | 高（三倍工作量是現實）| 低（可延後做 EN/JA Hub）| 先只做繁中 Hub，EN/JA Hub 首頁可 delay 到 Phase 2 後 |
| Hub 設計降低轉換率 | 中（訪客被分散）| 中（直接衝擊銷售）| Hub 首頁放顯眼的「購買經驗包」CTA，不讓經驗包在視覺上弱化 |
| Podcast feed.xml 路徑被動到 | 低（有規劃保留）| 高（Apple/Spotify 取消訂閱）| 嚴格規定：podcast/ 子目錄下 feed.xml 不移動，只新增展示頁 |
| CF Pages 域名切換時短暫斷線 | 低 | 低（1-2 分鐘）| 選低流量時段（凌晨 2-4 點 TPE）切換 |
| Hugo 工具鏈陌生外包做錯 | 中 | 中 | 先參考 Pick-tw Hugo 設定，不從零開始 |

---

## 9. 預估

### 開發時長
- **Phase 2-8**：7-8 工作天（純外包執行，Harvey 只需在 Phase 2 和最終上線前各看一次）
- **Harvey 參與時間**：約 30 分鐘（視覺審查 + 最終拍板）

### 開發費用
| 項目 | 費用 | 備註 |
|------|------|------|
| 框架（Hugo）| $0 | 開源 |
| 部署（CF Pages）| $0 | 免費層 |
| 域名（solobuildtw.com）| 已付 $10.5/年 | 無新增 |
| 品牌圖/設計 | $0（自行用 AI 產）| 若需要 Midjourney 等 |
| Hugo 付費主題 | $0-49（選用）| 免費主題夠用 |
| **合計** | **$0（或最多 $49 買主題）** | |

### 維護費用（上線後）
- 每月：0-2 小時（內容更新、新頻道加入等）
- 費用：$0（GitHub Pages 或 CF Pages 免費層）

---

## 10. 我推的方案

**推薦**：Hugo + Cloudflare Pages，純靜態 Hub，8 Phase 完整執行，先繁中 Hub 上線，EN/JA Hub 首頁可後補。

**理由**：
1. Hugo 跟 Pick-tw 工具鏈一致，外包學習成本最低
2. CF Pages 速度優於 GitHub Pages，$0 費用
3. 8 Phase 清楚切分，每個 Phase 有可驗證目標，不會失控
4. 經驗包遷移到 /products/ 後，Hub 根路徑流量可引導更多受眾，長期 SEO 擴展性更好
5. 直接採用已完成的 Landing C v5（三語），省去重新改版工時

---

## 11. 待 Harvey 拍板項目

以下 6 個決策點，不拍板無法推進：

| # | 決策點 | 選項 | 我的建議 |
|---|--------|------|---------|
| 1 | **框架選哪個？** | A. 純 HTML / B. Hugo / C. Astro | **B. Hugo**（工具鏈共用）|
| 2 | **YT 三頻道要進 Hub 嗎？** | YES（佔位但標「即將推出」） / NO（不提）| **YES 佔位**（企劃完成了，佔位成本低）|
| 3 | **Landing C v5 遷移時直接用，還是繼續用現有版？** | 直接用 v5（未推的新版）/ 用現有舊版 | **直接用 v5**（已完成，早點推）|
| 4 | **Hub 首頁視覺：延伸現有深色風格，還是設計新的？** | 延伸現有（低成本） / 全新設計（高成本）| **延伸現有**（省成本，品牌延續）|
| 5 | **部署到哪裡？** | GitHub Pages（現用）/ Cloudflare Pages | **CF Pages**（速度快，$0，與 Pick-tw 一致）|
| 6 | **時程急嗎？** | 急（1-2 週完成）/ 不急（排入 P2 隊）| 請 Harvey 定優先級 |

---

*本文件為純規劃，不含任何執行動作。所有決策需 Harvey 拍板後才能推進。*
