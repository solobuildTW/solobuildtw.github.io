# SoloBuildTW 主域名遷移完整規劃 S107

> 建立時間：2026-04-27
> 狀態：純規劃，未執行任何修改
> 根據：grep 掃描 repo 49 檔 + API.txt + N8N 模板確認

---

## 1. 目標架構

```
solobuildtw.com（主）
├── /                   Hub 首頁（4 區塊，已在 repo）
├── /products/          教學包三語（從 .github.io/ 遷）
├── /podcast/           5 頻道頁 + RSS
├── /about/             工作室三語
├── /api/               A 企劃 API 殼（已在 repo）
├── /pricing/           價目表
└── /legal/             法律頁（zh/en/ja）

api.solobuildtw.com     A 企劃 API（CF Worker / RapidAPI gateway）
solobuildtw.github.io   → 自動 301 到 solobuildtw.com（GitHub Pages custom domain 內建）
```

---

## 2. DNS 設定（Harvey 自己改）

### 2.1 前置：登入域名註冊商
域名 `solobuildtw.com` 在哪裡買的 → 登入那個控制台的 DNS 管理頁。

### 2.2 主域名 solobuildtw.com
新增以下 A record（GitHub Pages 官方 4 個 IP）：

| 類型 | 主機名 | 值 |
|------|--------|-----|
| A | @ | 185.199.108.153 |
| A | @ | 185.199.109.153 |
| A | @ | 185.199.110.153 |
| A | @ | 185.199.111.153 |
| CNAME | www | solobuildtw.github.io. |

> 注意：CNAME www 末尾加點（`.`），部分控制台必須。

### 2.3 API 子域名 api.solobuildtw.com

| 類型 | 主機名 | 值 |
|------|--------|-----|
| CNAME | api | taiwan-data-api.harvey3630.workers.dev. |

> 若 CF Worker 尚未部署，此步驟可 Phase 4 再做。

### 2.4 SSL
- GitHub Pages 設好 custom domain 後，Let's Encrypt 自動發憑證
- DNS propagation 需 5-30 分鐘，最長 48 小時（通常 <15 min）
- SSL 自動啟用後勾選 GitHub Pages "Enforce HTTPS"

---

## 3. GitHub Pages 設定

### 3.1 加 CNAME 檔
在 repo 根目錄建一個新檔 `CNAME`（目前不存在，已確認）：
```
solobuildtw.com
```

> 確認：grep 掃描確認 repo 根目前無 CNAME 檔。

### 3.2 repo Settings 操作
1. 進 `solobuildtw.github.io` repo → Settings → Pages
2. Custom domain 欄位填入：`solobuildtw.com`
3. 按 Save
4. 等 DNS check 通過（頁面會顯示綠勾）
5. 勾選 Enforce HTTPS

### 3.3 redirect 機制說明
GitHub Pages 設好 custom domain 後：
- `https://solobuildtw.github.io/` → 自動 301 → `https://solobuildtw.com/`
- `https://solobuildtw.github.io/products/` → 自動 301 → `https://solobuildtw.com/products/`
- 所有舊路徑一一保留 → **無需任何 HTML meta refresh 或 Netlify _redirects**
- 現有 `_redirects` 檔（/en/ → /products/index.en.html 等）GitHub Pages 不讀，不影響

---

## 4. Repo 內部內容遷移

### 4.1 Hub 主頁
已就位（index.html 4 區塊改動），push 後直接生效。

### 4.2 Repo 內 49 個檔需 URL 替換

**確認事實**：grep 掃描共找到 49 個檔含 `solobuildtw.github.io` 字串，需全部改為 `solobuildtw.com`。

分類如下：

**A. Hub & 根目錄頁面（2 檔）**
- `index.html` — og:url / og:image / canonical / hreflang（6 refs）
- 備用稿（`index_C路線_*.html` 2 個）— 歷史備份，可不改，但建議刪除

**B. Hub 子頁面（8 檔）**
- `about/index.html`, `about/index.en.html`, `about/index.ja.html`
- `api/index.html`
- `en/index.html`, `ja/index.html`
- `podcast/index.html`
- 各含 2-6 refs

