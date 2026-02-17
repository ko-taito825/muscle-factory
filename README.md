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
  <h2>⚡️ 技術的なこだわり：データ不変性と整合性の両立</h2>
  <img width="1497" height="816" alt="スクリーンショット 2026-02-16 20 03 39" src="https://github.com/user-attachments/assets/9a85f4b8-6e98-4833-89ab-09a053dd99b7" />
<p>上記の画像は、トレーニングのメニュー名（Routine名）を消してもカレンダーには消したトレーニングメニュー（Routine名）を表示</p>

  <h3>【課題】「過去の努力」を消さないDB設計</h3>
  <p>
    筋トレのメニュー（Routine）は、成長に合わせて頻繁にアップデートや削除が行われます。しかし、一般的な正規化設計（外部キーのみの管理）では、トレーニングメニュー（Routine名）を消した瞬間に過去のカレンダー記録がなくなってしまいました。
  </p>
  <ul>
    <li>
      <strong>スナップショット戦略：</strong> 
      <code>WorkoutLog</code> モデルに <code>title</code> カラムを用意し、記録時のトレーニングのメニュー名（Routine名）を直接保存。これにより、マスターデータである <code>Routine</code> が削除されても、当時の名称がカレンダーに残り続ける「不変性」を確保しました。
    </li>
    <li>
      <strong>概念の同一性：</strong> 
      <code>Routine</code> モデルに <code>@@unique([userId, title])</code> を設定。ユーザーごとにトレーニングのメニュー名（Routine名）の重複を許さないことで、スナップショットされた名称が、過去から現在まで地続きの「一つの努力」として機能するように設計しています。
    </li>
  </ul>

  

  <h3>【解決策】リレーションの柔軟性と自動クリーンアップ</h3>
  <p>
    <code>schema.prisma</code> において、データの保護と管理の効率化を両立させるためのリレーション設計を行いました。
  </p>
<pre><code>// WorkoutLog: 親のRoutineが消えてもログ自体は残す（routineIdはnullになる）
model WorkoutLog {
  title     String   // ← 保存時のRoutine名を保持
  routineId Int?     // ← Optionalにすることで、親の削除を許容
  routine   Routine? @relation(fields: [routineId], references: [id])
}

// Training & Set: ログ削除時は関連データを一括削除（整合性維持）
model Training {
  workoutLogId Int
  workoutLog   WorkoutLog @relation(fields: [workoutLogId], references: [id], onDelete: Cascade)
}</code></pre>

  <ul>
    <li>
      <strong>疎結合な履歴管理：</strong> 
      <code>routineId</code> を <code>Int?</code>（オプショナル）に設定。トレーニングのメニュー名（Routine名）が削除された後は、外部キーのみを解放し、ログを「独立した過去の記録」として成立させる柔軟な構造を採用しました。
    </li>
    <li>
      <strong>カスケード削除による自動整理：</strong> 
      一方で、<code>WorkoutLog</code> → <code>Training</code> → <code>Set</code> の階層には <code>onDelete: Cascade</code> を設定。ログ本体を削除した際には、紐付くトレーニング内容やセット数も自動でクリーンアップされるようにし、DB内に「迷子データ」が残らないよう整合性を徹底しました。
    </li>
  </ul>

  <h3>設計の深化：スクールのメンターさんの提案からAIとの壁打ちへ</h3>
  <p>
    この設計に至るまで、単に実装するのではなく、多角的な視点から「妥当性」を検証しました。
  </p>
  <ul>
    <li>
      <strong>スクールのメンターさんのアドバイスとAIによる検証：</strong> 
当初、データの整合性をどう保つか悩んでいた際、スクールのTAさんから<strong>「名称をスナップショットとして保持する」</strong>というアプローチを提案していただきました。
      この案を形にするため、AIをシニアエンジニアに見立てて徹底的に壁打ち。「正規化を崩すことによるデータ重複のリスク」を把握した上で、今回は<strong>「UX（ユーザー体験の不変性）が何よりも優先されるべきだ」</strong>と確信し、実装に踏み切りました。
    </li>
    <li>
      <strong>カスケード設定の型安全な実装：</strong> 
      複雑になりがちな3階層（Log-Training-Set）のリレーションにおいて、<code>onDelete: Cascade</code> をどのモデルに定義すべきかをAIと確認。開発初期にこの整合性を固めることで、後の実装でのバグを未然に防ぎました。
    </li>
  </ul>

  <blockquote>
    <strong>Design Philosophy</strong><br>
    技術的な「正解（正規化）」に固執せず、<strong>「ユーザーが一生使い続けられるデータの堅牢性」</strong>を優先しました。人からのアドバイスを起点に、AIを駆使してメリット・デメリットを天秤にかけることで、納得感のある意思決定ができたと思っています！
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
<img width="1285" height="467" alt="スクリーンショット 2026-02-17 12 06 39" src="https://github.com/user-attachments/assets/a46193a7-25d7-40d2-b4ce-d00a8824b82e" />
