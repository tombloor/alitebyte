class InfiniteScroll {
    constructor(content_container, loading_element, base_url) {
        this.content_container = $(content_container);
        this.base_url = base_url;
        this.loading_element = $(loading_element);
        this.current_page = 1;

        this._hide_loading();
    }

    _show_loading = function() {
        this.loading_element.show();
    }

    _hide_loading = function() {
        this.loading_element.hide();
    }

    _fetch_page = function(page_number) {

    }

    _add_posts = function(posts) {

    }

    get_next_page = function() {

    }
}