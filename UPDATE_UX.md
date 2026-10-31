# Update — UI/UX ပြန်ပြင်ဆင်မှု + feature အသစ် ၃ ခု (OTA only)

ဒီ update ကလည်း **JS ပဲ** — build အသစ် မလိုဘူး၊ OTA ပို့ရုံပဲ။

## ပါဝင်တာတွေ

1. **Focus timer manual** — 15/25/50 preset အပြင် "Custom minutes" မှာ
   1–480 ကြိုက်တဲ့ မိနစ် ရိုက်ထည့်ပြီး Set လုပ်လို့ရပြီ
2. **Widget checkbox** — home-screen widget မှာ task တစ်ကြောင်းချင်းရဲ့
   ဘယ်ဘက်မှာ checkbox ပါတယ်။ နှိပ်လိုက်ရင် app မဖွင့်ဘဲ အဲဒီ task
   complete ဖြစ်သွားမယ် (recurring ဆိုရင် နောက် occurrence လည်း
   အလိုအလျောက် ထွက်လာမယ်)။ App ကို ပြန်ဖွင့်ရင် widget က လုပ်ခဲ့တာ
   အလိုအလျောက် sync ဖြစ်တယ်
3. **Reminder time custom picker** — task editor မှာ preset အပြင်
   "Custom…" နှိပ်ရင် AM/PM + နာရီ (1–12) + မိနစ် (5 မိနစ်ခြား) နဲ့
   ကြိုက်တဲ့ အချိန် အတိအကျ ရွေးလို့ရပြီ
4. **Home page declutter** — အရင်က အတန်း ၅ တန်းလောက် ရှုပ်နေတာကို:
   - Search + Sort ခလုတ် တစ်တန်း (Sort ကို နှိပ်မှ panel ပွင့်တယ်)
   - View rail တစ်တန်း ထဲမှာ All / Today / Upcoming / Overdue /
     Active / Completed အကုန် စုထည့်ထားတယ် (အရင် အတန်း ၂ တန်း →
     ၁ တန်း)
   - Category / Tag rail က မူလအတိုင်း (fixed height)
5. **Polish** — task card ဘယ်ဘက်မှာ priority အရောင် accent line၊
   အောက် tab bar မှာ active tab ကို pill highlight၊ widget မှာ
   "All done 🎉" empty text

## လုပ်ရမှာတွေ

1. ဒီ zip ထဲက `src/` ကို PC project ထဲ overwrite ကူးပါ (ဖိုင် ၁၀ ခု)
2. OTA ပို့ပါ:

```
eas update --branch preview --message "UX pass: widget checkboxes, custom focus minutes, custom reminder time, cleaner Home"
```

3. ဖုန်းမှာ app ပိတ်/ပြန်ဖွင့်ပြီး စစ်ပါ:
   - Widget မှာ checkbox ပေါ်လား၊ နှိပ်ရင် task ပျောက်သွားလား
     (မှတ်ချက်: widget ၂ ခု ထပ်ထည့်ထားရင် ၂ ခုလုံး update ဖြစ်မယ်)
   - Focus timer မှာ custom 7 min လောက် ထားပြီး စမ်းကြည့်ပါ
   - Task အသစ်မှာ Reminder time → Custom… နဲ့ 9:37 AM လို ထားကြည့်ပါ
   - Home ထိပ်ပိုင်း ပိုရှင်းသွားလား

⚠️ app.json version ကို **2.1.0 အတိုင်းပဲ** ထားပါ။
