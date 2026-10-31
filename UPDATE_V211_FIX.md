# Update — UI ပြင်ဆင်ချက် ၃ ခု (OTA only, build အသစ် မလိုဘူး)

ဒီ update က **JS ပဲ** ပြင်ထားတာ — native ဘာမှ မထိဘူး။ Build အသစ် မလုပ်ရဘူး၊
OTA ပို့ရုံပဲ။

## ပြောင်းသွားတာတွေ

1. **Home page category/tag chips bug ပြင်ပြီး** — chip တွေ အမြင့်ကြီး ဆန့်ထွက်ပြီး
   ဘဲဥပုံကြီးတွေ ဖြစ်နေတာ (screenshot ထဲကလို) ကို fixed height နဲ့ ပိတ်ထားပြီ၊
   ဘယ်တော့မှ မဆန့်တော့ဘူး
2. **New/Edit Task ခေါင်းစဉ်ရဲ့ ညာဘက်မှာ ✕ cancel icon** ထည့်ထားပြီ
   (အောက်ဆုံးထိ scroll ဆွဲစရာ မလိုတော့ဘူး)
3. **Notification time ကို Settings ကနေ ဖယ်ပြီး task တစ်ခုချင်းထဲ ပြောင်းထည့်ထားပြီ** —
   "Remind me" ဖွင့်ရင် အဲဒီ task အတွက် အချိန် (6/7/8/9 AM, 12/6/8 PM) ကို
   အဲဒီနေရာမှာပဲ ရွေးလို့ရတယ်၊ မပြောင်းချင်ရင် default 9:00 AM အတိုင်းပဲ။
   Task တစ်ခုနဲ့ တစ်ခု အချိန် မတူလည်း ရတယ်

## လုပ်ရမှာတွေ

1. ဒီ zip ထဲက `src/` folder ကို PC က project (`todo-app-final`) ထဲ
   copy ကူးပြီး overwrite လုပ်ပါ (ဖိုင် ၉ ခု ပဲ ပါပါတယ် — app.json ကို မထိပါနဲ့)
2. Project folder ထဲမှာ OTA ပို့ပါ:

```
eas update --branch preview --message "UI fixes: filter chips, editor cancel icon, per-task reminder time"
```

3. ဖုန်းမှာ app ကို ပိတ်ပြီး ပြန်ဖွင့်ပါ (update က နောက်တစ်ကြိမ် ဖွင့်ချိန်မှာ
   auto ဝင်လာမယ်) — ပြီးရင် စစ်ပါ:
   - Home မှာ category chips တွေ ပုံမှန် အရွယ်ပဲ လား
   - New Task ဖွင့်ရင် ညာဘက်အပေါ်မှာ ✕ ရှိလား၊ နှိပ်ရင် ပြန်ထွက်လား
   - Task တစ်ခုမှာ Remind me ဖွင့်ရင် "Reminder time" chips တွေ ပေါ်လား၊
     အချိန်ပြောင်းပြီး save ရင် အဲဒီ အချိန်မှာ notification လာလား
   - Settings → Notifications မှာ global time chips မရှိတော့တာ မှန်လား

⚠️ app.json version ကို **2.1.0 အတိုင်းပဲ** ထားပါ — version တက်ရင် OTA က
ဖုန်းထဲက build နဲ့ မကိုက်တော့ဘူး။
