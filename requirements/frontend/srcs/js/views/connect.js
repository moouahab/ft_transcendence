export default function ConnectView() {
    const form = document.getElementById('loginForm');
    const reponseFrom = document.getElementById('response');

    form.addEventListener('submit', function(e) {
        e.preventDefault();
    
        // Récupère les données des champs de formulaire
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const data = { email, password };
    
        fetch('https://localhost/api/api/login/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          credentials: 'include',  // pour inclure les cookies dans la requête
          body: JSON.stringify(data)
        })
        .then(response => response.text())
        .then(text => {
          console.log("Réponse brute :", text);
          try {
            const jsonData = JSON.parse(text);
            reponseFrom.innerText = JSON.stringify(jsonData, null, 2);
          } catch (error) {
            reponseFrom.innerText = "Erreur de parsing JSON: " + error.message + "\nRéponse brute: " + text;
          }
        })
        .catch(error => {
            reponseFrom.innerText = 'Erreur lors de l\'envoi : ' + error;
        });
      });
}
