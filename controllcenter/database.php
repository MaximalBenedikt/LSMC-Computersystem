<?php
    $pdo = new PDO('mysql:host=localhost;dbname=lsmc', 'root', '');


    if($_POST['action']=='newaction') {
        $statement = $pdo->prepare("INSERT INTO `actions` (`date`, `time`) VALUES ('" . $_POST['date'] . "', '" . $_POST['time'] . "')");
        $statement->execute();
        $statement = $pdo->prepare("SELECT * FROM `actions` ORDER BY `enr` DESC limit 1");
        $statement->execute();
        $result = $statement->fetch();
        echo $result['enr'];
    }