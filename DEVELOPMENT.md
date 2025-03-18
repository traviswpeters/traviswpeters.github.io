# Development Notes

## Debugging Jekyll

When in doubt a quick and easy way to debug liquid variables is to pipe it into `jsonify` and render the result on the page:

```
{{ my.site.variable | jsonify }}
```

Where `my.site.variable` is substituted with the variable of interest.

## Site Variables Reference

Jekyll maintains many variables beyond those explicitly defined in `_config.yml` and `_data/*.yml` files.
A complete list of "site" and "page" related variables can be found here: [https://jekyllrb.com/docs/variables/](https://jekyllrb.com/docs/variables/).

Some useful debug snippets:

```yml
site.time: {{ site.time | inspect }}
site.url: {{ site.url | inspect }}
site.posts: {{ site.posts | inspect }}
site.related_posts: {{ site.related_posts | inspect }}
site.static_files: {{ site.static_files | inspect }}
site.html_pages: {{ site.html_pages | inspect }}
site.html_files: {{ site.html_files | inspect }}
site.collections: {{ site.collections | inspect }}
site.data: {{ site.data | inspect }}
site.documents: {{ site.documents | inspect }}
site.categories: {{ site.categories | inspect }}
site.tags: {{ site.tags | inspect }}
```

## Resources

- [Jekyll Documentation](http://jekyllrb.com/docs/home)
- [Jekyll GitHub Repository](https://github.com/jekyll/jekyll)
- [Jekyll Talk Forum](https://talk.jekyllrb.com/)
- [Jekyll Themes](http://jekyllthemes.org/)
- [Liquid for Designers](https://github.com/shopify/liquid/wiki/Liquid-for-Designers)
- [Liquid for Programmers](https://github.com/Shopify/liquid/wiki/Liquid-for-Programmers)