---
layout: post
title: Data Science Cheatsheet
---

See DevOps Cheatsheet for info on using/building Docker containers for an ideal data science environment.

# Working with Data

```bash
pip install csvkit
# OR brew info csvkit
cat FILE | csvlook
cat FILE | csvstat
csvjson FILE --indent 4

# randomly sample dataset
seq 10000 | sample -r 1% -d 1000 -s 5 | jq -c '{line: .}'

# show just the first 79 characters (columns) of each line
head -n 10 data/wiki.html | cut -c1-79
```
