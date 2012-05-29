$(document).ready(function(){

    getKeys();

	$("body").click(function(){
		$('.r_value:not(.hover) .edit').each(function(){
			var obj = $(this);
			var value = obj.val();
			var key = obj.parent().siblings(".r_field").text();
			drawField(obj.parent().parent(), key, value);
		});
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
			var key_container = $("#redis_container .r_key.hover");
			if(key_container.length) {
				var key = key_container.children(".key_name").text();
				deleteKey(key);
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

    // .r_key events
	$(document).on("click", '.r_key', expandKey);
	$(document).on("mouseover", '.r_key', function(){
		$(this).siblings().removeClass('hover');
		$(this).addClass('hover').css({cursor:'pointer'});
        $(this).find('img').show();
	});
	$(document).on("mouseout", '.r_key', function(){
		$(this).removeClass('hover');
        $(this).find('img').hide();
	});

	// .r_value events
    $(document).on("click", '.r_value', editValue);
    $(document).on("mouseover", '.r_value', function(){
		$(this).addClass('hover');
	});
    $(document).on("mouseout", '.r_value', function(){
		$(this).removeClass('hover');
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
                populateRedisValueContainer(redis_value_container, data.data, data.type);
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
    	deleteKey($(this).siblings(".key_name").text());
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
                        var container = $('<div class="redis_value_container"></div>');
                        populateRedisValueContainer(container, data.data, data.type);
                        element.after(container);
                    }
				},
				error: function(XMLHttpRequest, textStatus, errorThrown) {}
			});
		}
	}

    function populateRedisValueContainer(container, data, type){
        $.each(data,function(i,item){
        	var member = $('<div class="r_member"></div>');
        	drawField(member, i, item);
        	container.append(member);
        });
        container.append(addType(type));
    }
    function addType(type){
        var new_type = null;
        if(type == "hash" || type== "set")
            new_type = $('<div class="add_field add_field_to_'+type+'">Add field to '+type+'</div>');

        return new_type;
    }
    
    function drawField(container, key, value) {
    	var empty_class = "";
    	if(value == "") {
    		empty_class = "empty";
    		value = "empty";
    	}
    	
    	var field = $('<span class="r_field">'+key+'</span> => <span class="r_value '+empty_class+'">'+value+'</span>');
    	container.empty();
    	container.append(field);
    }


	function editValue(){
		var element = $(this);
		var hasInput = element.find(':input');
		if(hasInput.length == 0){
			// Already an input field
			var content = (element.hasClass("empty"))? "" : element.html();
			element.removeClass("empty");
			element.html('<input type="text" class="edit" />');
			var input = $('.edit');
			input.val(content);
			input.attr('size',content.length*1.5);
			input.focus();
			input.keyup(function(e){
				if(e.which == 13){
					var value = input.val();
                    var key = input.parent().parent().parent().prev();
					var key_name = key.find('.key_name').html();
                    var type = key.attr('type');
					var field = input.parent().prev().html();
					$.ajax({
						url: type+"/editField",
                        data: {'key': key_name, 'field': field, 'value' : value, 'old_value' : content},
						dataType: 'json',
						success: function(data, status) {
							drawField(input.parent().parent(), field, value);
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
	if(confirm('Do you really want to delete the key '+key+'?')) {
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
}
