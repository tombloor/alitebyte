$(function(){
    let hide_snow = localStorage.getItem('hide_snow') == 'true';

    if (!hide_snow) {
        let_it_snow();
    }

    setup_snow_switch(hide_snow);
});

function let_it_snow() {
    let sno_machine_1 = $("<div class='snow snow-1'>");
    let sno_machine_2 = $("<div class='snow snow-2'>");
    let sno_machine_3 = $("<div class='snow snow-3'>");

    let sno_machine_1_alt = $("<div class='snow snow-1 snow-alt'>");
    let sno_machine_2_alt = $("<div class='snow snow-2 snow-alt'>");
    let sno_machine_3_alt = $("<div class='snow snow-3 snow-alt'>");

    let snos = [
        sno_machine_1, sno_machine_2, sno_machine_3,
        sno_machine_1_alt, sno_machine_2_alt, sno_machine_3_alt
    ];

    $.each(snos, function(i, el) {
        let lite = $(this).clone();
        lite.addClass('snow-lite');

        $('#side-nav').append($(this));
        $('#top-nav').append(lite);
    });

    localStorage.setItem('hide_snow', 'false');
}

function snow_plough() {
    $('.snow').remove();

    localStorage.setItem('hide_snow', 'true');
}

function setup_snow_switch(hide_snow) {
    let form = $("<form class='hide_snow_form'>");
    let container = $("<div class='custom-control custom-switch'>");

    let input = $("<input type='checkbox' class='custom-control-input' id='hide_snow'>");
    if (!hide_snow) {
        input.prop('checked', 'checked');
    }
    let label = $("<label class='custom-control-label' for='hide_snow'>");
    label.html('Snow Machine');

    container.append(input);
    container.append(label);

    form.append(container);
    form.insertBefore('#side-nav-content .social-links');

    // Tweak Ids for the top nav clone
    top_form = form.clone();
    top_form.find('input').attr('id', 'hide_snow_m');
    top_form.find('label').attr('for', 'hide_snow_m');
    top_form.insertBefore('#top-nav-content .social-links');

    //Bind events
    $('.hide_snow_form input').on('click', function(){
        let on = $(this).prop('checked');
        //Sync other switch
        $('.hide_snow_form input').attr('checked', on);

        if (on) {
            let_it_snow();
        } else {
            snow_plough();
        }
    });
}