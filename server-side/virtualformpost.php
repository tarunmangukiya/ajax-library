<?php
if(isset($_POST)){
	echo '{"status": "success", "updateExtra": true, "affectedElement": "#test'.$_GET['id'].'", "content":"Virtual Ajax"}';
}

?>