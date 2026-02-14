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
一般的なアプリは、トレーニング中に種目を選んで記録、種目を毎回記入して記録します。トレーニングのメニューはルーティン化しているのに、アプリのUIは毎回「初めまして」の状態から始まるのがほとんどです。「今日はどれやるの？」とアプリに聞かれるのではなく、「今日もこれだよね！」と察してくれるアプリにしました。
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

<section id="technical-focus">
  <h2>⚡️ 技術的なこだわり：不変性を担保するスナップショット設計</h2>

  <h3>【課題】リレーションの「正しさ」が、ユーザーの「努力」を消してしまう</h3>
  <p>
    開発当初、DB設計は教科書通りの「完全な正規化」を目指していました。しかし、実際にアプリを使い込み、私を含めたユーザー心理を深掘りした結果、以下の致命的な課題に気づきました。
  </p>
  <ul>
    <li>
      <strong>「メニューの改善」が「過去の破壊」になる：</strong>
      筋トレのメニュー（ルーティン）は、成長に合わせて頻繁にアップデートされます。しかし、古いメニューを削除・変更した瞬間、外部キーで紐付いていた過去数ヶ月分のカレンダー記録がデータごと消失してしまいました。
    </li>
    <li>
      <strong>「足跡」としてのデータ価値：</strong>
      ユーザーにとってログは、単なる数値ではなく「積み上げた自信」そのものです。アプリのデータ整合性のために、ユーザーの過去の努力（ログ）が損なわれることは、体験として許容できないと判断しました。
    </li>
  </ul>

  <h3>【解決策】不変性を確保する「ハイブリッド・スナップショット設計」</h3>
  <p>
    リレーションの利便性を活かしつつ、過去のログを守るために、<code>WorkoutLog</code> モデルに名称の<strong>スナップショット（保存時の静的データ）</strong>を保持する設計を採用しました。
  </p>

  

<pre><code>// schema.prisma の抜粋
model WorkoutLog {
  id        Int      @id @default(autoincrement())
  title     String   // ✅ 保存時の名称を直接書き込み（スナップショット）
  routineId Int?     // ✅ 外部キーをオプショナルにし、親が消えてもログを残す
  createdAt DateTime @default(now())
  // ...
}</code></pre>

  <ul>
    <li>
      <strong>データの不変性 ：</strong>
      記録時にその瞬間のルーティン名を <code>title</code> カラムに直接書き込むことで、マスターデータが削除・変更されても「当時の名称」が残り続けるようにしました。
    </li>
    <li>
      <strong>柔軟なデータ連携：</strong>
      <code>routineId</code>はオプショナルにし、マスターデータがある間は「このメニューの重量、伸びてるな」といった分析が可能になり、もしメニューを整理し消してしまっても、記録自体は道連れにせずしっかり残す。「分析のしやすさ」と「データの頑丈さ」を柔軟に扱える仕様にしました。
  </ul>

  <h3>【AIの活用】シニアエンジニアとしてのコードレビューと検証</h3>
  <p>
    この設計に至るプロセスでは、AIを「壁打ち相手」および「シニアエンジニア」として活用し、設計のブラッシュアップを行いました。
  </p>
  <ul>
    <li>
      <strong>設計の多角的なレビュー：</strong>
      「DBの正規化を崩してスナップショットを持たせる設計のデメリット」をAIに問い、データ重複のリスクや同期の難しさを事前に把握。その上で、今回は「ユーザー体験の不変性」が最優先であるという結論に至りました。
    </li>
    <li>
      <strong>Prismaスキーマの最適化：</strong>
      「親レコード削除時に <code>routineId</code> だけを <code>null</code> にする設定（<code>onDelete: SetNull</code>）」などの具体的な実装方法をAIと共に検証し、型安全な実装を迅速に行いました。
    </li>
    <li>
      <strong>エッジケースの想定：</strong>
      「削除済みメニューをUI上でどう表現すべきか」を相談し、(旧)名称として表示するロジックなど、フロントエンド（React）での出し分け処理にもAIの提案を活かしています。
    </li>
  </ul>

  <blockquote>
    <strong>Design Philosophy</strong><br>
    技術的な「正解（正規化）」に固執せず、<strong>「ユーザーが一生使い続けられるデータの堅牢性」</strong>を優先しました。AIとの対話を通じてメリット・デメリットを天秤にかけ、納得感のある意思決定ができたと思っています！
  </blockquote>
</section>

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
