let publicKey, privateKey;

// Função para gerar o par de chaves
async function generateKeys() {
    const keyPair = await window.crypto.subtle.generateKey(
        {
            name: "RSA-OAEP",
            modulusLength: 2048,
            publicExponent: new Uint8Array([1, 0, 1]),
            hash: "SHA-256",
        },
        true,
        ["encrypt", "decrypt"]
    );
    publicKey = keyPair.publicKey;
    privateKey = keyPair.privateKey;

    // Exporta a chave privada e salva no localStorage para uso na descriptografia
    const exportedPrivateKey = await window.crypto.subtle.exportKey("jwk", privateKey);
    localStorage.setItem("privateKey", JSON.stringify(exportedPrivateKey));
    alert("Chaves geradas com sucesso!");
}

// Função para criptografar a mensagem
async function encryptMessage() {
    const message = document.getElementById("message").value;
    const encoder = new TextEncoder();
    const encodedMessage = encoder.encode(message);

    const encrypted = await window.crypto.subtle.encrypt(
        { name: "RSA-OAEP" },
        publicKey,
        encodedMessage
    );

    document.getElementById("encryptedMessage").value = btoa(
        String.fromCharCode(...new Uint8Array(encrypted))
    );
}