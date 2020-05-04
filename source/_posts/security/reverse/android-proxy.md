---
title: "[安卓逆向] 透過 Burp Suite Proxy 夜神模擬器"
date: 2020-03-18 20:31:14
categories:
- [security, reverse]
tags:
- security
- reverse
- android
- nox
- burp
- drony
---

## 前言

在上一篇 adb 的環境佈置中，我們是用 Android Emulator，但我想要 reverse 的 app 只有支援 arm ( 蠻多 app 都沒有支援 x86-64 的 )，而在我 x86-64 機器上的 Android Emulator 上開 arm 的虛擬機很慢，所以我就換用了 Nox Player，他同時支援 arm 跟 x86-64 的架構，速度也挺快的。

恩等等，我剛剛才發現原來 Nox Player 是在 VirtualBox 上面開一台虛擬機跑，傻眼。

{% admonition question "怎麼知道這個 app 支援什麼" %}
用 apktool 解開 apk 檔後，看 `/lib` 資料夾下面有哪些資料夾，可能會有 `arm64-v8a`、`armeabi-v7a`、`x86`、`x86_64` 等，這些就是這個 app 用到的函式庫，沒有對應架構的函式庫當然就是不支援了，或者有些 app 會將每個架構分開發佈，只要去下載對應架構的 app 就可以了。
{% endadmonition %}

{% admonition question "adb 怎麼連上夜神模擬器" %}
夜神模擬器預設會把 adb server 開在 port 62001, 62025, 62026, ... ( 我不知道為什麽 62001 直接跳到 62025 )
所以 `adb connect localhost:62001` 就可以啦
{% endadmonition %}

## [Drony](https://apkpure.com/tw/drony/org.sandroproxy.drony)

主要是參考這篇 [Android Hacking | Setup Global Proxy for All Apps in Android (without root) with Burp Suite
](https://king-sabri.net/android-hacking-setup-global-proxy-for-all-apps-in-android-without-root-with-burp-suite/) 的教學，在使用 Drony 前，我還有用過另一款叫 ProxyDroid，不過沒成功，不知道出了什麼事。

基本流程是這樣的，因為 Drony 本身也是一個 proxy server，所以要先在 Android 的設定中將 proxy 導向到 Drony，然後在 Drony 的設定中將 proxy 導向主機的 Burp Suite。

### 第一步

打開 Android 的設定，照著下面這樣點
設定 > 無限與網路 > Wi-Fi > 你的 Wi-FI 的名字 ( 長按他 ) > 修改網路 > 顯示進階選項 > Proxy ( 手動 )
主機名稱填 127.0.0.1，通訊埠填 8020 ( Drony 預設的通訊埠 )

### 第二步

打開 Drony 的設置，照著下面這樣點
設置 > 網路 > 無線網路 > 你的 Wi-FI 的名字
代理類型選手冊 ( 也就是 Manual，真爛的翻譯 )，主機名稱填主機的 ip，通訊埠填 8080 ( Burp Suite 預設的通訊埠 )

{% admonition question "怎麼找主機的 ip" %}
主機基本上會是 Nox Player 的 default gateway ( 其實就是在 VirtualBox 的 NAT Mode )，所以下 `adb shell ip route show` 找到 default gateway 就是主機的 ip 了
{% endadmonition %}

### 完成

這樣就設定好啦，在日誌頁面把開關打開就可以了。

## Burp Suite 憑證安裝

順便安裝一下 Burp Suite 的憑證，這樣就不會一直跳憑證問題了
先到 http://burp 下載 Burp Suite 的憑證，載下來是 der 副檔名的話，先把他改名成 cer 副檔名結尾
打開 Android 的設定，照著下面這樣點
設定 > 個人 > 安全性 > 憑證儲存空間 > 從 SD 卡安裝 ( 選 cacert.cer )
安裝的時候他會叫你設定一下 PIN 碼