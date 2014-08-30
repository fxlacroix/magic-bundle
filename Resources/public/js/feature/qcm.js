// base 1 sec.
var QuestionInterval,
    questionTime,
    containerQuestion,
// global Id very bad
    globalId = true,
    globalTimer = true;


/**
 * start exam
 *   -> create timer
 */
function startExam() {

    try {
        // launch (first question)
        findQuestion(true);

        $("a.btn.next").click(function () {
            findQuestion();
        });
        $("a.btn.stop").click(function () {
            stopExam();
        });
        $("a.btn.finish").click(function () {
            finishExam();
        });

    } catch (e) {
        // stop all todo: all interval ?
        clearInterval(QuestionInterval);
    }
}

/**
 * find next question
 *   -> stop exam
 *   -> create timer
 */
function findQuestion(isFirstQuestion) {


    if (isFirstQuestion) {
        $containerQuestion = $(".container-question").first();
        globalId = $containerQuestion.attr("itemid");
    } else {
        $containerQuestion = $("#container-question-" + globalId + " ~ div.container-question").first();
    }

    if ($containerQuestion.length == 0 && globalId) {

        $("#container-question-" + globalId).hide('slow');
        finishExam();
    }

    clearInterval(QuestionInterval);
    $("#container-question-" + globalId).parent().mask();

    $("#container-question-" + globalId).parent().css('min-height', $("#container-question-" + globalId).parent().height() - 1);

    fxl_sleep(1, function () {

        $("#container-question-" + globalId).hide('slow');

        fxl_sleep(1, function () {

            globalId = $containerQuestion.attr("itemid");
            questionTime = $containerQuestion.attr("itemprop");
            $containerQuestion.show('slow', function () {

                fxl_sleep(1, function () {
                    $("#container-question-" + globalId).parent().css('min-height', '');
                    $("#container-question-" + globalId).parent().unmask();
                    if (globalTimer) {
                        createTimer();
                    } else {
                        $(".container-question progress").hide('slow');
                    }

                });
            });
        });
    });
}

/**
 * stop exam
 */
function stopExam() {

    clearInterval(QuestionInterval);
}

/**
 * finish exam
 */
function finishExam() {

    clearInterval(QuestionInterval);
    $(".container-question").hide();
    showResult();
}

function checkPoints() {

    var totalPoint = 0;
    $("div[id^=container-question-] input:checked").each(function () {

        totalPoint += parseInt($(this).parent().attr("itemtype"));
    });

    return totalPoint;
}

/**
 * show result
 *   -> end
 **/
function showResult() {

    $.ajax({
        type: "POST",
        url: $("#review").attr("action"),
        data: $("#review").serialize(),
        success: function (data) {
            //some actions
            //$("#review").unbind("submit").submit();

            return false;
        }
    });


    globalId = null;

    var score = checkPoints();

    $(".qcm_result").show('slow');

    var score = parseInt(score * 100 / $('.container-question').length);

    if (score < 33) {
        $("#result-by-response-text").addClass("alert alert-danger");
    } else if (score < 66) {
        $("#result-by-response-text").addClass("alert alert-block");
    } else {
        $("#result-by-response-text").addClass("alert alert-success");
    }

    $("#result-by-response").attr('value', score);

    var minusPoint = 0;
    $("div[itemtype=0] input:checked").each(function () {
        $(this).parent().addClass("alert-danger");
        minusPoint--;

        $(this).parent().addClass("alert-danger");


        var $bigFather = $(this).parent().parent();

        $(".counter", $bigFather).addClass("badge-important");
        $(".question", $bigFather).removeClass("well").addClass("alert alert-danger");
    });

    $("div[itemtype=1] input").each(function () {

        $(this).parent().addClass("alert-success");
    });

    $("div[itemtype=1] input:checked").each(function () {

        var $bigFather = $(this).parent().parent();
        $(".counter", $bigFather).addClass("badge-success");
        $(".question", $bigFather).removeClass("well").addClass("alert alert-success");
    });

    $("#result-by-response-text").html(Math.abs(minusPoint) + " fautes ( " + score + " % de réussite )");

    $(".answer-0").each(function () {

        $(this).css("text-decoration", "line-through");
    });

    $(".container-question input").attr("disabled", "disabled");

    $(".container-btn .finish, .container-btn .stop").hide();
    $(".container-question progress").hide();
    $(".container-question").first().show();
    $(".container-question .container-btn .next").click(function () {

        var $id = $(this).parent().parent();
        $id.hide();
        $("#" + $id.attr("id") + " ~ .container-question").first().show();
    });

    $(".container-question .container-btn .next").last().html("Terminé");

    $(".container-question .container-btn .next").last().click(function () {

        $(".exam-title").hide('slow');
        $("#fxl_qcm").hide('slow');
        $(".emend").show('slow');


    });
}

/**
 * DANGER *
 *
 * create timer
 *   -> ask question timed:
 */
function createTimer() {

    if (typeof this.counter == 'undefined') {
        this.counter = 0;
    } else {
        this.counter++;
    }

    //                          \\
    //   dangererous function   \\
    //                          \\

    if (globalId) {
        QuestionInterval = setInterval(function () {

            askQuestionTimed();

        }, 10 * questionTime);
    } else {
        askQuestionTimed();
    }
    //
    //
    //
}

/**
 * ask timed question
 *   -> try next question
 *

 //                                      \\
 //  maybe more dangererous function     \\
 //                                      \\
 */
function askQuestionTimed() {

    var total = $("#progressBar-" + globalId).val();

    $("#progressBar-" + globalId + " + span").html(total + "%");
    $("#progressBar-" + globalId).val(++total);

    if (total > 100) {
        $("#progressBar-" + globalId).css("background", "");
        // sleep 1 sec
        findQuestion(false, false);
        // go back to loop interval with a new question
    }
}

/**
 * Zzz
 **/
function fxl_sleep(timeToSleep, callback) {

    $.ajax({
        url: "/sleep/" + timeToSleep,
        success: callback
    });
}

