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

    if($_POST['action']=='saveaction') {
        $sqlstatement = "UPDATE `actions` SET `object` = '" . $_POST['locationobject'] . "' , `position` = '" . $_POST['location'] . "' , `longterm` = '" . $_POST['keywordexpanded'] . "' , `shortterm` = '" . $_POST['keywordshort'] . "' , `callername` = '" . $_POST['callername'] . "' , `callerid` = '" . $_POST['callerid'] . "' , `comment` = '" . $_POST['comment'] . "' , `prio` = '" . $_POST['prio'] . "' , `active` = '1' , `specialrights` = '" . $_POST['sirene']. "' WHERE `enr`=" . $_POST['enr'];
        $statement = $pdo->prepare($sqlstatement);
        $statement->execute();
        echo $sqlstatement;
    }