# elasticdump - es_rejected_execution_exception error

在我用 elasticdump 把資料丟進 Kibana 的時候發生了 `es_rejected_execution_exception` 這個錯誤  
上網查發現是 queue 塞滿了，但我不知道怎麼把 queue 調高一點  
看了看 elasticdump 的 help 頁面，發現了 `--maxSockets` 這個選項，預設是 5

```
--maxSockets
                    How many simultaneous HTTP requests can we process make?
                    (default:
                      5 [node <= v0.10.x] /
                      Infinity [node >= v0.11.x] )
```

把它調成 1，他就不會發那麼快把 queue 塞爆啦

```bash
elasticdump --output="http://localhost:9200/my_index" --input=./index.json --type=data --maxSockets 1
```
