<?php
header("Access-Control-Allow-Origin: *");

    try {
        $dbh = new PDO('mysql:host=localhost;dbname=smnqrwjvcp', 'smnqrwjvcp', 'ZPEKAsW2wv');

        $stmt = $dbh->prepare("

        SELECT distinct a.id,d.name as location_title,d.id as location_id, a.category_id, c.name as category_name, c.parent_category_path_names, a.title, a.mime_type,  a.sub_folder, a.file_name, d.name
        FROM j1_document as a
        join j1_location_categories as b on a.id = b.image_id_1 or a.id = b.image_id_2 or a.id = b.image_id_3
        join j1_location_category as c on b.category_id=c.id
        join j1_location as d on b.location_id = d.id
          WHERE a.category_id = 5 LIMIT 10

      ");

        $search_term = '%' . trim($_POST['search_term']) . '%';

        $stmt->bindValue(':name', 'office');

        $stmt->execute();

        $data = $stmt->fetchAll(PDO::FETCH_ASSOC);
     

        $dbh = null;
    } catch (PDOException $e) {
        print "Error!: " . $e->getMessage() . "<br/>";
        die();
    }

echo json_encode($data) ;
