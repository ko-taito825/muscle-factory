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
        <h3>1. 行うトレーニングの名前を決める</h3>
        <p>「胸の日」などの行うトレーニングの題名を決め、種目名を（ベンチプレス、ダンベルフライ等）を登録し、重量と回数を記録していきます。</p>
        <p>(例) 1種目目：ベンチプレス、2種目目：ダンベルフライ</p>
      </td>
    </tr>
    <tr>
      <td width="300" align="center">
        <img src="https://github.com/user-attachments/assets/6ea9cb5c-59b8-489d-89c9-5ecc9afdcde8" width="100%">
      </td>
      <td valign="top" align="left">
        <h3>2. 前回の種目名を自動継承</h3>
        <p>次回同じトレーニングを行う際、前回の種目名と順序を自動で引き継ぎます。ジムでの「次は何だっけ？」という迷いをゼロにします。</p>
        <p>(例) 1種目目：ベンチプレス、2種目目：ダンベルフライという順番になっており、重量と回数だけを記録していく</p>
        <p>（種目名は最初から入っていますが、変更可能です）</p>
      </td>
    </tr>
  </table>
</div>

<hr />

<h2>⚡️ 技術的なこだわり：スナップショットによるデータの不変性</h2>

<h3>【背景：カレンダーに刻まれる「努力の足跡」を守るために】</h3>
<p>
  Muscle Factoryでは、トレーニングを完了するとその記録が自動的に<strong>カレンダーに反映</strong>されます。
  ユーザーにとってカレンダーは、数ヶ月、数年前からの「努力の積み重ね」を振り返る大切な場所です。
</p>

<blockquote>
  <strong>リレーション設計における致命的な課題：</strong><br />
  もし単にルーティンID（外部キー）のみでカレンダーと紐付けていた場合、<strong>「昔使っていたメニューを整理（削除）」した瞬間に、カレンダーに刻まれていた過去の全ての記録が消えてしまう</strong>という問題がありました。<br />
  例えば、「5分割」から「PPL分割」にメニューを刷新した際、古い「5分割」メニューを削除すると、カレンダーからもその実績が消えてしまうことになります。
</blockquote>

<h3>【解決策：実行時の状態を「凍結」してカレンダーへ保存】</h3>
<p>
  どれだけメニューを入れ替えても、カレンダー上の記録は「当時のまま」残り続けるよう、<strong>スナップショット（非正規化）</strong>を採用しました。
</p>

<ul>
  <li>
    <strong>カレンダー表示の安定性：</strong> 
    ログ記録時に「その時のメニュー名（例：胸の日）」を文字列として直接保存します。これにより、元のメニュー自体を削除しても、カレンダーには<strong>「2024年3月10日：胸の日」</strong>という記録が永遠に保護されます。
  </li>
  <li>
    <strong>データの不変性（Immutability）：</strong> 
    PrismaのNested Writeを活用し、データの整合性を保ちつつ、過去のログがマスターデータの変更に左右されない堅牢な設計を実現しました。
  </li>
</ul>

<p align="right">
  カレンダーはユーザーの歴史そのものです。<b>「正規化による正しさ」以上に、「ユーザーの資産を守る設計」</b>を最優先しました。
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
