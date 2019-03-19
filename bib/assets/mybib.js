$( document ).ready(function() {
    // Handler for .ready() called.

    // Special handling for toggling visibility of the Abstract
    $('.abstract-text-container').each(function(index, object) {

        // construct a unique ID for this element based on its ref details
        // parent_id = $(object).parent().attr('id');
        // target_id = 'collapsing-abstract-'+index+'-'+parent_id;
        target_id = 'collapsing-abstract-'+index;

        // convenience handles to objects abstract button/text
        abstract_div = object;

        // abstract_btn = object.previousSibling; // HACK: skip over first previousSibling ("text") 
        // --> need this line when using DIV

        abstract_btn = object.previousSibling; // HACK: skip over first previousSibling ("text") 
        // --> need this line when using SPAN

        $(abstract_btn).attr('data-target', '#'+target_id)        
        $(abstract_div).attr('id', target_id)
    });
});
