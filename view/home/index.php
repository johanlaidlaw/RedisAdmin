<div id="search_container">Keys <input type="text" id="redis_search">*</div>
<div id="redis_container">
<?php

$redis = lib\redis\RedisClient::getPredisObject();	
foreach($redis->keys('*') as $key => $value){
	echo '<div class="redis_key">'.$value.'</div>';
}

?>
	
</div>
