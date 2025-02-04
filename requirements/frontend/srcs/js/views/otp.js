export default function OTPView() {
  const form = document.getElementById('otpForm');
  const responseElement = document.getElementById("response");

  // 1. Fonction pour afficher des messages stylés (similaire au signup)
  function showMessage(message, type, duration = 3000) {
    // Définir le contenu et la classe
    responseElement.textContent = message;
    responseElement.className = ""; // Réinitialise toutes les classes
    responseElement.classList.add(type); // success, error, info, etc.

    // Afficher le message
    responseElement.style.display = "block";
    responseElement.style.opacity = "1";

    // Masquer automatiquement après un certain délai
    setTimeout(() => {
      responseElement.style.opacity = "0";
      setTimeout(() => {
        responseElement.style.display = "none";
      }, 500);
    }, duration);
  }
  
  form.addEventListener('submit', function(e) {
    e.preventDefault();
  
    const email = document.getElementById('otpEmail').value;
    const otp_code = document.getElementById('otpCode').value;
    const data = { email, otp_code };
  
    fetch('https://localhost/api/api/verify-otp/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      credentials: 'include',
      body: JSON.stringify(data)
    })
    .then(async (response) => {
      const jsonData = await response.json();
      if (!response.ok) {
        throw new Error(jsonData.message || 'Erreur de vérification OTP');
      }
      return jsonData;
    })
    .then((data) => {
      showMessage(data.message || 'Connexion réussie !', 'success');
      window.location.hash = '#dashboard';
    })
    .catch((error) => {
      console.error('Erreur OTP:', error);
      showMessage(error.message, 'error');
    });
  });
}
