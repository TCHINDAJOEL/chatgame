<?php

// Activer CORS pour permettre l'accès depuis toutes les origines
header('Access-Control-Allow-Origin: *');

// Connexion à la base de données MySQL
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "leaderboard";

$conn = new mysqli($servername, $username, $password, $dbname);

// Vérifier la connexion
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Récupérer les 5 meilleurs scores
// $player_name = $data['name'];
// $score = $data['score'];
$sql = "SELECT player_name, score FROM scores ORDER BY score DESC LIMIT 5";
$result = $conn->query($sql);

$scores = array();

if ($result->num_rows > 0) {
    while($row = $result->fetch_assoc()) {
        $scores[] = $row;
    }
}

// Renvoie les scores sous format JSON
header('Content-Type: application/json');
echo json_encode($scores);

$conn->close();
?>
