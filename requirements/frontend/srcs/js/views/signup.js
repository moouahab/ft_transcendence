export default function setupSignupView() {
  const profilePictureInput = document.getElementById("profile_picture");
  const imageButton = document.getElementById("imageButton");
  const imagePreview = document.getElementById("imagePreview");
  const buttonText = document.getElementById("buttonText");

  // Gérer le clic sur le bouton carré
  imageButton.addEventListener("click", () => {
    profilePictureInput.click(); // Ouvre le sélecteur de fichier
  });

  // Gérer la sélection d'une image
  profilePictureInput.addEventListener("change", (event) => {
    const file = event.target.files[0];

    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        imagePreview.src = e.target.result;
        imagePreview.style.display = "block";
        buttonText.style.display = "none";
        imageButton.style.border = "none";
      };

      reader.readAsDataURL(file);
    } else {
      resetImageButton();
    }
  });
  function resetImageButton() {
    imagePreview.style.display = "none";
    buttonText.style.display = "block";
    imageButton.style.border = "2px dashed #00ffff";
    imagePreview.src = "";
  }

  // Fonction pour afficher un message stylé
  function showMessage(message, type, duration = 500) {
    const responseMessage = document.getElementById("response");
  
    // Définir le contenu et la classe
    responseMessage.textContent = message;
    responseMessage.className = ""; 
    responseMessage.classList.add(type);
  
    // Afficher le message avec une transition
    responseMessage.style.display = "block";
    responseMessage.style.opacity = "1";
  
    // Masquer automatiquement après un certain délai
    setTimeout(() => {
      responseMessage.style.opacity = "0";
      setTimeout(() => {
        responseMessage.style.display = "none";
      }, 50);
    }, duration);
  }
  

  // Ajouter un listener pour soumettre le formulaire
  const submitBtn = document.getElementById("submitBtn");
  submitBtn.addEventListener("click", async () => {
    const form = document.getElementById("signupForm");
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirmPassword").value;

    // Vérification des mots de passe
    if (password !== confirmPassword) {
      showMessage("Les mots de passe ne correspondent pas.", "error");
      return;
    }

    const formData = new FormData(form);

    try {
      const response = await fetch("https://localhost/api/api/signup/", {
        method: "POST",
        body: formData,
        credentials: "include",
      });

      const result = await response.json();

      if (response.ok) {
        showMessage("Inscription réussie !", "success");

        setTimeout(() => {
          window.location.hash = "#connect";
        }, 300);
      } else {
        const message = result.error || "Erreur lors de l’inscription.";
        showMessage(message, "error");
      }
    } catch (error) {
      console.error("Erreur :", error);
      showMessage("Erreur lors de la requête.", "error");
    }
  });
}
