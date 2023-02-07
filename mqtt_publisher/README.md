# Componente del progetto del corso Smart City e Tecnologie Mobili

Questa cartella contiene l'implementazione della componente client della piattaforma di IoT dedicata alla monitorazione dell'inquinamento acustico delle zone abitate.

All'interno del progetto sono implementate le componenti:
- publisher, il quale pubblica misurazioni
- subscribe, il quale riceve e gestisce tali misurazioni

Entrambe le componenti sono pensate per essere eseguite separatamente sia su processi dello stesso host che su host distinti.
Per informazioni sul componente broker fare riferimento alle istruzioni descritte nel file README.md della cartella mqtt_broker.

---

Il progetto è realizzato in linguaggio python versione 3.10 

Per installare ed inizializzare il server eseguire eseguire i seguenti comandi:
 
python3 -m venv .venv .r requirements.txt

source .venv/bin/activate

python ./src/main.py

...

Oppure

inizializzare il contaiber docker con i seguenti comandi:

...

