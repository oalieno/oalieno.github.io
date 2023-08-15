---
title: "【語言模型】繁中語言模型 bloom-1b1-zh 試玩"
date: 2023-03-02
categories:
- [AI]
tags:
- chatgpt
- ai
- llm
- bloom
---

> 由聯發科（2454）集團轄下的前瞻技術研究單位聯發創新基地、中央研究院詞庫小組和國家教育研究院三方所組成的研究團隊，今日開放全球第一款繁體中文語言模型到開源網站提供測試。
> 
> 來源: https://udn.com/news/story/7240/6991226

上禮拜聽說有新的繁體中文的語言模型釋出，想來玩一下，但是新聞上沒有放連結，找了一下才找到 [bloom-1b1-zh](https://huggingface.co/ckip-joint/bloom-1b1-zh)，但是這個模型只有 2GB，不是原本 Bloom 的 1760 億參數的那個模型，是迷你版的，雖然 1760 億參數的模型我的電腦也跑不動就是了xD

## 安裝

先來說一下怎麼安裝，首先開一個 python 的虛擬環境，看你要開 venv 還是用 poetry 或是 conda 都可以，建議是裝在虛擬環境不要直接裝在本地套件，我這邊示範是開一個 venv 來安裝

```shell
python -m venv .venv
source .venv/bin/activate
```

接著就安裝 `transformers` 和 `pytorch`
`pytorch` 可以去 [pytorch 官網](https://pytorch.org/get-started/locally/) 上複製安裝指令，根據你的 OS 還有你的 CUDA 版本選不同的安裝指令，我是選 Stable (1.13.1) 和 CUDA 11.7，然後用 pip 安裝

```shell
pip install transformers
pip install torch torchvision torchaudio --extra-index-url https://download.pytorch.org/whl/cu117
```

裝完之後，接下來就是下載模型，直接把 [bloom-1b1-zh](https://huggingface.co/ckip-joint/bloom-1b1-zh) clone 下來，記得要裝 [git lfs](https://docs.github.com/en/repositories/working-with-files/managing-large-files/installing-git-large-file-storage?platform=linux)，或是你也可以手動載下來

```shell
git clone https://huggingface.co/ckip-joint/bloom-1b1-zh
```

載完之後執行以下腳本就可以開始玩了
這個腳本先用 `from_pretrained` 從剛剛下載的資料夾 `./bloom-1b1-zh` 載入模型`
下面我寫了一個 while 迴圈吃 `使用者輸入` 還有 `輸出長度`，然後印出結果

```python
from transformers import BloomForCausalLM
from transformers import BloomTokenizerFast

model = BloomForCausalLM.from_pretrained("./bloom-1b1-zh")
tokenizer = BloomTokenizerFast.from_pretrained("./bloom-1b1-zh")

def gen(prompt, result_length):
    inputs = tokenizer(prompt, return_tensors="pt")
    return tokenizer.decode(model.generate(inputs["input_ids"],
                           max_length=result_length,
                           num_beams=2,
                           no_repeat_ngram_size=2,
                           early_stopping=True
                          )[0])

while True:
    prompt = input("prompt: ")
    length = int(input("length: "))
    result = gen(prompt, length)
    print(result)
```

## 實驗

先隨便抓一些新聞的開頭來試一下

```
prompt: 金管會要出手了！詐騙集團手法層出不窮，黃天牧今（2）日透露，最快2周內、3月底前將跟臉書Meta與谷歌二家社群平台開會
length: 300

金管會要出手了！詐騙集團手法層出不窮，黃天牧今（2）日透露，最快2周內、3月底前將跟臉書Meta與谷歌二家社群平台開會，討論如何打擊詐欺集團。
「黃大哥」表示，目前詐詐集團已從社群網站下手，但臉書的社群功能較弱，因此，他會與Google、Facebook等平台商討論，如何加強社群的防範功能，讓社群更安全。</s>
```

```
prompt: 「這是希臘史上最嚴重的火車意外之一，也是歐債危機以來撙節開支的後遺症...」希臘當地時間2月28日午夜的火車對撞的嚴重事故，目前
length: 100

「這是希臘史上最嚴重的火車意外之一，也是歐債危機以來撙節開支的後遺症...」希臘當地時間2月28日午夜的火車對撞的嚴重事故，目前已經造成至少50人死亡，超過200人受傷。
希臘總理帕潘德里歐在記者會中說，事故發生後，希臘政府已經下令，所有公共運輸系統，包括火車、巴士、地鐵、公車等，都必須關閉，直到救援工作完成為止。</s>
```

怎麼出現 `詐詐集團`，竟然疊字裝可愛?!
看起來產生的文字還算通順，他還會自己加一個 `</s>` 停止符號，代表他說完了

接下來嘗試讓他完成一些對話

```
prompt: 甲:「你好!」乙:「
length: 300

甲:「你好!」乙:「我很好,謝謝你.」丙:「你怎麼了?」丁:「沒事,只是有點感冒,請你多保重,我會好好照顧你的.」「謝謝,」甲說,「我一定會照顧好你的,你放心吧!」「好,我放心了!我一定要好好保護你,不要讓
任何人傷害你!你一定要保護好自己,別讓別人傷害自己!你要好好愛惜自己的身體,要好好養生!不要生病!要養好身體!我要好好地照顧你！」乙說:「好!謝謝你的關心!我會照顧好的!你也一定要好好的照顧我!我們一起努力!一起加油!加油！」丙說：「我真的很感謝你對我的照顧!我也很想你啊!我好想見見你呀!好想!我很想聽你說話!我想聽聽你的聲音,我想和你說話,想和你聊天!可是我怕你聽不到我說話的聲音,因為我害怕你 聽到我的聲音會生氣,會不高興,所以我就不敢說!因為我知道,如果我不說的話,你會生氣、不開心!所以,我要說出來,讓你知道我有多愛你、有多想你好好地愛護我、照顧我好嗎?」「我當然會!我相信你愛我,我也相 信你對我很好!但是,如果你不愛我了,我不會怪你的!我不怪你什麼!我只怪我自己太愛
```

看起來整個壞掉了阿，後面一直在跳針，是可以閱讀但是沒有邏輯，可能是輸入資訊量太少嗎
隨便找個網文小說來給他產產看

```
prompt: 葉琮叼著一根稻草，雙手抱後腦勺，用一本書蓋在臉上，擋住直射來的陽光，愜意的躺在山坡草地上享受著午休時光。"葉琮哥！"一個紅頭發的小男孩兒揮著手跑了過來。葉琮無奈的睜開眼，在他頭上輕輕敲了一下："焱，說過多少次了，不要在我午休的時候打擾我。"對於像他這樣喜歡在夜晚活動的打更人來說，午休是格外重要的。
length: 500

葉琮叼著一根稻草，雙手抱後腦勺，用一本書蓋在臉上，擋住直射來的陽光，愜意的躺在山坡草地上享受著午休時光。"葉琮哥！"一個紅頭發的小男孩兒揮著手跑了過來。葉琮無奈的睜開眼，在他頭上輕輕敲了一下："焱，說過多少次了，不要在我午休的時候打擾我。"對於像他這樣喜歡在夜晚活動的打更人來說，午休是格外重要的。但是，他卻從來沒有過午睡的習慣，所以，在葉家，只有他一個人午睡了，其他的人都是睡覺的。他睡得特別香，睡得很安穩，甚至連呼吸聲都聽得到。這天，葉家的午飯時間到了，大家都在院子裡吃著飯。突然，一個聲音響起："喂！葉哥，你醒醒，快起來吃午點吧。""我怎麼會醒來啊？我睡著了，怎麼
可能醒過來？""你睡著的時候，我一直在看書，看什麼書啊？"一個大大的黑眼睛，一雙黑亮的大眼睛。這個黑眼珠子，就是葉瑋瑄。她長得很漂亮，眼睛很大，很亮，而且很黑，就像一顆黑珍珠。她的臉蛋很圓潤
，五官很完美，皮膚很白皙，眉毛很濃，嘴唇很紅，鼻子很挺，嘴巴很薄，下巴很尖，小巧玲瓏，嬌小可人，非常惹人憐愛。可是，她卻是個很膽小的孩子，膽小得連自己都害怕，更別提別人了。有一次，她在院子里玩，不小心跌倒在地，被一個小男孩撞到了。那個男孩一看到她，就跑過來抱住了她。那時候，她的心就像被針扎了一樣，疼得直發抖，但是她還是咬著牙，勇敢的站了起來，跑向了院子的另一邊。就在她跑得快，腳步蹣跚，快要摔倒時，突然有一股力量把她從地上拉了回來。原來，那個小男生就是她爺爺，爺奶奶，還有她外婆。他們都抱著她哭著跑來，抱住她說："葉
```

問題好像還是一樣，還算可以閱讀，但完全沒有邏輯

讓他產產看英文好了，他的 base model 應該是英文的模型吧

```
prompt: Japan's Prime Minister Fumio Kishida has been criticised for saying the country's ban on same-sex marriage is not discriminatory. Weeks ago, he apologised to the LGBTQ community over homophobic comments made by an aide who has since been sacked. Mr Kishida's party is under growing pressure to improve LGBTQ rights, as more Japanese support same-sex marriage. Japan remains
length: 500

Japan's Prime Minister Fumio Kishida has been criticised for saying the country's ban on same-sex marriage is not discriminatory. Weeks ago, he apologised to the LGBTQ community over homophobic comments made by an aide who has since been sacked. Mr Kishida's party is under growing pressure to improve LGBTQ rights, as more Japanese support same-sex marriage. Japan remains one of the few countries in the world to ban same-sex marriage, but the government has said it will not change its position.

The government's decision to allow same sex marriage in Japan was announced in March, after a government-appointed panel of judges ruled that the law was discriminating against gay people. The ruling was criticised by the gay community, who said they were being discriminated against by Japan's government. In a statement, the Japan Society for the Prevention of Cruelty to Animals (JSPCA) said: "We are deeply saddened by this ruling."

"We strongly condemn the ruling and urge the Japanese government to reconsider its decision," the group said. "It is clear that Japan has a long way to go before it is able to fully respect the rights of all people, regardless of their sexual orientation or gender identity, to live in harmony with one another and to enjoy the same rights and freedoms as everyone else in society, including the right to marry and have a family. This ruling is a clear example of how Japan continues to discriminate against the most vulnerable and marginalised groups of society. It is also a sign of a lack of respect for human rights in this country, which is why we are calling on Japan to take urgent steps to ensure that all its citizens enjoy equal rights to life, liberty, and the pursuit of happiness, without discrimination based on their gender, sexuality, religion, or political beliefs.

(Reporting by Yuki Yamaguchi; Editing and editing by David Jones)</s>
```

有些瑕疵但好像還行，中間還跑出 Japan Society for the Prevention of Cruelty to Animals (動保團體)?

```
prompt: # calculate Fibonacci sequence\ndef fibo(x):
length: 200

# calculate Fibonacci sequence
def fibo(x):

    return x**2 + x + 1

# generate a random number
rand = random.randrange(0, 100)
print(rand)

</s>
```

想說測試一下他會不會寫 code，他格式有寫對，但產出來是不正確的結果，還自己寫了額外的產亂數的 code
對一個 2GB 的繁體中文模型是不是要求太多了xD

## 結論

總結來說，用新聞的文章讓他接龍產出來的文字還算通順邏輯也沒問題，但是寫小說就完全不行，會一些英文也會一些 code，以一個 2GB 的小模型來看，還算可以吧，不知道哪時候會釋出 1760B 參數的模型出來，不過釋出了應該也是個 360 GB 的模型，我的電腦就玩不起了呀xD

---

1. https://towardsdatascience.com/getting-started-with-bloom-9e3295459b65
2. https://huggingface.co/ckip-joint/bloom-1b1-zh
3. https://udn.com/news/story/7240/6991226
