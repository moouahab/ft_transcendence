export default function OTPView() {
    const form = document.getElementById('otpForm');
    const responseEl = document.getElementById('otpResponse');
  
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
        responseEl.innerText = data.message || 'Connexion réussie !';
        window.location.hash = '#dashboard';
      })
      .catch((error) => {
        console.error('Erreur OTP:', error);
        responseEl.innerText = error.message;
      });
    });
  }
  