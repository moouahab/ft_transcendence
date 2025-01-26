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
  
        // Lorsque le fichier est chargé
        reader.onload = (e) => {
          imagePreview.src = e.target.result; // Afficher l'image sélectionnée
          imagePreview.style.display = "block"; // Afficher l'aperçu
          buttonText.style.display = "none"; // Cacher le texte "Télécharger"
          imageButton.style.border = "none"; // Retirer la bordure en pointillé
        };
  
        reader.readAsDataURL(file); // Lire le fichier comme une URL de données
      } else {
        // Si aucun fichier sélectionné, réinitialiser le bouton
        resetImageButton();
      }
    });
  
    // Fonction pour réinitialiser le bouton (si besoin)
    function resetImageButton() {
      imagePreview.style.display = "none";
      buttonText.style.display = "block";
      imageButton.style.border = "2px dashed #00ffff";
      imagePreview.src = "";
    }
  
    // Ajouter un listener pour soumettre le formulaire
    const submitBtn = document.getElementById("submitBtn");
    submitBtn.addEventListener("click", async () => {
      const form = document.getElementById("signupForm");
      const password = document.getElementById("password").value;
      const confirmPassword = document.getElementById("confirmPassword").value;
  
      // Vérification des mots de passe
      if (password !== confirmPassword) {
        document.getElementById("response").textContent = "Les mots de passe ne correspondent pas.";
        return;
      }
  
      const formData = new FormData(form);
  
      try {
        const response = await fetch("https://localhost/api/api/signup/", {
          method: "POST",
          body: formData,
          credentials: "include", // Inclure les cookies
        });
  
        const result = await response.json();
  
        if (response.ok) {
          document.getElementById("response").textContent = "<div class='agree'><h4>Inscription réussie !</h4></div>";
        } else {
          const message = result.error || "Erreur lors de l’inscription.";
          document.getElementById("response").textContent = message;
        }
      } catch (error) {
        console.error("Erreur :", error);
        document.getElementById("response").textContent = "Erreur lors de la requête.";
      }
    });
  }

  