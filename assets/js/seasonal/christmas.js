$(function(){
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
});