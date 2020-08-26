// Usage
// To allow an image to be clicked into a larger view, wrap it in a div with
// the class of .gallery-image
//
// To group several of these gallery-images together in a set, which will allow
// scrolling through the set with arrows (eventually), wrap the .gallery-images
// in a div with the class of .gallery-set

// Maybe use bootstrap modals for the UI of this, seen as most of the 
// work already done
$(function(){
    // Need to remove this and build it properly as a reusable
    // component
    let viewer = $('#gallery-viewer');
    viewer.appendTo('#page');

    $(document).on('click', '.gallery-image', function(){
        let img = $(this).find('img').clone();
        viewer.html(img);
        viewer.removeClass('d-none');
    });

    $(document).on('click', '#gallery-viewer', function(){
        viewer.addClass('d-none');
    });
});
