export default function ConnectView() {
  const form = document.getElementById('loginForm');
  const responseElement = document.getElementById('response');

  form.addEventListener('submit', function(e) {
    e.preventDefault();

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
    .then(async (response) => {
      // On tente de parser le JSON directement
      let jsonData;
      try {
        jsonData = await response.json();
      } catch (parseError) {
        // Si le JSON n'est pas valide, on l'affiche en brut
        const text = await response.text();
        throw new Error(`Erreur de parsing JSON: ${parseError.message}\nRéponse brute: ${text}`);
      }

      if (!response.ok) {
        // Erreur HTTP (400, 401, etc.)
        throw new Error(jsonData.message || 'Une erreur est survenue');
      }

      // Si tout va bien, on récupère le json
      return jsonData;
    })
    .then((data) => {
      console.log('Réponse JSON :', data);

      // Affichage simple du message dans la zone #response
      responseElement.innerText = JSON.stringify(data, null, 2);

      // Vérifier la présence de tokens 
      if (data.access_token && data.refresh_token) {
        // => 2FA n'est pas activée, on a reçu nos tokens (stockés en cookies)
        // Redirection vers le dashboard
        window.location.hash = '#dashboard';

      } else {
        // => Probablement 2FA activée, on n'a pas de tokens
        // On redirige vers la page OTP
        window.location.hash = '#otp';
      }
    })
    .catch((error) => {
      console.error('Erreur lors de la connexion :', error);
      responseElement.innerText = error.message;
    });
  });
}