**C. 法律頁 — 根目錄版（9 檔）**
- `privacy.html` / `privacy.en.html` / `privacy.ja.html`
- `refund.html` / `refund.en.html` / `refund.ja.html`
- `terms.html` / `terms.en.html` / `terms.ja.html`
- 各 4 refs

**D. 法律頁 — /legal/ 版（9 檔）**
- `legal/privacy.html` / `legal/privacy.en.html` / `legal/privacy.ja.html`
- `legal/refund.html` / `legal/refund.en.html` / `legal/refund.ja.html`
- `legal/terms.html` / `legal/terms.en.html` / `legal/terms.ja.html`

> 注意：repo 內 `_redirects` 檔含 `/en/ → /products/index.en.html` 等規則，但 **GitHub Pages 不讀此檔**（這是 Netlify 專屬格式），這些重定向從未生效。遷移後仍不生效。如要真重定向需加 HTML meta refresh 或在新 .com 用 Cloudflare Page Rules。`_redirects` 不需更動。

**E. 教學包頁面（3 檔）**
- `products/index.html`（10 refs）
- `products/index.en.html`（9 refs）
- `products/index.ja.html`（9 refs）
- 含 og:url / og:image / canonical / hreflang / JSON-LD

**F. 教學包法律頁 — /products/legal/（9 檔）**
- `products/legal/privacy.html` / `.en.html` / `.ja.html`
- `products/legal/refund.html` / `.en.html` / `.ja.html`
- `products/legal/terms.html` / `.en.html` / `.ja.html`
- 各 4 refs

**G. Podcast feed.xml（5 檔）**
- `podcast/candlelight-stories/feed.xml`（15 refs）
- `podcast/cold-knowledge/feed.xml`（15 refs）
- `podcast/earth-corners/feed.xml`（15 refs）
- `podcast/stupid-humans/feed.xml`（15 refs）
- `podcast/yuching-tech-daily/feed.xml`（15 refs）
- 含 channel link / atom:link / itunes:image / 各 episode link

**H. SEO 資產（2 檔）**
- `sitemap.xml`（18 refs）
- `robots.txt`（1 ref：Sitemap 行）

**I. AI 搜尋資產（1 檔）**
- `ai/solobuildtw-github-io/llms.txt`（1 ref：Web 行）

**J. 規劃文件（1 檔，非生產）**
- `_hub_redesign_plan_S107.md`（規劃備忘，可不改）

**批次替換指令（執行時用）：**
```bash
# 在 repo 根執行（Windows Git Bash）
# 預覽：
grep -r "solobuildtw\.github\.io" . --include="*.html" --include="*.xml" --include="*.txt" --include="*.md" -l

# 實際替換（執行前再確認）：
find . -type f \( -name "*.html" -o -name "*.xml" -o -name "*.txt" \) \
  ! -name "CNAME" \
  -exec sed -i 's|solobuildtw\.github\.io|solobuildtw.com|g' {} +
```

> 警告：執行前先 git status 確認乾淨狀態，替換後 diff 審查再 commit。

### 4.3 URL 對應表（主要頁面）

| 舊 URL | 新 URL |
|--------|--------|
| `solobuildtw.github.io/` | `solobuildtw.com/` |
| `solobuildtw.github.io/products/` | `solobuildtw.com/products/` |
| `solobuildtw.github.io/products/index.en.html` | `solobuildtw.com/products/index.en.html` |
| `solobuildtw.github.io/products/index.ja.html` | `solobuildtw.com/products/index.ja.html` |
| `solobuildtw.github.io/podcast/` | `solobuildtw.com/podcast/` |
| `solobuildtw.github.io/about/` | `solobuildtw.com/about/` |
| `solobuildtw.github.io/api/` | `solobuildtw.com/api/` |
| `solobuildtw.github.io/legal/privacy.html` | `solobuildtw.com/legal/privacy.html` |
| `solobuildtw.github.io/products/legal/privacy.html` | `solobuildtw.com/products/legal/privacy.html` |
| `solobuildtw.github.io/thank-you` | `solobuildtw.com/thank-you` |

