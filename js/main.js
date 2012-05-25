$(document).ready(function(){

    getKeys();

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
            getKeys();
		}
		
	});
	
	$(document).on("click", "#show_all", function() {
		getKeys(true);
	});
	

    $("#database_select").change(function(){
        var value = $(this).val();
        $.ajax({
            url: "/redis/setDatabase?db="+value,
            dataType: 'json',
            success: function(data, status) {
                getKeys();
            },
            error: function(XMLHttpRequest, textStatus, errorThrown) {}
        });
    });

	$('.r_key').live({
		click: expandKey,
		mouseover: function(){
			$(this).siblings().removeClass('hover');
			$(this).addClass('hover').css({cursor:'pointer'});
            $(this).find('img').show();
		},
		mouseout: function(){
			$(this).removeClass('hover');
            $(this).find('img').hide();
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
    The ajax call to insert a new field to a type
     */
    $(document).on("submit","form",function(){
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
        key_name = $(this).parent().prev().find('.key_name').html();
        $(this).html('<form name="new_field_to_hash" method="post" action="/hash/addField"><input type="hidden" value="'+key+'" name="key" /><input type="text" name="field" /> => <input type="text" name="value"/> <input type="submit" value="ok" /></form>');
        
    });


    $(document).on("click",".add_field_to_set",function(){
        $(this).removeClass().addClass('add_member_edit');
        key = $(this).parent().prev().find('.key_name').html();
        $(this).html('<form name="new_field_to_set" method="post" action="/set/addField"><input type="hidden" value="'+key+'" name="key" /><input type="text" name="value"/> <input type="submit" value="ok" /></form>');

    });

    $(document).on("click","#flushdb",function(){
        db = $("#database_select option:selected").val();
        if(confirm("This will completely wipe database number "+db+". Is this alright?")){
            flushdb();
        }else{
            alert("Good thing I asked you ;)");
        }
    });

    $(document).on("click",".delete_key",function(){
        if(confirm("You did mean to delete that right?")){
            deleteKey($(this).siblings(".key_name").text());
        }
        return false;
    });




	function expandKey(){
		var element = $("#redis_container div.hover");
		var value = element.find('.key_name').html();
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
        if(type == "hash" || type== "set")
            new_type = '<div class="add_field add_field_to_'+type+'">Add field to '+type+'</div>';

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
					key_name = key.find('.key_name').html();
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


function getKeys(all){
	var all_param = (typeof all == "undefined" || !all)? 0 : 1;
    var pattern = $("#redis_search").val();
    $.ajax({
        url: "/redis/keys?pattern="+pattern+"&all="+all_param,
        dataType: 'json',
        success: function(data, status) {
            if(data.keys.length < 1){
                $("#redis_container").html("No keys matching");
            } else {
                if(data.sliced)
                    element = '<div class="warning">'+data.count+' keys found. Showing first 100 only. <span id="show_all">Show all</span></div>';
                else
                    element = '';

                $.each(data.keys, function(i, item){
                    element += '<div class="r_key" type="'+item[1]+'"><span class="key_name">'+item[0]+'</span> <span class="key_type">'+item[1]+'</span> <img class="delete_key" src="img/trash.png" style="display: none; vertical-align: bottom" /></div>';
                });
                $("#redis_container").html(element);
            }
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {}
    });
}

function flushdb(){
    $.ajax({
        type: "post",
        url: "/redis/flushdb",
        dataType: 'json',
        success: function(data, status) {
            $("#redis_container").html("No keys matching");
        }
    });
}

function deleteKey(key){
   var element = $("#redis_container div.hover");
   $.ajax({
        type: "post",
        url: "/redis/del?key="+key,
        dataType: 'json',
        success: function(data, status) {
            setTimeout(function(){
                element.hide(500, function(){
                    if(element.next().attr('class') == 'redis_value_container'){
                        element.next().remove();
                    }
                    element.remove();
                });
            },700);
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {}
    });
}
