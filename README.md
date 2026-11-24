# 英単語テストアプリ（tango-test）

英検準2級レベルの英単語・熟語を、**4択とタイピング入力の2モード**で演習するアプリ。単語ごとの正誤を記録し、ダッシュボードで「どの単語が苦手か」を可視化する。

**React 19 / Vite / papaparse / lucide-react**

---

## 作ったもの

自分の英単語学習のために作った。市販アプリでは「自分の持っている単語リストで、章ごとに」演習できなかったため、CSV を差し替えれば中身を入れ替えられる形にした。

- 章を選んで出題（`chapter1`〜`chapter14`）
- **4択モード** — 選択肢から意味を選ぶ。素早く回せる
- **入力モード** — 英単語を打って答える。綴りまで覚えているか試せる
- ダッシュボードで章ごとの成績と、間違えた単語の一覧を確認できる

## 技術的な判断

### 問題データを CSV で外部化する

単語をコードに書かず、`public/` 配下の CSV に置いている。ヘッダは `Chapter,English,Japanese` の3列だけ。

```
Chapter,English,Japanese
1,abandon,見捨てる
1,absolute,絶対的な
```

`src/utils/csvParser.js` が papaparse（`header: true, skipEmptyLines: true`）で読み、`row['Chapter']` の値ごとに章単位のオブジェクトへグルーピングする。

単語を追加・修正したいときは CSV を編集するだけで済み、コード変更が不要。学習しながら育てていくデータなので、更新コストの低さを優先した。

### 状態を1か所に集約する

画面遷移は `App.jsx` の `view` ステート1つで制御している。

```js
view: 'loading' | 'registration' | 'home' | 'dashboard' | 'quiz'
activeQuiz: { chapter, mode: '4choice' | 'input' }
```

ルーティングライブラリを入れず、画面数が5つに収まる規模なら単一のステートマシンのほうが追いやすいと判断した。出題中の情報は `activeQuiz` にまとめ、「どの章・どのモードか」を1つのオブジェクトで表している。

### データ取得と進捗をカスタムフックに分ける

- **`useQuizData`** — CSV の読み込みとパース
- **`useUserProgress`** — 成績の保存と読み出し

クイズ終了時は `handleQuizComplete(results, wordResults)` から `saveProgress(chapter, mode, results, wordResults)` を呼ぶ。正答数だけでなく**単語ごとの正誤（`wordResults`）**も渡しているため、ダッシュボードで「間違えた単語」を個別に並べられる。

## 構成

```
public/
├── chapter1.csv 〜 chapter14.csv   # 章ごとの単語
└── data.csv                       # 全体
src/
├── components/
│   ├── Registration.jsx   # 初回のユーザー登録
│   ├── Home.jsx           # 章とモードの選択
│   ├── Quiz4Choice.jsx    # 4択出題
│   ├── QuizInput.jsx      # 入力出題
│   └── Dashboard.jsx      # 成績と苦手単語
├── hooks/
│   ├── useQuizData.js     # CSV の読み込み
│   └── useUserProgress.js # 進捗の保存
└── utils/csvParser.js     # papaparse によるパース
```

## セットアップ

```bash
npm install
npm run dev
```

## 制約

- 進捗はブラウザのローカルに保存され、端末間で同期しない
- 出題順の最適化（間違えた単語を優先的に出すなど）は未実装で、記録と可視化までが範囲
- 単語データは自分の学習範囲に合わせたもので、辞書的な網羅性はない
