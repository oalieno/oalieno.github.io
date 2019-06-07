## ENS

就跟 DNS 的功能一樣，把複雜的地址對應到一個 human-readable 的字串，比如 `buymecoffee.eth`  
[enslisting.com](https://enslisting.com/) 是舊的服務，用 [5 day vickery auction](https://medium.com/the-ethereum-name-service/a-beginners-guide-to-buying-an-ens-domain-3ccac2bdc770) 來競標  
[manager.ens.domains](https://manager.ens.domains/) 是新的服務，2019/05/04 上線，不用再等五天競標這麼久了  
ENS 的本體其實就是一個智慧合約，看看這個 → [ens](https://github.com/ensdomains/ens)  

## [Ethereum Address Checksum](https://ethsum.netlify.com/)

Ethereum 的位址是用大小寫來當 checksum，如果 checksum 錯了 web3 會噴錯  
可以叫 web3 幫你做 checksum `web3.toChecksumAddress('ADDRESS')`

### 實作虛擬碼[^1]

```javascript
function toChecksumAddress () {
    let hash = keccak256(address)
    let ans = '0x'
    for (let i = 0; i < address.length; i++) {
        if (parseInt(hash[i], 16) >= 8)
            ans += address[i].toUpperCase()
        else
            ans += address[i]
    }
    return ans
}
```

## SHA3 與 Keccak256 的區別[^2]

簡單來說  
Keccak256 是指原本的 SHA3  
SHA3 是指 NIST 標準的 SHA3

[^1]:
    https://github.com/ethereum/EIPs/blob/master/EIPS/eip-55.md#implementation
[^2]:
    https://www.jianshu.com/p/682c75b10392
