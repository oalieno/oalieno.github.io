---
title: "【Windows Security】MpDlpCmd.exe"
date: 2022-11-01
categories:
- 資安
tags:
- windows
- windows defender
---

## MpDlpCmd.exe

This executable is located under `C:\ProgramData\Microsoft\Windows Defender\Platform\v.vv.vvvv.v-v`
It seems to be related to Data Loss Prevention (DLP).

There is no manual anywhere. Only a short message `Usage: MpDlpCmd -<Command>`
I decided to open IDA Pro to do some reverse engineering.

{% img /images/MpDlpCmd-ida.png 'MpDlpCmd IDA reverse engineering' %}

From the decompiled code, we can clearly see that there are three parameters.
- `-h / -?`: print usage
- `-ShowDlpDetailsDialog`
- `-TestDlpDetailsDialog`

## -ShowDlpDetailsDialog

With `-ShowDlpDetailsDialog`, there will be error message `MpDlpCmd: Failed with hr = 0x80004005.`.
Not sure what is happening.

## -TestDlpDetailsDialog

With `-TestDlpDetailsDialog`, we can get below window.

{% img /images/MpDlpCmd-TestDlpDetailsDialog.png 'MpDlpCmd with parameter -TestDlpDetailsDialog' %}
