---
title: "【安卓逆向】Android Studio Emulator + ADB 環境佈置"
date: 2020-02-15 23:17:50
categories:
- [security, reverse]
tags:
- security
- reverse
- android
- adb
---

紀錄一下怎麼設定好一台 Android 的虛擬機

1. 我是用 Android Studio 裡面的 Emulator，所以要先裝一下 [Android Studio](https://developer.android.com/studio)
2. 打開 AVD Manager 後點 Create Virtual Device

{% img /images/avd-manager.png 'AVD Manager' %}

3. 選一個 device，比如 Pixel 3a
4. 選一個 system image，比如 Pie
5. 完成

## ADB ( Android Debug Bridge )

### 路徑

在 Android SDK 的 platform-tools 裡面，用 macos 的話應該會在 `/Users/xxx/Library/Android/sdk/platform-tools/`
沒有的話可以去 [官網](https://developer.android.com/studio/releases/platform-tools) 載

### 基本功能

| 指令 | 解釋 |
|---|---|
| `adb devices` | 列出所有裝置 |
| `adb root` | 用 root 權限重開 adb 服務 |
| `adb shell` | 互動式的 shell |
| `adb shell "ls"` | 執行一行指令 |
| `adb push ./myfile /data/local/tmp/` | 傳檔案進去 |
| `adb pull /data/local/tmp/myfile ./` | 抓檔案出來 |
| `adb reboot` | 重開機，可以簡單粗暴的驗證有沒有設置成功 |

如果有多台裝置的話，要加 `-s` 指定哪一個裝置，比如 `adb -s emulator-5554 shell`

## 疑難雜症

Q : 遇到 `adbd cannot run as root in production builds` 怎麼辦 ?
A : 在選 image 的時候要選 target 是 Google APIs 的

Q : 怎麼卸載 system image ?
A : 打開 SDK Manager ( 在 AVD Manager 旁邊 )，勾選 Show Package Details，就可以看到下載過的 system image，取消勾選再按 OK 就卸載了

Q : 怎麼卸載 app ?
A : 除了麻瓜的方法外，也可以在 `adb shell` 拿到 shell 之後，用 `pm list packages` 看有哪些 app，再用 `pm uninstall -k com.example.test_app` 卸載 app

Q : 怎麼把 apk 抓出來?
A : 先用 `pm path com.example.test_app` 找出 apk 的路徑，再用 `adb pull /data/app/com.example.test_app.apk ./` 抓出來

## 其他的 Android 虛擬機

如果你只是想玩遊戲的話，可以參考下面幾款模擬器

1. [BlueStacks](https://www.bluestacks.com/)
2. [NoxPlayer ( 夜神模擬器 )](https://www.bignox.com/)
3. [MemuPlay ( 逍遙模擬器 )](https://memuplay.com/)
4. 等等