////////////////////////////////////////////////////////////////////////////////
// LINK LIST OBJECT (STORAGE) //////////////////////////////////////////////////

// var Link = require('./link.js');

var linkList = {

    links: [],

    addLinkToTop: function(link) {
        this.links.unshift(link);
    },

    addLink: function(link) {
        this.links.push(link);
    },

    dump: function() {
        this.links.forEach(link => {
            console.log(link.logStr());
        })
    }

};

// Export the factory function
module.exports = linkList;
