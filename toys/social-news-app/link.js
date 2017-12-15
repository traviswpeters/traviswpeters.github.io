////////////////////////////////////////////////////////////////////////////////
// LINK OBJECT /////////////////////////////////////////////////////////////////

module.exports = class Link {

    constructor(title, url, author) {
        this.title = title;
        this.url = this.standardizeURL(url);
        this.author = author; // "submitter"
    }

    // Return the URL with http:// or https:// (default: http://)
    standardizeURL(url) {
        const defaultPrefix = 'http://';
        const isHTTP = url.startsWith("http://");
        const isHTTPS = url.startsWith("https://");
        if (isHTTP || isHTTPS) {
            return url;
        } else {
            return defaultPrefix+url;
        }
    }

    // This HTML is only that which resides *within* its containing `div` element.
    getHTML() {
        var html = '';
        html += `<h4 class="linkHeadline"><a class="linkTitle" href="${this.url}">${this.title}</a> <span class="linkUrl">${this.url}</span></h4>`;
        html += `<span class="linkAuthor">Submitted by ${this.author}</span>`;
        return html;
    }

    // A debug string of the Link object
    logStr() {
        return `- ${this.title} - ${this.url} (submitted by ${this.author})`;
    }

}
