---
title: "Linux Kernel 出漏洞 Ubuntu 該升級哪一版 O_O?"
date: 2023-02-28
categories:
- 資安
tags:
- ubuntu
- linux
- kernel
- cve
- security
---

因為去年底出的一個新的 Kernel 漏洞 CVE-2022-47939，要幫忙檢查 Ubuntu 有沒有需要更新 Kernel，所以就寫了這篇記錄一下。

首先，這個漏洞在 [mitre 的 cve 頁面](https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2022-47939) 中寫了影響的範圍是 `Linux kernel 5.15 through 5.19 before 5.19.2`，出問題的是 ksmbd 這個 kernel module，他是在 5.15 版本被引入的，所以 5.15 之前的版本就沒事，最後是在 [這個 commit](https://git.kernel.org/pub/scm/linux/kernel/git/torvalds/linux.git/commit/?id=cf6531d98190fa2cf92a6d8bbc8af0a4740a223c) 中修掉的，這個 commit 的 message 是 `ksmbd: fix use-after-free bug in smb2_tree_disconect`，跟在 mitre 的 cve 的敘述中寫的一樣，在頁面下方的 References 其實也可以看到這個 commit 的連結。

所以我們知道有問題的 Linux Kernel 版本是什麼，但是我要怎麼在 Ubuntu 上面看我的 Linux Kernel 是幾版，上網查一下或是問 chatgpt，其實就可以得到這個指令 `uname -r`，執行這個指令之後，在我的機器上給出了 `5.15.0-58-generic` 這樣的版本號，看起來是 5.15 版本，是在有漏洞的範圍裡面，但其實並沒有，因為這是 Ubuntu 自己 build 的版本號，並不是 Linux Kernel 的版本號，Ubuntu 的版本號的命名慣例是 `<base kernel version>-<ABI number>.<upload number>-<flavour>`，你會發現把剛剛的 `5.15.0-58-generic` 套在這個格式上看好像少了一個 upload number，我們可以用 `cat /proc/version_signature` 查看比較詳細的版本號，在我的機器上的結果是 `Ubuntu 5.15.0-58.64-generic 5.15.74`，分別是

- base kernel version: 5.15.0
- ABI number: 58
- upload number: 64
- flavour: generic
- upstream linux kernel: 5.15.74

最後他還多給了一個 upstream linux kernel 的版本號。ABI number 指的是 kernel 本身開出來的 application binary interface 介面的版本號，如果你把 kernel 看成是一個後端 server，那他就是指你的 REST API 的接口，所以可能會跟 upload number 不同，因為可能兩個不同的 kernel 版本只是修了些 bug，沒有開新的 api，或是 api 的參數沒有變化，這時候這個 ABI number 就不會變。而 upload number 單純就是一個流水號，指從這個 `5.15.0` base kernel version 長出來的第幾個版本，所以我們可以看這個號碼來分辨前後順序。

在 [Ubuntu Secuity: CVE-2022-47939](https://ubuntu.com/security/CVE-2022-47939) 發布的漏洞公告中，我們可以看到他有列出他們上 patch 的版本，Ubuntu 22.04 (jammy) 的是 `5.15.0-53.59`，我們可以直接去看 [Ubuntu linux source package 中 `5.15.0-53.59` 版本的 Changlog](https://launchpad.net/ubuntu/+source/linux/5.15.0-53.59)，這裡我們搜尋 `smb2_tree_disconect` 就可以找到在這個版本的更新有納入 `v5.15.61` upstream linux kernel 其中修掉了這次的 CVE-2022-47939，而我的機器是 `5.15.0-58.64`，是在 `5.15.0-53.59` 後面的，所以其實我的機器的 Linux Kernel 已經有修補掉這個漏洞了。

總結來說，在 Ubuntu 下 `uname -r` 得到的版本號其實不能直接對應到 Linux Kernel 的版本號，Ubuntu 本身是從 Linux 分支出來的，所以自己有一個版本號，我們這次介紹了 Ubuntu 版本號各個欄位的意思，並且找到我們的版本號其實是已經有上 patch 了，這樣之後出新的漏洞就可以知道要升級到哪個版本可以修補掉漏洞。
