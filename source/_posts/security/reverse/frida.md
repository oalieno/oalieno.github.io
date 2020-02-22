---
title: "學習筆記 - Frida Hook 注入"
date: 2020-02-16 16:35:13
categories:
- [security, reverse]
tags:
- security
- reverse
- android
- frida
---

今天我們要來練習用 frida 在 Android 上做動態調試

## 逆之呼吸壹之型 - 一般函式

先來寫個簡單的範例 APP
有一個按扭和一個輸入欄，輸入名字之後，按下按鈕，就會顯示 Hello 加上你輸入的名字
不會寫 APP 的小朋友可以先去 youtube 上找教學，有一大堆

```java MainActivity.java
package com.example.myapplication;

import androidx.appcompat.app.AppCompatActivity;

import android.os.Bundle;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.TextView;

public class MainActivity extends AppCompatActivity {
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        Button sayButton = findViewById(R.id.sayButton);
        sayButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                EditText somethingEditText = findViewById(R.id.somethingEditText);
                TextView resultTextView = findViewById(R.id.resultTextView);
                String something = somethingEditText.getText().toString();
                resultTextView.setText(say(something));
            }
        });
    }

    String say (String something) {
        return "Hello " + something;
    }
}
```

{% img /images/example-app.png 300 "example app" %}

python 負責呼叫 frida api 做注入，javascript 是被注入進去做事的
我們的目標是 hook 函式 `say`，並在原本的輸出文字後面加上 `!!!`

```python hook.py
import frida

def on_message(message, payload):
    print(message)

device = frida.get_usb_device()
pid = device.spawn(["com.example.myapplication"])
session = device.attach(pid)

with open("script.js") as f:
    script = session.create_script(f.read())
    script.on("message", on_message)
    script.load()

device.resume(pid)

input()
```

```javascript script.js
Java.perform(() => {
    main = Java.use("com.example.myapplication.MainActivity")
    main.say.implementation = function (something) {
        var ret = this.say(something)
        return ret + '!!!'
    }
})
```

{% img /images/example-app-hook.png 300 "example app hook" %}

## 逆之呼吸貳之型 - 重載函式

改一下範例 APP，多加上一個接受數字做輸入的 `say` 函式
接收到數字後，就輸出 Hello 加上輸入的數字的平方

```java MainActivity.java
package com.example.myapplication;

import androidx.appcompat.app.AppCompatActivity;

import android.os.Bundle;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.TextView;

public class MainActivity extends AppCompatActivity {
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        Button sayButton = findViewById(R.id.sayButton);
        sayButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                EditText somethingEditText = findViewById(R.id.somethingEditText);
                TextView resultTextView = findViewById(R.id.resultTextView);
                String something = somethingEditText.getText().toString();
                try {
                    Integer number = Integer.parseInt(something);
                    resultTextView.setText(say(number));
                } catch (NumberFormatException e) {
                    resultTextView.setText(say(something));
                }
            }
        });
    }

    String say (String something) {
        return "Hello " + something;
    }

    String say (Integer number) {
        number = number * number;
        return "Hello " + number.toString();
    }
}
```

{% img /images/example-app2.png 300 "example app" %}

兩個 `say` 都是一樣的名字，所以 hook 的時候要用 `overload` 去區分，`overload` 參數放的是目標函式輸入參數的型態
這次我們在新的 `say` 函式的輸出文字後面加上 `???`
`hook.py` 跟上一個例子一樣就不再貼一次了

```javascript script.js
Java.perform(() => {
    main = Java.use("com.example.myapplication.MainActivity")
    main.say.overload("java.lang.String").implementation = function (something) {
        var ret = this.say(something)
        return ret + '!!!'
    }
    main.say.overload("java.lang.Integer").implementation = function (number) {
        var ret = this.say(number)
        return ret + '???'
    }
})
```

{% img /images/example-app2-hook.png 300 "example app hook" %}

## 逆之呼吸參之型 - 隱藏函式

再改一下範例 APP，多加上一個變數 `secret` 和一個函式 `getSecret`，在 `onCreate` 裡面會給 `secret` 一個隨機值，我們的目標就是找出這個值

```java MainActivity.java
package com.example.myapplication;

import androidx.appcompat.app.AppCompatActivity;

import android.os.Bundle;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.TextView;

public class MainActivity extends AppCompatActivity {

    private int secret;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        secret = (int) (Math.random() * 100);

        Button sayButton = findViewById(R.id.sayButton);
        sayButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                EditText somethingEditText = findViewById(R.id.somethingEditText);
                TextView resultTextView = findViewById(R.id.resultTextView);
                String something = somethingEditText.getText().toString();
                try {
                    Integer number = Integer.parseInt(something);
                    resultTextView.setText(say(number));
                } catch (NumberFormatException e) {
                    resultTextView.setText(say(something));
                }
            }
        });
    }

    String say (String something) {
        return "Hello " + something;
    }


    String say (Integer number) {
        number = number * number;
        return "Hello " + number.toString();
    }

    int getSecret () {
        return secret;
    }
}
```

因為我們的目標不是自己 new 一個物件出來抓 `secret`，這樣就只是一個我們自己就可以生成的隨機值而已
我們是要找出目前已經存在的那個 instance 的 `secret`，在實際例子中可能就會是一組隨機生成的密碼之類的
所以我們要用到 `Java.choose` 去抓 instance，抓到 instance 後，可以

1. `instance.getSecret()` 呼叫函式搞定
2. `instance.secret.value` 存取變數搞定

然後用 `send` 可以把資料傳到 python 端的 `on_message` 做處理

```javascript script.js
Java.perform(function () {
    Java.choose("com.example.myapplication.MainActivity", {
        onMatch: function (instance) {
            send(instance.getSecret())  // call function
            send(instance.secret.value) // access vairable
        },
        onComplete: function () {}
    }) 
})
```

## 疑難雜症

Q : 有函式 `a` 跟變數 `a` 同名怎麼辦 ?
A : `a` 存取函式，`_a` 存取變數

---

1. https://github.com/hookmaster/frida-all-in-one
2. [How to access class member variable if there's a member function called the same name?](https://github.com/frida/frida/issues/833)