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

[Eigenvectors & Eigenvalues](https://en.wikipedia.org/wiki/Eigenvalues_and_eigenvectors)
> In linear algebra, an eigenvector or characteristic vector of a linear transformation is a non-zero vector that changes by only a scalar factor when that linear transformation is applied to it.
> 
> In essence, an eigenvector $v$ of a linear transformation $T$ is a non-zero vector that, when $T$ is applied to it, does not change direction. Applying $T$ to the eigenvector only scales the eigenvector by the scalar value $λ$, called an eigenvalue. This condition can be written as the equation
>
> $T(\mathbf {v} )=\lambda \mathbf {v} ,$
>
> referred to as the eigenvalue equation or eigenequation. In general, $λ$ may be any scalar.

[Principle Component Analysis](https://en.wikipedia.org/wiki/Principal_component_analysis)
> Principal component analysis (PCA) is a statistical procedure that uses an orthogonal transformation to convert a set of observations of possibly correlated variables (entities each of which takes on various numerical values) into a set of values of linearly uncorrelated variables called principal components. If there are $n$ observations with $p$ variables, then the number of distinct principal components is $min(n−1,p)$. This transformation is defined in such a way that the first principal component has the largest possible variance (that is, accounts for as much of the variability in the data as possible), and each succeeding component in turn has the highest variance possible under the constraint that it is orthogonal to the preceding components. The resulting vectors (each being a linear combination of the variables and containing n observations) are an uncorrelated orthogonal basis set.


[Pearson Correlation Coefficient](https://en.wikipedia.org/wiki/Pearson_correlation_coefficient) 
> A measure of the linear correlation between two variables X and Y. According to the Cauchy–Schwarz inequality it has a value between +1 and −1, where 1 is total positive linear correlation, 0 is no linear correlation, and −1 is total negative linear correlation. It is widely used in the sciences. 
> 
> Pearson's correlation coefficient is the covariance of the two variables divided by the product of their standard deviations.

### Later...

[Shapiro–Wilk test](https://en.wikipedia.org/wiki/Shapiro–Wilk_test)
> The Shapiro–Wilk test is a test of normality in frequentist statistics.
>
> The null-hypothesis of this test is that the population is normally distributed. Thus, on the one hand, if the p value is less than the chosen alpha level, then the null hypothesis is rejected and there is evidence that the data tested are not normally distributed. On the other hand, if the p value is greater than the chosen alpha level, then the null hypothesis that the data came from a normally distributed population can not be rejected.

[Spearman's rank correlation coefficient](https://en.wikipedia.org/wiki/Spearman's_rank_correlation_coefficient)
> The Spearman correlation between two variables is equal to the Pearson correlation between the rank values of those two variables; while Pearson's correlation assesses linear relationships, Spearman's correlation assesses monotonic relationships (whether linear or not). If there are no repeated data values, a perfect Spearman correlation of +1 or −1 occurs when each of the variables is a perfect monotone function of the other.
> 
> Intuitively, the Spearman correlation between two variables will be high when observations have a similar (or identical for a correlation of 1) rank (i.e. relative position label of the observations within the variable: 1st, 2nd, 3rd, etc.) between the two variables, and low when observations have a dissimilar (or fully opposed for a correlation of −1) rank between the two variables.

[Pareto Efficiency](https://en.wikipedia.org/wiki/Pareto_efficiency)

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
