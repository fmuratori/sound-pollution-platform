
**Avviare MongoDB service sull'host locale**

Verificare lo stato del servizio:

`sudo systemctl status mongod`

Avviare il servizio nel caso non sia attivo:

`sudo service mongod start`

**Struttura dei documento**

Ogni documento rappresenta un singolo dispositivo RaspberryPI. La struttura è mostrata di seguito:

Telemetries

`
{
    _id: string,
    gps_lat: float,
    gps_lng: float,
    device_name: string,
    last_timestamp: datetime,
    active_since: datetime,
    data: [
        {
            datetime: datetime,
            value: integer,
        },
    ]
}
`

L'array data contiene le singole misurazioni, ciascuna distinta da un valore numerico e dalla data+ora.


**Link utili**

Installare mongoDB seguendo le istruzioni al seguente link:

https://www.mongodb.com/docs/manual/tutorial/install-mongodb-on-ubuntu/


Creare un DB ed operazioni di base:

https://www.mongodb.com/basics/create-database
