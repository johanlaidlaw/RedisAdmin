$(document).ready(function(){
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
			$.ajax({
				url: "/redis/exec?command=keys&key="+value+"*",
				dataType: 'json',
				success: function(data, status) {
					if($.isEmptyObject(data)){
						$("#redis_container").html("No keys matching");
					} else {
						element = '';
						$.each(data, function(i, item){
							element += '<div class="r_key">'+item+'</div>';
						})
						$("#redis_container").html(element);
					}
				},
				error: function(XMLHttpRequest, textStatus, errorThrown) {}
			});
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
	
	
	function expandKey(){
		var element = $("#redis_container div.hover");
		var value = element.html();
		if(element.next().attr('class') == 'redis_value_container'){
			element.next().remove();
		}else{
			$.ajax({
				url: "/redis/get_values?key="+value,
				dataType: 'json',
				success: function(data, status) {
					field = '<div class="redis_value_container">';
					$.each(data,function(i,item){
						field += '<div class="r_member"><span class="r_field">'+i+'</span> => <span class="r_value">'+item+'</span></div>';
					});
					field += '</div>';
					element.after(field);
				},
				error: function(XMLHttpRequest, textStatus, errorThrown) {}
			});
		}
	}
	
	$('.r_value').live({
		click: editValue,
		mouseover:function(){
			$(this).addClass('hover');
		},
		mouseout: function(){
			$(this).removeClass('hover');
		}
	});
	
	
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
					key = input.parent().parent().parent().prev().html();
					field = input.parent().prev().html();
					$.ajax({
						url: "/redis/setValueForField?key="+key+"&field="+field+"&value="+value,
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
