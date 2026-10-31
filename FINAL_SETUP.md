# Todo List FINAL (v2.1.0) — အစကပြန်ချိတ် / Build လုပ်နည်း

ဒါက **final project တစ်ခုလုံး** ပါ။ အပိုင်းအပိုင်း ပို့တဲ့ patch ဖိုင်တွေ မဟုတ်တော့ဘူး —
ဒီ folder တစ်ခုတည်းနဲ့ပဲ အလုပ်လုပ်ရမယ်။ အရင် project folder အဟောင်းကို မသုံးပါနဲ့တော့။

## ဒီ version မှာ ပါတာ အကုန် (Play Store က နာမည်ကြီး todo app တွေလို feature အစုံ)

- Task ထည့် / ပြင် / ဖျက် / **Duplicate (ပွားယူ)**၊ ပြီးအောင်လုပ် အမှတ်ခြစ်
- Priority (Low/Medium/High)
- **Lists** — အဆင့်သင့် list (General/Work/Personal/Shopping/Health) အပြင် **ကိုယ်ပိုင် list အသစ် ဖန်တီး/ဖျက်** လို့ရ (Settings → Lists)
- **Tags** (#tag တွေ ထည့်၊ tag နဲ့ စစ်ထုတ်)
- **Deadline** + calendar၊ **Notification သတိပေး — အချိန်ကို Settings မှာ ရွေးလို့ရ** (6/7/8/9 AM၊ 12/6/8 PM)၊ task အလိုက် **due date နေ့** သို့ **တစ်ရက်အလို** ကြိုသတိပေးရွေး လို့ရ၊ အချိန်ပြောင်းရင် ရှိပြီးသား reminder အကုန် အလိုအလျောက် ပြန်စီပေးတယ်
- **Smart lists** — ☀️ Today / 📅 Upcoming / ⚠️ Overdue တစ်ချက်နှိပ် ကြည့်
- **Home-screen Widget** ("Today's Tasks")
- Notes၊ Subtasks၊ Pin 📌 ထိပ်တင်၊ **Repeat** (နေ့တိုင်း/အပတ်တိုင်း/လတိုင်း — ပြီးသွားရင် နောက် တစ်ခု အလိုအလျောက် ပေါ်)
- Search၊ List filter၊ Tag filter၊ Sort (အသစ်/deadline/priority/A–Z)
- Tasks tab မှာ ကျန်တဲ့ task အရေအတွက် **badge**
- **Settings စာမျက်နှာ** — Dark mode 🌙၊ default priority/sort/remind၊ reminder time၊ list manager၊ test notification၊ backup export **နဲ့ import (ပြန်သွင်း)**၊ task အကုန်ဖျက်၊ update စစ်
- Statistics စာမျက်နှာ — progress၊ overdue/due today၊ ဒီအပတ် ပြီးတဲ့အရေအတွက်၊ **day streak 🔥**၊ category အလိုက် အရေအတွက်၊ **Focus timer 🎯** (15/25/50 မိနစ်၊ ပြီးရင် notification လာ)
- မပါတာ တစ်ခုပဲ: cloud sync / account — server လိုအပ်လို့ (ရှင် မသုံးဘူးလို့ ပြောထားတာလည်း ပါတယ်)၊ ကျန်တာ အားလုံး offline အလုပ်လုပ်တယ်

---

## ⚠️ အရေးကြီး — Account အသစ် သုံးရင် ဘာဖြစ်မလဲ အရင်ဖတ်ပါ

Expo account အသစ်နဲ့ link လုပ်ရင် EAS က **signing key အသစ်** ထုတ်ပေးတယ်။
အဲဒီအခါ ဖုန်းထဲက အရင် Todo app အပေါ် **အစားထိုး install လုပ်လို့ မရဘူး**
(Android က လက်မှတ်မတူလို့ reject လုပ်မယ်) —

- အရင် app ကို **အရင် uninstall** လုပ်ရမယ်၊ uninstall လုပ်ရင် အရင် app ထဲက **task ဟောင်းတွေ ပျက်မယ်**
- Task ဟောင်းတွေ အရေးကြီးရင် မဖျက်ခင် စာနဲ့ မှတ်ထားပြီး app အသစ်မှာ ပြန်ရိုက်ထည့်ပါ
- **သို့မဟုတ်** account အဟောင်း (kohtet404) နဲ့ပဲ ဆက်ချိတ်ရင် အပေါ်က install ထပ်တင်လို့ရပြီး task ဟောင်းတွေ ဆက်ရှိနေမယ် — အောက်က step တွေ အတူတူပဲ၊ Step 2 မှာ account အသစ် ဖွင့်မယ့်အစား အဟောင်းနဲ့ login ဝင်ရုံပဲ

ကြိုက်ရာ ရွေးပါ၊ ဒါပေမဲ့ ရွေးပြီးမှ build စပါ။

---

## Step များ

### 1) Folder အသစ်ထဲ ဝင်ပြီး dependencies သွင်းပါ

```
cd todo-app-final
npm install
```

(eas-cli မရှိသေးရင် တစ်ခါပဲ: `npm install -g eas-cli`)

### 2) Expo login

Account အသစ်သုံးမယ်ဆိုရင် ပထမ https://expo.dev မှာ sign up လုပ်ပါ (email verification လိုတယ်)၊ ပြီးမှ:

```
eas login
```

### 3) Project အသစ် link ချိတ်ပါ (ဒီ folder ကို account နဲ့ တွဲတာ)

```
eas init
```

- "create a new project?" လို့ မေးရင် **yes**၊ နာမည်မေးရင် ဒီအတိုင်း enter နှိပ်ပါ
- ပြီးရင် `app.json` ထဲမှာ projectId အသစ် **အလိုအလျောက် ရေးပေးလိမ့်မယ်** — လက်နဲ့ မပြင်ပါနဲ့

### 4) OTA update ဖွင့်ပါ

```
eas update:configure
```

ပြီးရင် app.json ထဲမှာ `updates.url` နဲ့ `extra.eas.projectId` နှစ်ခု တူညီနေတာ တွေ့ရမယ်။

### 5) ဖုန်းမှာ အရင် app ရှိရင် (account အသစ်သုံးမှသာ)

အရင် Todo List app ကို uninstall လုပ်ပါ (⚠️ အပေါ်က သတိပေးချက် ဖတ်ပြီးမှ)။

### 6) Build လုပ်ပါ

```
eas build -p android --profile preview
```

- build ပြီးရင် link/QR ပေးမယ် — ဖုန်းနဲ့ ဖတ်ပြီး install လုပ်ပါ
- "install and run on emulator?" လို့ မေးလာရင် **No** လို့ ဖြေပါ (သင့် PC မှာ emulator မရှိဘူး)

### 7) Install ပြီးရင် စစ်ပါ

1. Task အသစ်ထည့် → deadline = Today၊ "Remind me" ဖွင့် → သတိပေးတာ လာလား
2. Settings → "Send test notification" → ၅ စက္ကန့်အတွင်း notification ပေါ်လား
3. Settings → Theme Dark ပြောင်း → app တစ်ခုလုံး မှောင်သွားလား
4. Home screen လွတ်တဲ့နေရာ long-press → Widgets → Todo List → "Today's Tasks" ထည့်

### 8) နောက်ပိုင်း ပြင်ချင်ရင် (JS/UI ပဲ ပြင်တာဆိုရင်)

build အသစ် မလိုဘူး — OTA ပို့ရုံပဲ:

```
eas update --branch preview --message "what changed"
```

---

## Build မှာ error တက်ရင်

- ဘယ် phase မှာ တက်တာလဲ အရင် ကြည့်ပါ (Prebuild လား၊ Run gradlew လား)
- Run gradlew ဆိုရင် website log ထဲက `FAILURE:` နဲ့ `Execution failed for task ...`
  ပါတဲ့ အပိုင်းကို **စာသားနဲ့ copy ကူးပြီး** Muse ကို ပို့ပေးပါ — terminal ပုံ (summary)
  မဟုတ်ဘူး၊ log အစစ်ပါ
- သတိ: ဒီ version မှာ widget library ကို SDK 51 ခေတ်ထွက် version (0.14.1) သို့
  ပြောင်းထားပြီးသား — အရင် gradle error ရဲ့ အဓိက သံသယကို လျှော့ထားတယ်
