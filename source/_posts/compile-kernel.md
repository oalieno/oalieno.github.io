---
title: "【手把手教你玩 Kernel】編譯 Linux Kernel"
date: 2019-04-23
categories:
- 程式
tags:
- kernel
---

## 原始碼下載

可以從 [www.kernel.org](https://www.kernel.org/) 下載最新的 kernel ( 我是下載 5.0.9 的 )

```bash
wget https://cdn.kernel.org/pub/linux/kernel/v5.x/linux-5.0.9.tar.xz
x linux-5.0.9.tar.xz
```

## 設置編譯參數

```bash
make menuconfig
```

有選單可以客製化，選完之後會產生 `.config` 

<img src="https://i.imgur.com/hbbpTGY.png">

## 編譯

```bash
make -j$(nproc)
```

`-j` 多個程序並行編譯

{% admonition info "make help" %}
可以用 `make help` 看看有哪些參數可以用
{% endadmonition %}

## 安裝

```bash
make -j$(nproc) modules_install
```

安裝內核模塊 ( kernel module )  
會裝到 `/lib/modules/`

```bash
make -j$(nproc) install
```

安裝內核本體  
會裝到 `/boot`  
並且會自動更新 grub  
下次重啟系統就會是新的內核

{% admonition info "安裝到其他目錄" %}
```bash
export INSTALL_PATH=/path/to/install
```
{% endadmonition %}

---

1. https://www.cyberciti.biz/tips/compiling-linux-kernel-26.html
2. https://stackoverflow.com/questions/35931157/change-linux-kernel-installation-directory