---

## 5. 對外連結改名清單

> 以下是 repo 外部需 Harvey 手動更新的平台（無法批次自動改）。

### 5.1 付款系統（高優先）

| 位置 | 目前值 | 要改成 |
|------|--------|--------|
| CF Worker 設定（API.txt 確認）| `https://solobuildtw.github.io/thank-you` | `https://solobuildtw.com/thank-you` |
| 藍新金流後台 ReturnURL | 同上 | 同上 |
| N8N WF payment webhook | 需確認 WF 內容 | 同上 |

> 這是最高風險項目。改錯或未改 → 付款成功後客戶看不到感謝頁。

#### 付款 Return URL 具體 SOP

**步驟 1：改 CF Worker 內 hardcode thank-you URL**

檔案：`D:/N8N全自動工作流/pay-worker/src/index.js` **L897**

目前值：
```js
const thankYou = "https://solobuildtw.github.io/thank-you.html";
```
改成：
```js
const thankYou = "https://solobuildtw.com/thank-you.html";
```

改完後用 `python D:/N8N全自動工作流/deploy_worker.py` 部署（禁用 wrangler deploy，#143 血淚）。

> 注意：CF Worker 的 `NotifyURL` / `ReturnURL`（L208-209）是動態組成（`${origin}/api/notify`、`${origin}/api/return`），自動跟 Worker domain 走，**不需改**。只有 L897 的 thank-you redirect 是 hardcode，必改。

**步驟 2：確認藍新後台設定**

登入藍新後台 → 商店管理 → 商店資料 → 找「付款完成頁面網址（ReturnURL）」欄位
- 若欄位有填 `solobuildtw.github.io/thank-you` → 改成 `solobuildtw.com/thank-you.html`
- 若欄位空白 → CF Worker L897 改完即可（藍新 POST 到 Worker 的 /api/return，Worker 再 redirect）

> 藍新後台路徑：https://core.newebpay.com → 商店管理 → 商店資料（使用 `NEWEBPAY_MERCHANT_ID = MS1826456779` 的帳號登入）

**步驟 3：改完強制跑 NT$1 測試**

```bash
# 用 payment_chain.md A3 SOP 的測試方式（curl 模擬，不要 Harvey 當白老鼠）
# 商品 key = test，金額 = NT$1
curl "https://pay.solobuildtw.com/api/pay?product=test&ref=migration_test&lang=tw"
```

確認回應含正確 `solobuildtw.com/thank-you.html` 的 redirect URL 後才視為通過。

### 5.2 API.txt 密碼本

`D:/N8N全自動工作流/API.txt` 內兩處引用（確認）：
1. `Return URL：https://solobuildtw.github.io/thank-you`
2. `SoloBuildTW Landing：solobuildtw.github.io`

改完後同步更新 `.bak` 備份：`API.txt.bak_papa_cleanup_S87`

### 5.3 Claude 啟動檔

`D:/N8N全自動工作流/claude-start.txt` 第 424、524 行有 `solobuildtw.github.io` 引用：
- L424：AEO commit 確認記錄（歷史備忘，可留）
- L524：PageSpeed 目標（改成 `solobuildtw.com` 較準確）

### 5.4 第三方銷售平台

| 平台 | 要改的地方 |
|------|-----------|
| Gumroad | 商品頁「聯絡 / 主網站」連結 |
| Ko-fi | 商品頁連結 |
| 麵包多 | 商品頁作者連結 |
| LemonSqueezy | 商品頁連結 |
| KDP | 作者頁個人網站 |
| BOOTH | 商品頁連結 |
| Stripe（如有設定）| success_url / cancel_url |

### 5.5 Podcast 平台（推送後需等 cache 更新）

每個頻道在以下平台的頁面連結：

