class InfiniteScroll {
    constructor(content_container, loading_element, base_url) {
        this.content_container = $(content_container);
        this.base_url = base_url;
        this.loading_element = $(loading_element);
        this.current_page = 1;

        this._hide_loading();
    }

    _show_loading() {
        this.loading_element.show();
    }

    _hide_loading() {
        this.loading_element.hide();
    }

    _add_posts(posts) {
        this.content_container.append(posts);
    }

    _fetch_page(url) {
        let scroller = this;
        $.ajax({
            'url': url,
            'dataType': 'html',
            'success': function(data) {
                let posts = $(data).find('.post-summary');
                console.log(posts.length + ' posts loaded');
                if (posts.length > 0) { 
                    scroller._add_posts(posts);
                    scroller.current_page++;
                    scroller._hide_loading();
                }
            },
            'error': function(message, status, xhr) {
                // This means the next page wasn't found. Later we'll disable 
                // the infinite scroll as we've reached the end
            }
        });
    }

    get_next_page() {
        this._show_loading();

        let next_page = this.current_page + 1;
        let url = this.base_url + next_page;

        this._fetch_page(url);
    }
}