class InfiniteScroll {
    constructor(content_container, loading_element, base_url) {
        this.content_container = $(content_container);
        this.base_url = base_url;
        this.loading_element = $(loading_element);
        this.current_page = 1;
        this.is_active = true;
        this.is_loading = false;

        this._hide_loading();
    }

    _show_loading() {
        this.loading_element.fadeIn();
    }

    _hide_loading() {
        this.loading_element.fadeOut();
    }

    _add_posts(posts) {
        posts.hide();
        this.content_container.append(posts);
        posts.fadeIn();
    }

    _fetch_page(url) {
        let scroller = this;
        $.ajax({
            'url': url,
            'dataType': 'html',
            'success': function(data) {
                let posts = $(data).find('.post-summary');
                if (posts.length > 0) { 
                    scroller._add_posts(posts);
                    scroller.current_page++;
                    scroller._hide_loading();
                }
                scroller.is_loading = false;
            },
            'error': function(xhr, ajaxOptions, thrownError) {
                if (xhr.status == "404") {
                    scroller.is_active = false;
                    scroller.is_loading = false;
                    scroller._hide_loading();
                }
            }
        });
    }

    get_next_page() {
        if (this.is_active && !this.is_loading) {
            this.is_loading = true;
            this._show_loading();

            let next_page = this.current_page + 1;
            let url = this.base_url + next_page + '/';

            this._fetch_page(url);
        }
    }
}