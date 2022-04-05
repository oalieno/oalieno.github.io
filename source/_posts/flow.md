---
title: "【項目介紹】Flow ( Dapper Labs )"
date: 2021-02-27
categories:
- 區塊鍊
tags:
- blockchain
- flow
- dapper labs
- crypto
---

這個項目算是很新的項目，去年的 9/22 - 10/3 才在第一波 ICO，每人限購 1000 USDC，當時 ICO 的價格是一顆 FLOW 要價 0.1 USDC，到現在也漲了 200 倍了吧，只恨沒有買更多啊 Orz 不過要鎖倉一年，所以要到今年底才拿的回來，但是光是產生的利息就已經回本好幾倍了xD
好了，廢話不多說，下面來介紹一下 flow 的特點。

## 資源

這邊先放幾個連結，有興趣入門的可以看一下

* [官方寫的入門文章](https://www.onflow.org/primer)
* [官方的文檔](https://docs.onflow.org/)
* [國外大佬的入坑指南](https://joshuahannan.medium.com/taking-your-first-steps-with-cadence-19dde86bbd0)

## 特點

Flow 是專門為應用程式以及遊戲所開發的一條新的區塊鍊
在鍊上面可以用 Cadence 這個程式語言撰寫 smart contract，對比隔壁棚的 Ethereum 用 Solidity 寫 smart contract

### Cadence 這個程式語言有什麼特點呢

* **Resource-Oriented Programming**
    * 聽說是參考 facebook 的 Libra 用的 Move 語言
    * 跟 Rust 的 ownership 很像
    * 可以看看下面兩篇 papers，在講怎麼樣設計一個適合用在 smart contract 上的語言
        * [Obsidian: A Safer Blockchain Programming Language](https://src.acm.org/binaries/content/assets/src/2018/michael-coblenz.pdf)
        * [Resource-Aware Session Types for Digital Contracts](http://www.cs.cmu.edu/~balzers/publications/digital_contracts_as_session_types.pdf)
* **Upgradable Smart Contract**
    * 多了一個 beta state 可以讓你盡情的 upgrade，在這個階段，如果使用這要用就要自行承擔風險囉，話是這樣說的
    * 等到都測試完後，就可以正式 release 了，之後就跟隔壁棚 Ethereum 的 smart contract 一樣就不能再改他了
* **Built-in Logging Support**
    * 只會在 transaction 上標記一個記號，你想要看 log 就自己在離線執行一次就可以看到了，不像隔壁棚 Ethereum 把 log 儲存在鍊上面
    * 在 Cadence 語言中就直接 `log("hi")` 就可以印 log 了，不像隔壁棚 Ethereum 還要先定義 event 再 emit

### Flow 這條區塊鍊有哪些特點呢

* **垂直分工 ( pipeline )**，把問題切成四份，某種問題會有一種專門的節點負責處理
    * 不像隔壁棚 Ethereum 尋求 sharding 的解決方式，用平行分工把所有交易切成很多子鍊，多了很多問題
    * 分下面四種工作
        * Consensus Nodes    : 共識機制在此發功，Flow 使用 HotStuff 共識機制
        * Verification Nodes : 檢查正確性，取締違規者
        * Execution Nodes    : 執行交易附帶的那些計算工作，也就是 smart contract 裡面的程式
        * Collection Nodes   : 負責包裝交易們處理些雜事，再丟給 Consensus Nodes，用來提昇整體區塊鍊的效率
    * 總而言之
        * Consensus 和 Verification 這兩種 Node 是安全守門員負責讓 Flow 更安全
        * Execution 和 Collection 這兩種 Node 是瘋狂機器人負責讓 Flow 更有效率跑得更快
* 每個帳號裡面都可以有多個 smart contract，不像隔壁棚 Ethereum 的 smart contract 和 address 是一對一的關係
* 內建支援 **multi-signature**，每個 key 會有一個 weight，只有你提供的 key 們的 weight 加起來有 1000 就可以做事情了
* 聽官網介紹是說有**帳號恢復機制**，不清楚細節
* 強調說他遵守了資料庫系統的 ACID ( Atomic, Consistent, Isolated, and Durable ) 原則，因為根本上區塊鍊就是一個去中心化的資料庫

## 如何成為節點

[官方的文檔 - Setting Up a Flow Node](https://docs.onflow.org/node-operation/node-setup)

| NODE TYPE | CPU | MEMORY | DISK |
| --- | --- | --- | --- |
| Collection | 2 cores | 16 GB | 200 GB |
| Consensus | 2 coresv | 16 GB | 200 GB |
| Execution | 16 cores | 128 GB | 2 TB |
| Verification | 2 cores | 16 GB | 200 GB |
| Access | 2 cores | 16 GB | 200 GB |

> Make sure you have a sufficiently fast connection; we recommend at least 1Gbps, and 5Gbps is better.

硬體要求還行，我的桌機好像還能跑，但是這個網速要求有點高啊
而且還要填[表單](https://www.onflow.org/node-validators)申請，太中心化了啊
然後[這裡](https://docs.onflow.org/node-operation/node-roles)有寫每種 node 要跑得話要 stake 多少顆 flow，最便宜也至少要 stake 135000 顆 flow，以目前的價格來看大概是 270 萬美金吧，我去

## Flow 目前的一些問題

目前 Flow 還在初期階段，有些東西還沒搞好
下面一些資訊是我在 discord 群看到的

> we still have a lot of things locked down in mainnet right now. The ability to create accounts is one of them. At this time only partnered wallets can create accounts. This will obviously be opened up in the future. At a minimum it won’t happen until fees are in place on mainnet.
> - qvvg on discord

主網路還沒好啊，不能隨意創帳號
需要他們合作的夥伴像是 blockto 才能創，可以用 https://port.onflow.org/ 這個創帳號的樣子
還不夠去中心化啊

> Flow's fee model is still under development, but will have transaction fees. The payer of a transaction can be separate from the authorizer, so dapps can easily pay for their users transactions. Flow keeps tx fees affordable and accessible for all.
> - Flow Assistant Bot on discord

手續費的機制也還沒弄好啊

> Flow is an decentralized protocol being built in an open ecosystem - there is no formal roadmap but if you'd like to see areas people are currently expending effort you can take a look at issues currently in the GitHub repo https://github.com/onflow/flow/issues and feel free to create or comment on issues for anything that you think should exist on Flow.
> - Flow Assistant Bot on discord

沒有正式的 roadmap

## Flow 的應用

* [NBA Top Shot](https://www.nbatopshot.com/): NBA 主題的 NFT，可以讓你收藏你最愛的球員，以及他們得分的片段等
* [VIV3](https://viv3.com/): 買賣 NFT 的平台
* [MotoGP™ Ignition](https://motogp-ignition.com/): 類似 Ethereum 上的 [F1® Delta Time](https://www.f1deltatime.com/)，同一批開發人員的樣子，只是從 F1 賽車改成 MotoGP 摩托車，可以組裝自己的車車然後跟別人比賽，下個月 3/26 開賣
* [CryptoKitties](https://www.cryptokitties.co/): 還在計畫從 Ethereum 遷移到 Flow，不知道是哪時候

## 總結

Flow 提出了很多方案來改進去中心化應用面臨到的問題，接下來就要靜待時間的考驗，等潮水退了就知道 Flow 有沒有穿褲子了

## **Flow to the Moon 🚀**
