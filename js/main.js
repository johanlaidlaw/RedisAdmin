$(document).ready(function(){

    getKeysByPattern("*");

	$("body").click(function(){
		$('.edit').parent().html($('.edit').val());
	});
	
	$('#redis_search').keyup(function(e){
		if(e.which == 38 || e.which == 40){
			// Up or Down
			var elements_in_container = $('#redis_container div');
			if(elements_in_container.length > 0){
				var selectedElement = $("#redis_container div.hover");
				if(selectedElement.length){
					if(e.which == 38){
						// UP
						var previousEl = selectedElement.prev();
						if(previousEl.length == 0){
							previousEl = $("#redis_container div:last")
						}
						if(previousEl.length){
							selectedElement.removeClass('hover');
							previousEl.addClass('hover');
						}
					}else if(e.which == 40){
						// DOWN
						var nextEl = selectedElement.next();
						if(nextEl.length == 0){
							nextEl = $("#redis_container div:first");
						}
						if(nextEl.length){
							selectedElement.removeClass('hover');
							nextEl.addClass('hover');
						}
					}
				}else{
					if(e.which == 40){
						$("#redis_container div:first").addClass("hover");
					}
				}
			}
			
		}else if(e.which == 13){
			// keypress = Enter
			expandKey();
		}else if(e.which == 46){
			if(confirm('Do you really want to delete this key?')){
				console.log("Delete key");
			}
		}else{
			var value = $(this).val();
            getKeysByPattern(value+"*");
		}
		
	});
	
	
	$('.r_key').live({
		click: expandKey,
		mouseover: function(){
			$(this).siblings().removeClass('hover');
			$(this).addClass('hover').css({cursor:'pointer'});
		},
		mouseout: function(){
			$(this).removeClass('hover');
		}
	});

    $('.r_value').live({
		click: editValue,
		mouseover:function(){
			$(this).addClass('hover');
		},
		mouseout: function(){
			$(this).removeClass('hover');
		}
	});


    /*
    The ajax call to insert a new field to a hash
     */
    $(document).on("submit","form[name=new_field_to_hash]",function(){
        var redis_value_container = $(this).parent().parent();
        $.ajax({
            url: $(this).attr('action'),
            type: $(this).attr('method'),
            data: $(this).serialize(),
            dataType: 'json',
            success: function(data, status) {
                fields = populateRedisValueContainer(data.data, data.type);
                redis_value_container.html(fields);
            },
            error: function(XMLHttpRequest, textStatus, errorThrown) {}
        });
        return false;
    });


    $(document).on("click",".add_field_to_hash",function(){
        $(this).removeClass().addClass('add_member_edit');
        key = $(this).parent().prev();
        $(this).html('<form name="new_field_to_hash" method="post" action="/hash/addField"><input type="hidden" value="'+key.html()+'" name="key" /><input type="text" name="field" /> => <input type="text" name="value"/> <input type="submit" value="ok" /></form>');
        
    });


	function expandKey(){
		var element = $("#redis_container div.hover");
		var value = element.html();
		if(element.next().attr('class') == 'redis_value_container'){
			element.next().remove();
		}else{
            type = element.attr('type');
			$.ajax({
				url: type+"/getValues?key="+value,
				dataType: 'json',
				success: function(data, status) {
                    if(data == false){
                        element.addClass("deleted_key").html("This key has been deleted");
                        setTimeout(function(){
                            element.hide(2000, function(){ element.remove(); });
                        },1000);
                    }else{
                        field = '<div class="redis_value_container">';
                        field += populateRedisValueContainer(data.data, data.type);
                        field += '</div>';
                        element.after(field);
                    }
				},
				error: function(XMLHttpRequest, textStatus, errorThrown) {}
			});
		}
	}

    function populateRedisValueContainer(data, type){
        field = '';
        $.each(data,function(i,item){
            field += '<div class="r_member"><span class="r_field">'+i+'</span> => <span class="r_value">'+item+'</span></div>';
        });
        field += addType(type);
        return field;
    }
    function addType(type){
        var new_type = '';
        if(type == "hash")
            new_type = '<div class="add_field_to_hash">Add member to hash</div>';
        return new_type;
    }


	function editValue(){
		element = $(this);
		hasInput = element.find(':input');
		if(hasInput.length == 0){
			// Already an input field
			content = element.html();
			element.html('<input type="text" class="edit" />');
			input = $('.edit');
			input.val(content);
			input.attr('size',content.length*1.5);
			input.focus();
			input.keyup(function(e){
				if(e.which == 13){
					value = input.val();
                    key = input.parent().parent().parent().prev();
					key_name = key.html();
                    type = key.attr('type');
					field = input.parent().prev().html();
					$.ajax({
						url: type+"/editField",
                        data: {'key': key_name, 'field': field, 'value' : value, 'old_value' : content},
						dataType: 'json',
						success: function(data, status) {
							new_content = input.val();
							element.html(new_content);	
						},
						error: function(XMLHttpRequest, textStatus, errorThrown) {}
					});
					
				}
			});

		}
	}
	
});


function getKeysByPattern(pattern){
    $.ajax({
        url: "/redis/keys?pattern="+pattern,
        dataType: 'json',
        success: function(data, status) {
            console.log(data);

            if(data.keys.length < 1){
                $("#redis_container").html("No keys matching");
            } else {
                if(data.sliced)
                    element = '<div class="warning">Too many keys returned. Please be more specific in your search</div>';
                else
                    element = '';

                $.each(data.keys, function(i, item){
                    element += '<div class="r_key" type="'+item[1]+'">'+item[0]+'</div>';
                });
                $("#redis_container").html(element);
            }
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {}
    });
}


