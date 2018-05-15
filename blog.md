---
layout: page
title: Blog
---

<div style="text-align: center" markdown="1">
[[toggle compact view]]({{ site.github.url }}/blog-compact.html)
</div>

<div style="text-align: center; margin-bottom: 50px;" markdown="1">
*I'm still in the process of porting old notes/posts to this site. Check back soon!*
</div>

{% for post in site.posts %}
<div class="posts">
  <h1>
    <a href="{{ site.github.url }}{{ post.url }}">{{ post.title }}</a>
  </h1>
  {% comment %}
  <!-- {% if post.image.teaser %}
    <a class="teaser" href="{{ site.github.url }}{{ post.url }}"><img src="{{ site.github.url }}/assets/img/{{ post.image.teaser }}"></a>
  {% endif %} -->
  {% endcomment %}
  <p class="posts-teaser-text">
    {{ post.content | markdownify | strip_html | truncate: 350 }} <a href="{{ site.github.url }}{{ post.url }}">>> Read more</a>
  </p>
  <span class="post-date">
    <i class="fa fa-calendar" aria-hidden="true"></i> {{ post.date | date_to_string }} -
    <i class="fa fa-clock-o" aria-hidden="true"></i>{% include read-time.html %}
  </span>
</div>
{% endfor %}

{% comment %}
<!-- Pagination links -->
<div class="pagination">
  {% if paginator.next_page %}
    <a class="pagination-button pagination-active" href="{{ site.github.url }}{{ paginator.next_page_path }}" class="next">Older</a>
  {% else %}
    <span class="pagination-button">Older</span>
  {% endif %}

  {% if paginator.previous_page %}
    <a class="pagination-button pagination-active" href="{{ site.baseurl }}{{ paginator.previous_page_path }}">Newer</a>
    {% else %}
      <span class="pagination-button">Newer</span>
  {% endif %}
</div>
{% endcomment %}
