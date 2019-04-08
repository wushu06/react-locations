<?php
header("Access-Control-Allow-Origin: *");

try {
    $dbh = new PDO('mysql:host=localhost;dbname=J1', 'root', 'root');

    $stmt = $dbh->prepare("

        SELECT * FROM j1_location_categories LIMIT 100;
      

      ");




    $stmt->execute();

    $data = $stmt->fetchAll(PDO::FETCH_ASSOC);

    $dbh = null;
} catch (PDOException $e) {
    print "Error!: " . $e->getMessage() . "<br/>";
    die();
}


echo json_encode($data) ;







?>

