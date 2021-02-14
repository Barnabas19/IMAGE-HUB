$(function(){
    $('#post-comment').hide();
    $('#btn-comment').on('click', function(event){
        event.preventDefault();
        
        $('#post-comment').show();
    })

    $('#btn-like').on('click', function(event){  //WHEN THE LIKE BUTTON IS CLICKED
        event.preventDefault();

        var imgId = $(this).data('id');
        $.post('/images/' + imgId + '/like').done(function(data){  //MAKE A POST REQUEST TO THIS ENDPOINT
            $('.likes-count').text(data.likes);  /*THE API RETURNS A RESPONSE ASYNCHRONOUSLY, ONCE THE RESPONSE ARRIVES,
            CHANGE THE TEXT CONTENT OF THE '.likes-count' OBJECT TO THE 'likes' PROPERTY OF THE RETURNED VALUE: 'data' */
        });
    });
    $('#btn-delete').on('click', function(event){
        event.preventDefault();
        var $this = $(this);

        var remove = confirm('Are you sure you want to delete this image?');
        if(remove){
            var imgId = $(this).data('id');
            $.ajax(
                {
                    url: '/images/' + imgId,
                    type: 'DELETE'
                }
            ).done(function(result){
                if(result){
                    $this.removeClass('btn-danger').addClass('btn-success');
                    $this.find('i').removeClass('fa-times').addClass('fa-check');
                    $this.append('<span> Deleted! </span>');
                }
            });
        }
    });
})