# DES ( Data Encryption Standard )

DES 可以看作是這些 state 的演算

$M_0, M_1, \cdots, M_{17}$

$M_{i + 1} = M_{i - 1} + f(k_i, M_i)$

輸入是 $M_0, M_1$  
輸出是 $M_{17}, M_{16}$  
$k_i$ 是從金鑰產生出來的 subkey

### Parity Check

DES 的金鑰只用了 56 bits

每個 byte 的最後一個 bit 是拿來做 Parity Check

### Weak Keys

weak key 是指會讓加密和解密一樣的 key

這四個 weak key 會產生 16 個相同的 subkeys
`0x0101010101010101`  
`0xFEFEFEFEFEFEFEFE`  
`0xE0E0E0E0F1F1F1F1`  
`0x1F1F1F1F0E0E0E0E`  
因為 DES 的加密和解密只差在 subkeys 的順序，既然 subkeys 都一樣那加密跟解密也是一樣的

除了 weak key 還有 semi weak key  
只產生兩種 subkeys 各 8 個

### Fixed Point in Weak Keys

Fixed Point 是指 $E(m) = m$，也就是自己加密完還是自己

當我們的 subkeys 全部都一樣時

可以證明只有當 $M_8 = M_9$ 時才會有 Fixed Point

那麼我們可以隨便選一個值來當作 $M_8 = M_9$ 然後往下算 $M_{10}, \cdots, M_{17}$，算出來的就是 Fixed Point

所以 key 是 weak key 的話，會有一半的機會，也就是 $2^{32}$ 個是 Fixed Point

### 相關資料

* https://www.tutorialspoint.com/cryptography/data_encryption_standard.htm
* https://en.wikipedia.org/wiki/Weak_key#Weak_keys_in_DES
* https://universalflowuniversity.com/Books/Computer%20Programming/Malware%20and%20Cryptography/Introduction%20to%20Modern%20Cryptography%202nd%20Edition.pdf
* https://csrc.nist.gov/csrc/media/publications/fips/46/3/archive/1999-10-25/documents/fips46-3.pdf
* https://crypto.stackexchange.com/questions/20896/what-is-the-fixed-point-attribute-of-des-when-used-with-weak-keys
