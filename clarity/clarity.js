$(document).ready(function() {
    // Automatically adjusting selector width based on the text width
    $("#image-selector1-temp-option").html($('#image-selector1 option:selected').text());
    $('#image-selector1').width($("#image-selector1-temp").width());
    $("#image-selector2-temp-option").html($('#image-selector2 option:selected').text());
    $('#image-selector2').width($("#image-selector2-temp").width());

    $('#image-selector1, #image-selector2').change(function() {
        $("#image-selector1-temp-option").html($('#image-selector1 option:selected').text());
        $('#image-selector1').width($("#image-selector1-temp").width());

        $("#image-selector2-temp-option").html($('#image-selector2 option:selected').text());
        $('#image-selector2').width($("#image-selector2-temp").width());

        var label1 = $('#image-selector1').val()
        var label2 = $('#image-selector2').val()
        var parti = document.getElementById('parti');
        parti.src = 'https://sites.research.google/parti/paper_images_green_watermark_outputs/figures/cherries/tornado/' + label1 + '_' + label2 + '.jpg'
    })

    // Automatically adjusting selector width based on the text width
    $("#image-selector3-temp-option").html($('#image-selector3 option:selected').text());
    $('#image-selector3').width($("#image-selector3-temp").width());
    $("#image-selector4-temp-option").html($('#image-selector4 option:selected').text());
    $('#image-selector4').width($("#image-selector4-temp").width());

    $('#image-selector3, #image-selector4').change(function() {
        $("#image-selector3-temp-option").html($('#image-selector3 option:selected').text());
        $('#image-selector3').width($("#image-selector3-temp").width());

        $("#image-selector4-temp-option").html($('#image-selector4 option:selected').text());
        $('#image-selector4').width($("#image-selector4-temp").width());

        var label1 = $('#image-selector3').val()
        var label2 = $('#image-selector4').val()
        var parti = document.getElementById('parti2');
        parti.src = 'https://sites.research.google/parti/paper_images_green_watermark_outputs/figures/cherries/cherry2/' + label1 + '_' + label2 + '.jpg'
    })

})