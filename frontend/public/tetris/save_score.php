<?php
header('Access-Control-Allow-Origin: *');  // Autoriser CORS si nécessaire

// Activer l'affichage des erreurs pour débogage
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);


header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

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

// Récupérer les données envoyées en JSON
$data = json_decode(file_get_contents("php://input"), true);

if (isset($data['name']) && isset($data['score'])) {
    $player_name = $data['name'];
    $score = $data['score'];

    // Préparer et exécuter la requête SQL pour insérer les données
    $stmt = $conn->prepare("INSERT INTO scores (player_name, score) VALUES (?, ?)");
    $stmt->bind_param("si", $player_name, $score);  // 's' pour string et 'i' pour integer (nom, score)

    if ($stmt->execute()) {
        echo "Score ajouté avec succès";
    } else {
        echo "Erreur: " . $stmt->error;
    }

    $stmt->close();
} else {
    echo "Données manquantes ou invalides";
}

$conn->close();
?>
