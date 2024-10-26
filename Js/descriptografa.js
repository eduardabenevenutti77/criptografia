//let privateKey; // Carregar a chave privada do armazenamento seguro

// Função para importar a chave privada do localStorage
async function importPrivateKey() {
    const keyData = window.localStorage.getItem("privateKey"); // Obter a chave privada do localStorage
    if (!keyData) {
        alert("Chave privada não encontrada. Certifique-se de que a chave foi gerada e armazenada.");
        return;
    }

    privateKey = await window.crypto.subtle.importKey(
        "jwk",
        JSON.parse(keyData),
        { name: "RSA-OAEP", hash: "SHA-256" },
        true,
        ["decrypt"]
    );
}

// Função para descriptografar a mensagem
async function decryptMessage() {
    await importPrivateKey(); // Importa a chave privada
    const encryptedMessage = document.getElementById("encryptedMessage").value;

    if (!encryptedMessage) {
        alert("Por favor, insira uma mensagem criptografada.");
        return;
    }

    // Decodifica a mensagem de base64
    const decodedMessage = Uint8Array.from(atob(encryptedMessage), c => c.charCodeAt(0));

    // Descriptografa a mensagem
    try {
        const decrypted = await window.crypto.subtle.decrypt(
            { name: "RSA-OAEP" },
            privateKey,
            decodedMessage
        );

        const decoder = new TextDecoder();
        document.getElementById("decryptedMessage").value = decoder.decode(decrypted);
    } catch (error) {
        console.error("Erro na descriptografia:", error);
        alert("Falha ao descriptografar a mensagem. Verifique se a mensagem está correta.");
    }
}
