---
layout: page
title: Research
---

<!--
Broadly speaking, I'm interested in ....
More specifically, I'm intersted in ...
 -->

I’m interested in (in)security, particularly at the lower levels of systems and wireless communications.
I’ve spent a great deal of time studying operating systems and trusted hardware (SGX and TrustZone in particular).
I became interested in these topics more as I began studying solutions for realizing secure I/O capabilities that can work with these trusted hardware features.
To that end, I’ve been particularly interested in wireless I/O devices such as those that connect with, for example, mobile devices such as smartphones over Bluetooth.
I’m increasingly interested in the existence of physical side channels — both understanding the attacks that exist because of them, as well as how they can be used to solve problems.

Ultimately, all of this ties into work that myself and my group have been doing around security- and privacy-oriented problems in the mobile healthcare domain.
Our focus is increasingly shifting towards a broader IoT security agenda.

<!-- I'm on the job market!
My interests and skills make me a suitable candidate for teams working in
Trustworthy Infrastructure, Protecting User Data, and Malicious and Deceptive Software -->
<!-- (vocabulary borrowed from the google projects/team page regarding research areas in Google Security, Privacy & Abuse Research.).  -->

<!-- <h4>Have a look at some of my <a href="{{ site.baseurl }}research.html"> work</a>.</h4>
<h4>You can also see what's been going on lately in my <a href="{{ site.baseurl }}news.html">news feed</a>.</h4>
<h4>For more check out my academic &amp; professional <a href="{{ site.baseurl }}vita.pdf">CV</a>.</h4>
<!-- <h4>For more check out my academic &amp; professional <a href="http://biomadeira.github.io/vitae">CV</a>.</h4> -->
<!-- <h4>I also <a href="{{ site.baseurl }}blog.html">write about miscellaneous stuff</a> at times.</h4>
<h4>If you want to chat, reach out!</h4> -->

## Publications

{% assign thumbnail="left" %}

{% for pub in site.data.papers %}
{% if pub.image %}
{% include image.html url=pub.image caption="" height="100px" align=thumbnail %}
{% endif %}
[**{{pub.title}}**]({% if pub.internal %}{{pub.url | prepend: site.baseurl}}{% else %}{{pub.url}}{% endif %})<br />
*{{pub.publisher}}* <br />
{{pub.authors}}<br />
{% if pub.note %} *({{pub.note}})*{% endif %}
{% if pub.year %}*{{pub.year}}*{% endif %}
{% if pub.doi %}[[doi]({{pub.doi}})]{% endif %}
{% if pub.media %}<br />Media: {% for article in pub.media %}[[{{article.name}}]({{article.url}})]{% endfor %}{% endif %}
{% endfor %}

## Select Projects

{% for pub in site.data.projects %}

{% if pub.image %}
{% include image.html url=pub.image caption="" height="100px" align=thumbnail %}
{% endif %}
<!-- URL links to project repo; PDF links to paper -->
<!-- No URL; Make title link to same destination as the PDF -->
<!-- No URL; No PDF; Just diplay the title -->
{% if pub.url %}[**{{pub.title}}**]({% if pub.internal %}{{pub.url | prepend: site.baseurl}}{% else %}{{pub.url}}{% endif %}) <br/>{% else if pub.pdf %}[**{{pub.title}}**]({{pub.pdf}}) <br/>{% else %}**{{pub.title}}** <br/>{% endif %}
{{pub.desc}}{% if pub.pdf %} [[pdf]({{pub.pdf}})]{% endif %} {% if pub.doc %}[[doc]({{pub.doc}})]{% endif %}

{% endfor %}