| 平台 | cache 更新時間 |
|------|---------------|
| Apple Podcast | 24-72 hr |
| Spotify for Creators | 24-48 hr |
| KKBOX for Podcasters | 24-48 hr |
| SoundOn | 12-24 hr |
| Google Podcasts（如還存在）| 24 hr |

> feed.xml 改好 push 後，平台自動拉新 feed，不需手動操作，但封面和連結需等 cache 清。

### 5.6 社群 Bio（Harvey 自改，各 5-10 min）

| 平台 | 改的地方 |
|------|---------|
| FB 粉專（solobuildTW）| 關於 → 網站 |
| Threads | 個人資料連結 |
| X（Twitter）| 個人資料網站欄 |
| IG | 個人資料連結 |
| Discord 工作室 | 頻道描述 / 伺服器連結 |
| LinkedIn | 個人資料網站 |

### 5.7 Email 簽名

| 帳號 | 操作 |
|------|------|
| harvey3630@gmail.com | Gmail 設定 → 簽名 |
| solobuildtw@gmail.com | Gmail 設定 → 簽名 |
| N8N 寄信 WF（KOL outreach 模板）| WF 內 email body 替換 |
| N8N 寄信 WF（售後 / 客服模板）| 同上 |

#### Brevo / ESP 外部模板確認

已執行掃描：`grep -rn "brevo|sendinblue|mailerlite|convertkit" D:/N8N全自動工作流/API.txt D:/scripts/`

結果：
- **Brevo** 有在使用（`D:/N8N全自動工作流/KOL寄信/brevo_sender.py`），但用途是 KOL outreach 寄信腳本，**非 Landing Page / 感謝頁模板**
- `brevo_sender.py` 內的 email body 模板未發現 `solobuildtw.github.io` 引用（已確認）
- **MailerLite / ConvertKit / SendinBlue**：API.txt 與 scripts/ 均無引用

結論：**已確認無外部 ESP 模板存舊 URL（solobuildtw.github.io）**，此項無需額外手動操作。

### 5.8 廣告素材

| 位置 | 行動 |
|------|------|
| Google Ads 著陸頁 URL | 廣告設定 → 最終 URL |
| FB Ads 廣告連結 | 廣告管理員 → 編輯廣告 |
| 短連結 bit.ly / lihi.cc（如有）| 重新建立指向新域名 |

#### Google Ads UTM URL 完整變體（改廣告時逐個對照替換）

來源：`D:/N8N全自動工作流/GoogleAds外包_結果.md` L206

目前廣告最終到達網址（RSA Search 廣告）：
```
https://solobuildtw.github.io/?utm_source=google&utm_medium=cpc&utm_campaign={campaignid}&utm_term={keyword}
```

改成：
```
https://solobuildtw.com/?utm_source=google&utm_medium=cpc&utm_campaign={campaignid}&utm_term={keyword}
```

操作路徑：Google Ads → 廣告 → 編輯 RSA → 最終 URL 欄位

> 注意：`{campaignid}` / `{keyword}` 是 Google ValueTrack 參數，**保留不改**，只改域名部分。廣告網址欄（顯示域名）同步改為 `solobuildtw.com`。

### 5.9 文件與教學包內容

| 位置 | 行動 |
|------|------|
| 教學包 PDF / DOCX 內文連結 | Word 尋找取代後重新匯出 PDF |
| 靈魂包 / Soul Pack 文件 | 同上 |
| AI Agent 教學包文件 | 同上 |
| Pick-tw 站內引用 | `grep -r "solobuildtw.github.io" D:/pick-tw/Hugo專案/` |

> Pick-tw 路徑確認：`D:/pick-tw/Hugo專案`（API.txt 記錄）

---

## 6. SEO 影響與過渡

### 6.1 SEO 自動保護機制
- GitHub Pages custom domain 設好後：`solobuildtw.github.io` → `solobuildtw.com` 是**永久 301**
- Google 會在 2-4 週內完成鏈接汁轉移
- 預期保留 85-95% 既有排名

