# Tricks in PHP

* https://www.restran.net/2016/09/26/php-security-notes/

## serialize

[相關部落格文章](http://www.itread01.com/content/1494422470.html)

#### \_\_wakeup

unserialize() 會檢查是否存在一個 \_\_wakeup() 方法

如果存在，則會先調用 \_\_wakeup 方法，預先準備對象需要的資源

#### protected and private variable

```php
<?php
class starwars {
    public $jedi1 = "master1";
    protected $jedi2 = "master2";
    private $jedi3 = "master3";
}

$s = new starwars();
echo serialize($s);

// output : 'O:8:"starwars":3:{s:5:"jedi1";s:7:"master1";s:8:"*jedi2";s:7:"master2";s:15:"starwarsjedi3";s:7:"master3";}'
?>
```

會發現長度怪怪的

protected variable 的 `s:8:"*jedi2";` 其實是 `s:8:"\x00*\x00jedi2";`

private variable 的 `s:15:"starwarsjedi3";` 其實是 `s:15:"\x00starwars\x00jedi3";`

#### 數字前面可以有 +

數字的前面都可以有 + 代表正數

#### CVE-2016-7124

影響版本 :

PHP5 < 5.6.25   
PHP7 < 7.0.10

在成員屬性數目大於實際數目時，\_\_wakeup 不會被呼叫

就像這樣 `'O:4:"test":10:{s:7:"message";s:5:"hello";}'`，我只有一個屬性 message 但我是填 10
