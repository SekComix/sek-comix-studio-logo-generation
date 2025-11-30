# Sek + Comix Studio

AI Creator Studio alimentato da **Google Gemini 2.5 Flash**.

## Funzionalità
*   **Image Editor AI**: Modifica immagini tramite prompt testuali (es. "Aggiungi effetto neon", "Rimuovi sfondo").
*   **Brand Identity Generator**: Genera loghi personalizzati per le tue app (Ricette, Viaggi, Gaming) con un click.
*   **Brand Kit Avanzato**: Personalizza colori, icone, dimensioni e temi (Chiaro/Scuro) per i tuoi loghi.

## Tecnologie
*   React 19
*   Vite
*   Tailwind CSS
*   Google Gemini API (gemini-2.5-flash-image)

## Installazione

1.  Clona il repository:
    ```bash
    git clone https://github.com/TUO-NOME/sek-comix-studio.git
    ```
2.  Installa le dipendenze:
    ```bash
    npm install
    ```
3.  Crea un file `.env` nella root e aggiungi la tua chiave API:
    ```
    API_KEY=la_tua_chiave_gemini_qui
    ```
    *Nota: Il file .env è ignorato da git per sicurezza.*

4.  Avvia il server di sviluppo:
    ```bash
    npm run dev
    ```
