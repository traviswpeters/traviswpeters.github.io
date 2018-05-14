---
layout: default
title: All
---

<div class="about grid-item-about" markdown="1">
{% comment %}
<!-- see: _includes/about.html -->
{% endcomment %}
{% include about.html url="../assets/img/me.png" caption="" max_width="300px" align="left" %}
</div>

<div class="news grid-item-news" markdown="1">
{% comment %}
<!-- see: _includes/news-short.html & _includes/news.html -->
<!-- TODO: consider including the news-short.html HERE and deleting the separate include file -->
{% endcomment %}
{% include news-short.html %}
</div>

<div class="publications grid-item-publications" markdown="1">
{% comment %}
<!-- see: _includes/publications.html -->
{% endcomment %}
{% include publications.html %}
</div>

<div class="presentations grid-item-presentations" markdown="1">
{% comment %}
<!-- see: _includes/presentations.html -->
{% endcomment %}
{% include presentations.html %}
</div>

<div class="teaching grid-item-teaching" markdown="1">
{% comment %}
<!-- see: _includes/teaching.html -->
{% endcomment %}
{% include teaching.html %}
</div>
