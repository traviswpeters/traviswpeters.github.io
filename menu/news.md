---
layout: page
title: News
---
<!-- A dedicated news page -->

{% for news in site.data.news %}
<!-- {{ news.date | date: "%B %e, %Y" }} -->
**({{ news.date | date: "%B %Y" }})**
{{ news.descr | markdownify | replace: '<p>', '' | replace: '</p>', '' }}
{% endfor %}
