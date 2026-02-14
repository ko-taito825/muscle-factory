# ⚡️ Muscle-Factory (筋トレ記録管理アプリ)
> 私は筋トレが大好きです👊トレーニング歴はかれこれ4年目になります。

* **App URL**: [https://muscle-factory-ftbe.vercel.app/](https://muscle-factory-ftbe.vercel.app/)

<div align="center">
  <table style="border: none; width: 100%;">
    <tr>
      <td align="center" valign="middle" style="border: none; width: 60%;">
        <strong>💻 PC Layout</strong><br />
        <img width="85%" alt="pc img" src="https://github.com/user-attachments/assets/4da8e828-0118-448a-924d-1584e890acfb" />
      </td>
      <td align="center" valign="middle" style="border: none; width: 40%;">
        <strong>📱 Mobile Layout</strong><br />
        <img width="95%" alt="mobile img" src="https://github.com/user-attachments/assets/fc8dfd3c-3dea-47e0-9527-b977eab6d981" />
      </td>
    </tr>
  </table>
</div>

## ⚡️ 制作背景
「前回の自分に勝つ」ために必要な記録の手間を極限まで減らしたい、という想いから開発しました。
毎回同じ順番でトレーニングを行う実体験に基づき、記録のたびに種目名を入力する負荷を排除し、**「前回のメニューをそのまま引き継ぐ」**ことに特化したUXを実現しています。

## ⚡️ 特徴（他のアプリとの比較）
一般的なアプリは「種目を選んで記録、種目を毎回記入して記録」しますが、Muscle Factoryは**「前回の動きをトレース」**する体験を重視しています。

<div align="center">
  <table>
    <tr>
      <td width="300" align="center">
        <img src="https://github.com/user-attachments/assets/40c0d175-1e37-482e-b636-a6b7dd455e55" width="100%">
      </td>
      <td valign="top" align="left">
        <h3>1. 行うトレーニングのメニュー名を決める</h3>
        <p>「胸の日」などの行うトレーニングのメニュー名を決め、種目名を（ベンチプレス、ダンベルフライ等）を登録し、重量と回数を記録していきます。</p>
        <p>(例) 1種目目：ベンチプレス、2種目目：ダンベルフライ</p>
      </td>
    </tr>
    <tr>
      <td width="300" align="center">
        <img src="https://github.com/user-attachments/assets/6ea9cb5c-59b8-489d-89c9-5ecc9afdcde8" width="100%">
      </td>
      <td valign="top" align="left">
        <h3>2. 前回の種目名を自動継承</h3>
        <p>次回同じトレーニングメニューを行う際、前回の種目名と順序を自動で引き継ぎます。ジムでの「次は何だっけ？」という迷いをゼロにします。</p>
        <p>(例) 1種目目：ベンチプレス、2種目目：ダンベルフライという順番になっており、重量と回数だけを記録していく</p>
        <p>（種目名は最初から入っていますが、変更可能です）</p>
      </td>
    </tr>
  </table>
</div>

<hr />

<h2>⚡️ 技術的なこだわり：不変性を担保するスナップショット設計</h2>

<h3>【リレーション設計における課題：過去の「努力」が消えるリスク】</h3>
<p>
  当初の設計では、カレンダーに表示するトレーニング記録（WorkoutLog）をルーティンID（外部キー）のみで管理していました。しかし、この「純粋なリレーション」には実運用上の致命的な課題がありました。
</p>

<ul>
  <li>
    <strong>履歴の消失リスク：</strong> 
    例えば「5分割」から「PPL分割」へメニューを変えた際、古いルーティンを削除すると、そのIDに紐付いていた過去のカレンダー実績まで名称不明（あるいはデータ消失）になってしまいます。
  </li>
  <li>
    <strong>ユーザー体験の損耗：</strong> 
    ユーザーにとってカレンダーは「過去の自分に勝つための足跡」です。 メニュー整理という日常的な操作で、数ヶ月前の努力の記録が壊れてしまうことは許容できませんでした。
  </li>
</ul>

<h3>【解決策：`schema.prisma` に反映した「ハイブリッド設計」】</h3>
<p>
  この課題を解決するため、<code>WorkoutLog</code> モデルにルーティン名の<strong>スナップショット（String型の保存）</strong>を導入しました。
</p>

<pre><code>// WorkoutLogモデルの抜粋
model WorkoutLog {
  id        Int      @id @default(autoincrement())
  title     String   // ← 保存時のルーティン名をスナップショットとして保持
  routineId Int?     // ← 外部キーはオプショナルにし、親の削除を許容
  // ...
}</code></pre>

<ul>
  <li>
    <strong>データの不変性：</strong> 
    記録保存時にその瞬間の名称を <code>title</code> カラムに直接書き込みます。これにより、たとえ <code>Routine</code> マスターが削除されても、カレンダー上には「当時の名称」が残り続けます。
  </li>
  <li>
    <strong>オプショナルなリレーション：</strong> 
    <code>routineId</code> を <code>Int?</code> とすることで、親データが存在する間は高度なデータ連携を可能にしつつ、削除後は「独立したログ」として成立させる柔軟なデータ構造を実現しました。
  </li>
</ul>

<p align="right">
「DBの正規化」という教科書的な正解よりも、<b>「ユーザーが一生使い続けられるデータの堅牢性」</b>を優先した意思決定です。
</p>

<hr />

## ⚡️ 使用技術
* **Frontend**: Next.js (App Router), React, TypeScript, TailwindCSS
* **Backend**: Next.js (Route Handlers), Prisma
* **Database/Auth**: Supabase (PostgreSQL), Supabase Auth
* **Deployment**: Vercel

## ⚡️ システム設計
### ER図
<img width="100%" src="https://github.com/user-attachments/assets/c2fdabe0-ed03-46c7-bbbb-5b29b40c4fbe" />

### インフラ構成図
<img width="100%" src="https://github.com/user-attachments/assets/061d6427-47e5-4f47-ad72-0750f613d471" />
