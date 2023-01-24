function parse_content(){
    $('.line', $('#tbl_parse')).remove();
    var content = $('#txt_content').val();
    var splits = content.split('.');
    // console.log(splits);
    var len = splits.length;
    for (var i=0; i<len; i++){
        var $tr = $('#tr_template').clone(false);
        $tr.addClass('line');
        $tr.removeClass('hidden');
        $tr.removeAttr('id');
        $('.org', $tr).val($.trim(splits[i]));
        $('#tbl_parse').append($tr);
    }
}