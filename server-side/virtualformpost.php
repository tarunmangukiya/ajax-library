<?php
if(isset($_POST)){
	$val = $_POST['testing'];
	echo '{"status": "success", "updateExtra": true, "affectedElement": "#test'.$_GET['id'].'", "content":"'.$val.'"}';
}

?>