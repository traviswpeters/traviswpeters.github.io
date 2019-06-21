---
layout: post
title: Data Science Cheatsheet
---

See DevOps Cheatsheet for info on using/building Docker containers for an ideal data science environment.

# Reading & Tutorials

## DONE

==[Python Data Science Handbook](https://jakevdp.github.io/PythonDataScienceHandbook/) - 
Specifically, see Jupyter Notebooks, exercises, and ***"Chapter 5. Machine Learning."***==

[The Hitchhiker’s Guide to Feature Extraction](https://towardsdatascience.com/the-hitchhikers-guide-to-feature-extraction-b4c157e96631) 

## TODO

Statistics is the Grammar of Data Science - 
[Part 1/5](https://towardsdatascience.com/statistics-is-the-grammar-of-data-science-part-1-c306cd02e4db), 
[Part 2/5](https://towardsdatascience.com/statistics-is-the-grammar-of-data-science-part-2-8be5685065b5), 
[Part 3/5](https://towardsdatascience.com/statistics-is-the-grammar-of-data-science-part-3-5-173fdd2e18c3), 
[Part 4/5](https://towardsdatascience.com/statistics-is-the-grammar-of-data-science-part-4-5-e9b1ce651064), 
[Part 5/5](https://towardsdatascience.com/statistics-is-the-grammar-of-data-science-part-5-5-3f6099faad04)

Machine Learning Algorithms In Layman’s Terms - 
[Part 1](https://towardsdatascience.com/machine-learning-algorithms-in-laymans-terms-part-1-d0368d769a7b), 
[Part 2](https://towardsdatascience.com/machine-learning-algorithms-in-laymans-terms-part-2-a0a74df9a9ac)

Choosing the Right Metric for Evaluating Machine Learning Models - 
[Part 1](https://medium.com/usf-msds/choosing-the-right-metric-for-machine-learning-models-part-1-a99d7d7414e4), 
[Part 2](https://medium.com/usf-msds/choosing-the-right-metric-for-evaluating-machine-learning-models-part-2-86d5649a5428)


[SMOTE and ADASYN (Handling Imbalanced Data Set)](https://medium.com/coinmonks/smote-and-adasyn-handling-imbalanced-data-set-34f5223e167)

[Estimating Probabilities with Bayesian Modeling in Python](https://towardsdatascience.com/estimating-probabilities-with-bayesian-modeling-in-python-7144be007815)

[Multiple Linear Regression with Python](https://stackabuse.com/multiple-linear-regression-with-python/)

# Concepts

Eigenvectors & Eigenvalues

Principle Component Analysis


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
