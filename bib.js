$( document ).ready(function() {
    // Handler for .ready() called.
    // $('.references div p').each(function(index, object) {
    // TODO: manipulate/re-format the text in-line to pretty-ify it?
    //     console.log($(this).html());
    // });

    // Special handling for toggling visibility of the Abstract
    $('.abstract-text-container').each(function(index, object) {

        // construct a unique ID for this element based on its ref details
        target_id = 'collapsing-abstract-'+index;

        // convenience handles to abstract div containing the text
        abstract_div = object;
        $(abstract_div).attr('id', target_id);

        // convenience handles to abstract btn (which is used to toggle visibility of the abstract))
        abstract_btn = object.previousSibling.previousSibling; // HACK: skip over first previousSibling ("text")
        $(abstract_btn).attr('data-target', '#'+target_id);

        abstract_btn = object.previousSibling; // HACK: skip over first previousSibling ("text")
        $(abstract_btn).attr('data-target', '#'+target_id);

    });
});