### 6.2 GSC 操作
1. 進 Google Search Console
2. 新增 property：`https://solobuildtw.com`
3. 驗證方式：HTML 檔（在 repo 根放 `google*.html`）或 DNS TXT record
4. 提交新 sitemap：`https://solobuildtw.com/sitemap.xml`（sitemap.xml 內 URL 需先改好）
5. 舊 property `solobuildtw.github.io` 保留 → 30 天後比對流量遷移

### 6.3 其他 SEO 資產
- `robots.txt` Sitemap 行：改為 `https://solobuildtw.com/sitemap.xml`
- `ai/solobuildtw-github-io/llms.txt`：Web 行改為 `https://solobuildtw.com/`
- `hreflang` 標籤：49 檔批次替換時一同處理

---

## 7. 執行 Phase 拆解

```
Phase 1：DNS + CNAME（30 min，含等待）
  ├── Harvey：登入域名商改 DNS（A record x4 + CNAME www）（5 min）
  ├── 代理：repo 根加 CNAME 檔，內容 "solobuildtw.com"（5 min）
  ├── 代理：GitHub repo Settings → Pages → Custom domain 填 solobuildtw.com（5 min）
  └── 等 DNS propagation（5-30 min）
  └── 驗收：https://solobuildtw.com/ 出現頁面（哪怕是舊版）

Phase 2：Repo 內 49 檔 URL 批次替換（30 min）
  ⚠️ 確認 Phase 1 已完成（CNAME 已 commit + push 到 main，且 GitHub Pages Settings 已成功 verify domain）才能跑 Phase 2 sed
  ├── 代理：sed 批次替換 solobuildtw.github.io → solobuildtw.com（5 min）
  ├── 代理：diff 審查確認無誤（5 min）
  ├── 代理：git commit + push（5 min）
  └── 驗收：
      - https://solobuildtw.com/ 出 Hub
      - https://solobuildtw.com/products/ 出教學包
      - https://solobuildtw.github.io/ → 301 → solobuildtw.com
      - view-source 確認 canonical 含 solobuildtw.com

Phase 3：對外連結批次改（2-4 hr）
  ├── 高優先：CF Worker Return URL + API.txt 付款行（Harvey + 代理）
  ├── 代理：Gumroad / Ko-fi / 麵包多 / LemonSqueezy / KDP / BOOTH 商品頁
  ├── 代理：N8N WF email 模板（KOL + 售後 + 客服）
  ├── Harvey 自改：社群 bio（FB / Threads / X / IG / Discord / LinkedIn）
  ├── Harvey 自改：Email 簽名（harvey3630 + solobuildtw）
  └── Harvey 自改：廣告素材（Google Ads / FB Ads）

Phase 4：A 企劃 API 接 api.solobuildtw.com（30 min）
  ├── Harvey：DNS 加 CNAME api → taiwan-data-api.harvey3630.workers.dev.
  └── CF Worker：設定 custom domain = api.solobuildtw.com
  └── 驗收：https://api.solobuildtw.com/ 返回 CF Worker 回應

Phase 5：SEO 過渡監控（30 天）
  ├── 即時：GSC 新增 solobuildtw.com property + 提交 sitemap
  ├── D+3：確認 Google 已開始收錄 .com URL
  ├── D+7：比對 .github.io vs .com 流量比例
  ├── D+14：確認排名無大幅下滑
  └── D+30：正式宣告遷移完成，清理 GSC 舊 property
```

---

## 8. 風險評估

| 風險 | 機率 | 影響 | 緩解方式 |
|------|------|------|---------|
| 付款 Return URL 未改 → 訂單成功頁白頁 | 中 | 極高 | Phase 3 最高優先；改完立刻測試 |
| DNS propagation 期間（1-30 min）.com 連不上 | 高 | 低 | 告知 Harvey，等待即可 |
| 批次替換誤改不該改的字串 | 低 | 中 | 替換前 diff 審查；git 可 revert |
| Apple Podcast / Spotify cache 24-72 hr | 確定 | 低 | 正常現象，不需行動 |
| GSC 排名暫時波動（2-4 週）| 中 | 中 | 301 自動保護，監控即可 |
| Pick-tw 文章內硬連結未改 | 中 | 低（301 接著）| 非緊急，Phase 3 後處理 |
| 教學包 PDF 內連結未改 | 低 | 低 | 需重新匯出 PDF，安排獨立任務 |
| N8N WF email 模板未改 → 客戶收到舊網址 | 中 | 中 | Phase 3 代理處理 |

