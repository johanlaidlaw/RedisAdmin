<?php
if($this->get('redis_error')){
    ?>
    <div id="redis_error">
        <p>There is a problem connecting to Redis.</p>
        <p>Are you sure your Redis server is connected?</p>
    </div>
    <?php
    exit;   
}
?>

<div id="left_container">
	<div id="search_container">
        Key <input type="text" id="redis_search"> in db
        <select id="database_select">
            <?php $selected = isset($_SESSION['redis_db']) ? $_SESSION['redis_db'] : 0;?>
            <?php foreach(range(0, 15) as $i):?>
                <option value="<?php echo $i;?>"<?php if($i==$selected):?> selected<?php endif;?>><?php echo $i;?></option>
            <?php endforeach;?>
        </select>
        <span id="flushdb">Flushdb</span>
    </div>
	<div id="redis_container">
	</div>
</div>

<div id="right_container">
    <a class="toggle" href = "#" onclick="$('#server_stats').toggle();return false;">Toggle stats</a>
	<div id="server_stats" style="display;none;">
		<h2>Server stats</h2>
		<table>
		<?php
        foreach($this->get('server_info') as $desc => $info){
            if($desc == 'db0'){
                echo '<tr><td style="background-color:#E3E3E3" colspan="2">'.$desc.'</td></tr>';
                foreach($info as $d => $d_val)
                    echo '<tr><td>'.$d.'</td><td>'.$d_val.'</td></tr>';
            }else
                echo '<tr><td>'.$desc.'</td><td>'.$info.'</td></tr>';
        }
        ?>
		</table>
	</div>
</div>