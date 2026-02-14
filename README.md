# ⚡️ Muscle-Factory (筋トレ記録管理アプリ)
> 「前回を超える」を、もっと直感的に。

* **App URL**: [https://muscle-factory-ftbe.vercel.app/](https://muscle-factory-ftbe.vercel.app/)

<div align="center">
  <table style="border: none;">
    <tr>
      <td align="center" valign="top" style="border: none;">
        <strong>💻 PC Layout</strong><br />
        <img width="100%" alt="pc img" src="https://github.com/user-attachments/assets/4da8e828-0118-448a-924d-1584e890acfb" />
      </td>
      <td align="center" valign="top" style="border: none;">
        <strong>📱 Mobile Layout</strong><br />
        <img width="250" alt="mobile img" src="https://github.com/user-attachments/assets/fc8dfd3c-3dea-47e0-9527-b977eab6d981" />
      </td>
    </tr>
  </table>
</div>

## 🚀 制作背景
「前回の自分に勝つ」ために必要な記録の手間を極限まで減らしたい、という想いから開発しました。
毎回同じ順番でトレーニングを行う実体験に基づき、記録のたびに種目名を入力する負荷を排除し、**「前回のメニューをそのまま引き継ぐ」**ことに特化したUI/UXを実現しています。

## ✨ 特徴（他のアプリとの比較）
一般的なアプリは「種目を選んで記録」しますが、Muscle Factoryは**「前回の動きをトレース」**する体験を重視しています。

<div align="center">
  <table>
    <tr>
      <td width="300" align="center">
        <img src="https://github.com/user-attachments/assets/40c0d175-1e37-482e-b636-a6b7dd455e55" width="100%">
      </td>
      <td valign="top" align="left">
        <h3>1. ルーティンの構築</h3>
        <p>「胸の日」などのルーティンを決め、種目順（ベンチプレス→ダンベルフライ等）を登録します。</p>
        <p><i>(例) 1種目目：ベンチプレス、2種目目：ダンベルフライ</i></p>
      </td>
    </tr>
    <tr>
      <td width="300" align="center">
        <img src="https://github.com/user-attachments/assets/6ea9cb5c-59b8-489d-89c9-5ecc9afdcde8" width="100%">
      </td>
      <td valign="top" align="left">
        <h3>2. 前回値の自動継承</h3>
        <p>次回同じトレーニングを行う際、前回の種目名と順序を自動で引き継ぎます。ジムでの「次は何だっけ？」という迷いをゼロにします。</p>
      </td>
    </tr>
  </table>
</div>

## 🛠 技術的なこだわり：スナップショットによる不変性
マスターデータの変更が過去の履歴に波及してしまう課題に対し、PrismaのNested Writeを活用して「当時の名称」をスナップショット（非正規化）として保存するロジックを構築しました。これにより、ユーザーがルーティンを編集・削除しても、過去の努力の跡が正確に残り続ける堅牢なログシステムを実現しています。

## 📦 使用技術
* **Frontend**: Next.js (App Router), React, TypeScript, TailwindCSS
* **Backend**: Next.js (Route Handlers), Prisma
* **Database/Auth**: Supabase (PostgreSQL), Supabase Auth
* **Deployment**: Vercel

## 📐 システム設計
### ER図
<img width="100%" src="https://github.com/user-attachments/assets/c2fdabe0-ed03-46c7-bbbb-5b29b40c4fbe" />

### インフラ構成図
<img width="100%" src="https://github.com/user-attachments/assets/061d6427-47e5-4f47-ad72-0750f613d471" />
