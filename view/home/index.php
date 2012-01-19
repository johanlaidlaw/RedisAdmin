<div id="left_container">
	<div id="search_container">Keys <input type="text" id="redis_search">*</div>
	<div id="redis_container">
	</div>
</div>

<div id="right_container">
	<div id="server_stats">
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