$(document).ready(function () {

    $("#query_consumer").autocomplete({
        source: function (request, response) {

            $.ajax({
                url: "/magic/consume/wikipedia/search/" + request.term,
                dataType: "json",
                success: function (data) {
                    response($.map(data, function (item) {
                        return {
                            label: item,
                            value: item
                        }
                    }));
                }
            });
        },
        minLength: 3,
        select: function (event, object) {

            $.ajax({
                url: "/magic/consume/wikipedia/find/" + object.item.value,
                dataType: "json",
                success: function (data) {

                    var html = "";
                    var extraction = "<h2>Vue d'ensemble</h2>" + data.extract;
                    var images = data.images;
                    // passage en accordion
                    var accordion = '<div class="panel-group" id="accordion">%section%</div>';
                    var section = '<div class="panel panel-default">%section_header%%section_content%</div>';
                    var section_header = '<div class="panel-heading"><h4 class="panel-title"><a data-toggle="collapse" data-parent="#accordion" href="#%collapse_id%">%title%</a></h4></div>';
                    var section_content = '<div id="%collapse_id%" class="panel-collapse collapse %in%"><div class="panel-body">%content%</div></div>';
                    var section_images = '<div class="section_image pull-left"><img width="100px" src="%image%" /></div>';

                    var titles = extraction.split('<h2>');
                    $.each(titles, function (i, item) {
                        if (item) {
                            item = "<h2>" + item;

                            var collapse_id = "section-" + i;
                            // how can it work ???
                            var title = $(item).html();

                            if (i == 1) {
                                var collapse_in = "in"
                            } else {
                                var collapse_in = "";
                            }
                            html += accordion.replace('%section%', section.replace('%section_header%', section_header.replace('%collapse_id%', collapse_id).replace('%title%', title))).replace('%section_content%', section_content.replace('%collapse_id%', collapse_id).replace('%content%', item).replace('%in%', collapse_in));
                        }
                    });

                    var html_image = "";
                    $.each(images, function (i, item) {
                        if (i < 5) {
                            html_image += section_images.replace('%image%', item);
                        }
                    });

                    $('.wikipedia-definition').html(html);
                    $('.wikipedia-definition h2').remove();
                    $('.wikipedia-images').html(html_image);
                    $('.wikipedia-images').height($('.wikipedia-definition').height());

                }
            });
        }
    });

});