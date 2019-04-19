---
layout: post
title: My WebApp & WebSec Cheatsheet
---

Miscellaneous snippets, readings, tools, and tips.
This is pretty Node.js and Javascript-specific since these are my preferred tools for webdev.

## Create a Node.js project

```bash
mkdir my-awesome-new-project && cd my-awesome-new-project && npm init -y
```

## Check your Node.js environment variables

The Node.js `PATH` should update `$PATH` to look in `node_modules/.bin`.

Set `NODE_ENV` to be either `production` or `staging`.

See `process.env` to view/modify other environment variables.

Use tools like [nconf](https://github.com/indexzero/nconf) for management server configuration.

## Dev Tools

* ***[npm](https://www.npmjs.com/)*** vs. [yarm](https://yarnpkg.com/en/)
* ***[Parcel](https://parceljs.org/)*** vs. [Webpack](https://webpack.js.org/)

Parcel seems to be the favorite for small to medium sized projects (<15k lines of code).
```bash
npm install parcel-bundler --save-dev
touch index.html index.js
parcel index.html #or `parcel watch index.html`
```

**index.html:**
```html
<html>
<body>
  <script src="./index.js"></script>
</body>
</html>
```
**index.js:**
```js
console.log("hello world");
```

## Misc. Tools

* [placeholder.com](https://placeholder.com/) - Just put your image size after our URL and you'll get a placeholder image.

## CSS

I am far from good at making things look beautiful but I have come across some helpful and interesting resources.
Links and notes below.
While I prefer working on the functional aspects of things like websites and webapps,
    the presentation shouldn't be too distracting (read: too *ugly*).

**Flexbox**
* [x] (!) [Basic concepts of flexbox](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Flexible_Box_Layout/Basic_Concepts_of_Flexbox)
* [x] [Typical use cases of flexbox](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Flexible_Box_Layout/Typical_Use_Cases_of_Flexbox)
* [ ] [Relationship of flexbox to other layout methods](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Flexible_Box_Layout/Relationship_of_Flexbox_to_Other_Layout_Methods)

**Grid**
* [x] (!) [Basic concepts of grid layout](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Grid_Layout/Basic_Concepts_of_Grid_Layout)
* [ ] [Relationship of grid layout to other layout methods](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Grid_Layout/Relationship_of_Grid_Layout)
* [x] [CSS Grid Layout secrets revealed](http://www.creativebloq.com/features/css-grid-layout-secrets-revealed)
    * There are [many other interesting-looking posts by Rachel Andrew on her website](https://rachelandrew.co.uk/archives/).

**Other**
* [ ] (!) http://cs52.me/lectures/03_css/
* [ ] (!) https://learn.shayhowe.com/html-css/
* [ ] http://cssreference.io/
* [ ] http://www.flexboxdefense.com/
* [ ] http://www.flexboxpatterns.com/home
* [x] [BEM (Block-Element-Modifier) Naming Conventions](https://css-tricks.com/bem-101/)
    * `.BLOCK__ELEMENT--MODIFIER`
    * A **BLOCK** is a top-level abstraction of a new component
    * Child items, or **ELEMENTS**, can be placed inside
    * **MODIFIERS** can manipulate the block so that we can theme or style that particular component w/o affecting an unrelated module.
* [ ] Color Scheme Chooser - https://color.adobe.com/create/color-wheel/
* [x] [A Complete Guide to Flexbox](https://css-tricks.com/snippets/css/a-guide-to-flexbox/)
    * NOTE: Flexbox is for 1D layouts
    * NOTE: Content first
* [x] [A Complete Guide to Grid](https://css-tricks.com/snippets/css/complete-guide-grid/)
    * NOTE: Grid is for 2D layouts
    * NOTE: Layout first
* [x] [Holy Grail Layout (Responsive & Mobile-first)](https://philipwalton.github.io/solved-by-flexbox/demos/holy-grail/)
* [x] [The 30 CSS Selectors You Must Memorize](https://code.tutsplus.com/tutorials/the-30-css-selectors-you-must-memorize--net-16048)
    * `#X` - selector to target by **id**
    * `.X` - selector to target by **class**
    * *PRO-TIP: Using IDs is rigid. Prefer to try to select elements by class or tag names. Use IDs only when absolutely necessary.*
    * `a:link`, `a:visted` - select links that have not been clicked and that have been clicked, respectively.
    * `X + Y` - an "adjacent selector." It will select only the element that is immediately preceded by the former element.
    * `X > Y` - only select direct children.
    * `X ~ Y` - select any Y elements, as long as they follow a X element.
    * `X[title]` - only select the X tags that have a "title" attribute (replace "title" with other attributes)
    * `X:hover` - apply specific styling when a user hovers over an X element.
    * *PRO-TIP: When applying hover styles (e.g., `a:hover { border-bottom: 1px solid black; }`)
    `border-bottom: 1px solid black;` looks better than `text-decoration: underline;`*
    * `X:nth-child(n)` - target specific elements in a stack (one-based, not zero-based indexing). Varients:
        * `X:nth-child(4n)` - targets every 4th element, for example.
        * `X:nth-last-child(3n)` - access, say, the third to the last item
    * `X Y:first-child` - target only the first child of the element's parent
    * `X Y:last-child` - target only the last child of the element's parent
* [x] [Centering Things](https://www.w3.org/Style/Examples/007/center.en.html)
* [x] [A Chart Comparing Font Styles](https://www.w3.org/Style/Examples/007/fonts)
* [x] [Learn CSS Grid for free (Scrimba course)](https://scrimba.com/g/gR8PTE)
    * Use `fr` (fractional units) to specify how to divide up the total width amongst the columns.
    * If you want uniformity, use e.g., `repeat(3, 1fr)` to make 3 columns equally wide.
    * The shorthand for CSS grids uses a `/` between definitions.
    E.g., `grid-column: 1 / 3;` (column line 1 to column line 3) and `grid-template: 2 / 3;` (2 rows, 3 columns).
    * Use `span` to describe how many columns/rows some definition should span.
    * Trick: use `grid-column: 1 / -1;` to span *all* columns when you don't necessarily know how many columns there are.
    * [Bonus: Creating an Article Layout](https://scrimba.com/p/pWqLHa/cdp76sD)
* [x] [(Fonts) Google Fonts](https://fonts.google.com/)
    * Pick your font(s).
    * Embed links to your styles.
    * Add style in your style sheet file(s).
* [x] [(Icons) FontAwesome](http://fontawesome.io/)
    * You can use the CDN but it is probably easiest to just download the entire FA library into your project.
    * Link to it in the `head` of your HTML file: `<link rel="stylesheet" href="path/to/font-awesome/css/font-awesome.min.css">`.
* *NOTE: Margin-Border-Padding (content) Padding-Border-Margin - these are the "boxes" around content and their order; think "MBP" - "Most Beautiful Player" (since we are talking about styles and "looks" of a webpage, why not use a similar mnemonic to remember the order).*
* [x] [Masonry Layout](https://masonry.desandro.com/layout.html)

See Grids: [https://traviswpeters.github.io/toys/grids/](https://traviswpeters.github.io/toys/grids/)

## Security Reading

* [ ] [Challenges for web developers](https://paul.kinlan.me/challenges-for-web-developers/)
* [ ] [Awesome Security](https://github.com/sbilly/awesome-security) (a great list of resources!)
* [ ] [Node.js Security Checklist](https://blog.risingstack.com/node-js-security-checklist/)
* [ ] [Avoid Command Injection in Node.js (2014)](https://blog.liftsecurity.io/2014/08/19/Avoid-Command-Injection-Node.js/)
* [ ] [Web Application Security Testing Cheat Sheet](https://www.owasp.org/index.php/Web_Application_Security_Testing_Cheat_Sheet)
* [ ] [Building Secure JavaScript Applications](https://nemethgergely.com/building-secure-javascript-applications/)
* [ ] [Content Security Policies](https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP)
* [ ] [Part 2: How to stop me harvesting credit card numbers and passwords from your site](https://hackernoon.com/part-2-how-to-stop-me-harvesting-credit-card-numbers-and-passwords-from-your-site-844f739659b9)
* Anything OWASP. See Cheat Sheets, specifically.

## Security Tools

* [Let's Encrypt - a free, automated, and open CA](https://letsencrypt.org/)
* [Helmet](https://github.com/helmetjs/helmet) (helps you secure your Express apps)
* [Rate-limiting](https://www.npmjs.com/package/ratelimiter) (brute force protection)
* [cookies](https://www.npmjs.com/package/cookies) & [cookie-session](https://www.npmjs.com/package/cookies) (for secure session management)
* [Cross-Site Request Forgery module](https://www.npmjs.com/package/csrf)
* [sqlmap](http://sqlmap.org/) (sql injection pentest tool)
* nmap & [SSLyze](https://github.com/nabla-c0d3/sslyze) (for analyzing the SSL configuration of a server)
* [requireSafe](https://www.npmjs.com/package/requiresafe) (helps you keep your node applications secure)
* [snyk](https://snyk.io/) (continuously find & fix vulnerabilities in your dependencies)

```bash
nmap --script ssl-cert,ssl-enum-ciphers -p 443,465,993,995 www.example.com # Checking for Certificate information
./sslyze.py --regular example.com:443 # Testing SSL/TLS vulnerabilities with sslyze
curl -s -D- https://twitter.com/ | grep -i Strict # Testing Strict-Transport-Security header and enforcement
```

## Security Tips

* *Always* filter/sanitize user inputs.
