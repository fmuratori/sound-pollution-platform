# Componente del progetto del corso Smart City e Tecnologie Mobili

Questa cartella contiene l'implementazione della componente Arduino della piattaforma di IoT dedicata alla monitorazione dell'inquinamento acustico delle zone abitate.

Il codice nella cartella è installato all'interno di una board Arduino UNO e permette la gestione dei dispositivi di misurazione.

Le telemetrie sono quindi inviate al componente publisher (uno script python) dell'architettura pub-sub utilizzata dal protocollo mqtt.

Questo passaggio intermedio (misuratore -> ARDUINO -> Raspberry) è necessario per permettere la serializzazione di misurazioni analogiche.

---

In alcuni casi la board arduino potrebbe non essere accessibile a causa dell'assenza di privilegi dell'utente. In questo caso utilizzare il seguente comando:

sudo chmod a+rw /dev/ttyACM0

dove ttyACM0 è generalmente il nome della board connessa.
