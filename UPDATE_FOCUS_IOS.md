# Update — Focus timer ကို အချိန်မပြည့်ခင် ပိတ်လို့ရပြီ + iOS အသင့်ပြင် (OTA)

## Focus timer

- **⏹ End session ခလုတ်** ထည့်ထားပြီ — အချိန်မပြည့်ခင် ကြိုက်တဲ့အချိန်
  ရပ်လို့ရတယ်၊ schedule လုပ်ထားတဲ့ finish notification ကိုပါ ဖျက်ပေးတယ်
- **Session ကို မှတ်ထားပေးတယ်** — timer စနေတုန်း app ကို ပိတ်လိုက် /
  swipe လုပ်ဖြုတ်လိုက်ရင်တောင် ပြန်ဖွင့်ရင် timer က ဆက်ရေတွက်နေမယ်၊
  Pause / End လည်း ပြန်လုပ်လို့ရတယ်

Focus timer အကြောင်း မှတ်ချက်: ဒါက **အလုပ်လုပ်ချိန် တိုင်းတဲ့ Pomodoro
timer** ပါ — အခြား app တွေကို ပိတ်ဆို့တာ မဟုတ်ပါဘူး။ App-blocking
(တခြား app သုံးမရအောင် ပိတ်တာ) က Android မှာ Usage Access /
Accessibility permission အထူးလိုပြီး iOS မှာ Apple ရဲ့ Screen Time
entitlement လိုတဲ့ native feature သီးခြားပါ — ဒီ app ထဲမှာ မပါပါဘူး။

## iOS

Code ကို iOS မှာ run လို့ရအောင် ပြင်ထားပြီ (Android-only widget
registration ကို guard လုပ်ထား၊ iOS bundle စစ်ပြီး — 751 modules OK)။
iPhone ပေါ် တကယ် တင်ဖို့ ဆိုရင်တော့ Apple Developer Program
($99/year) လိုပါတယ်:

```
eas build --platform ios --profile preview
```

ပြီးရင် EAS က ပေးတဲ့ link / TestFlight ကနေ iPhone မှာ install လုပ်ရုံပဲ။
iOS မှာ widget ကလွဲလို့ ကျန်တာ အကုန် အလုပ်လုပ်တယ် (notifications အပါ) —
iOS widget က Swift/WidgetKit native သီးခြား ရေးရတာ ဖြစ်လို့ ဒီ version
မှာ မပါသေးဘူး။

## လုပ်ရမှာ

Zip ထဲက ဖိုင် ၂ ခု (App.jsx + src/components/FocusTimer.jsx) ကို
overwrite ကူးပြီး OTA ပို့ပါ:

```
eas update --branch preview --message "Focus: end session anytime + session survives app close; iOS-ready"
```

⚠️ app.json ကို မထိပါနဲ့ — version 2.1.0 အတိုင်းပဲ။