---

## 9. 驗收標準

- [ ] `https://solobuildtw.com/` 出 Hub 首頁（4 區塊）
- [ ] `https://solobuildtw.com/products/` 出教學包
- [ ] `https://solobuildtw.com/podcast/` 出 Podcast 頁
- [ ] `https://solobuildtw.github.io/` → HTTP 301 → `solobuildtw.com`
- [ ] `https://api.solobuildtw.com/` → CF Worker 回應
- [ ] view-source 主頁：canonical 含 `solobuildtw.com`
- [ ] 5 頻道 feed.xml 內 itunes:image / channel link 含 `solobuildtw.com`
- [ ] 付款成功後 Return URL 正確跳轉到 `solobuildtw.com/thank-you`
- [ ] GSC 收到 `solobuildtw.com` 至少 1 個收錄
- [ ] 第三方平台連結全改（Gumroad / Ko-fi / 麵包多 / LS / KDP / BOOTH）
- [ ] API.txt 兩處引用更新完畢

---

## 10. 預估

| 項目 | 時間 |
|------|------|
| Phase 1（DNS + CNAME）| 30 min（含等待）|
| Phase 2（repo 49 檔批次改）| 30 min |
| Phase 3（對外連結）| Harvey 自改 1-2 hr + 代理 1 hr |
| Phase 4（api 子域）| 30 min |
| Phase 5（GSC 設定）| 15 min |
| **總計**（Harvey 親手動）| **1-2 hr** |
| **總計**（含代理跑）| **3-5 hr** |

- 風險等級：中（連結範圍廣，改錯機率與範圍成正比）
- 不可逆程度：低（DNS 改回去 30 min，git revert 立即）

---

## 11. 建議執行時機

**建議在 A 企劃 API 功能確認可上線前的同一個 sprint 執行**，這樣 DNS 改一次、CF Worker custom domain 設一次，兩件事一步到位，不用 DNS 開兩次。最晚不超過 5 月底，避免 Podcast feed 繼續積累舊 URL 的 Google cache。

---

## 12. 加分項備忘

### thank-you.html 自動生效
`thank-you.html` 已 hardcode `solobuildtw.com`（確認：repo 內 `thank-you.html` 內容直接引用 .com）。Phase 1 DNS 通後，付款感謝頁即自動在新域名下生效，**無需額外修改**。

> 唯一需改的是 CF Worker `index.js` L897 的 redirect URL（見 5.1 SOP），確保用戶被導到正確的感謝頁。

---

## 13. 漸進式 vs 一次到位

| 方式 | 步驟 | 風險 | 適合情境 |
|------|------|------|---------|
| **漸進式**（推薦）| Phase 1 DNS + CNAME → 觀察 1 天確認 DNS 穩定 → Phase 2 sed 替換 + 改外部連結 | 低：每步可驗收，問題早發現早止損 | 正式生產環境、付款鏈在線中 |
| **一次到位** | Phase 1-3 連續執行不間斷 | 中高：若中途出錯（DNS 未傳遞就跑 sed、付款未測試）問題疊加難排查 | 測試環境、非付款關鍵時段 |

**推薦：漸進式**

1. Phase 1（DNS + CNAME commit + push）→ 等 DNS propagation 驗收 `.com` 可連
2. 確認 `.com` 正常後，隔 1 天或當天確認穩定
3. 再跑 Phase 2（sed 批次替換 + commit）
4. Phase 3 付款系統改完立即跑 NT$1 測試才繼續其他平台

一次到位風險高的根因：DNS propagation 不確定（5-30 min），若還沒傳遞就 sed 替換並 push，`canonical` 已寫 `.com` 但用戶仍訪問 `.github.io`，可能造成短暫 SEO 訊號混亂。
