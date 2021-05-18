---
layout: default
title: Home
permalink: /
---

<!-- https://hackerthemes.com/bootstrap-cheatsheet/ -->

<!-- Row 1 -->
<div class="row">

<div class="col-md-3 order-1 mt-3" markdown="1">
{% include contact.html %}
</div>

<div class="col-md-9 order-2 mt-3" markdown="1">
{% include about.html %}
</div>

</div>

<!-- Row 2 -->
<div class="row">

<div class="col-md-3 order-3" markdown="1">
{% include news.html num=5 %}
{%comment%}
{% include links.html %}
{%endcomment%}
</div>

<div class="col-md-9 order-4" markdown="1">
{% include education.html %}
{% include teaching.html %}
{% include publicationsV2.html %}
{% include activities.html %}
{% include awards.html %}
</div>

</div>
