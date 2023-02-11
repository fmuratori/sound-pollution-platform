import { useState, useEffect, useContext } from 'react';

import './Devices.scss';
import Device from '../components/Device.jsx'

import {SocketContext} from '../socket.js';


function Devices() {
  const socket = useContext(SocketContext);
  const [devices, setDevices] = useState([]);

  useEffect(() => {

    socket.on('connect', () => {
      console.log('connected')
    });

    socket.on('disconnect', () => {
      console.log('disconnected')
    });

    socket.on('devices', (payload) => {
      const devices = JSON
        .parse(payload)
        .sort((m1, m2) => m1.device_name < m2.device_name ? -1 : m1.device_name > m2.device_name ? 1 : 0)
      
      setDevices(devices)
    });

    socket.emit('get_devices')

    return () => {
      socket.off('connect');
      socket.off('disconnect');
      socket.off('devices');
    };

  }, [])

  function reloadDevices() {
    socket.emit('get_devices')
  }

  function getDevices() {
    return devices
      .map((elem, index) => 
        <div key={index} className='mb-2'>
          <Device name={elem['device_name']} gpsLat={elem['gps_lat']} gpsLng={elem['gps_lat']} activeSince={elem['active_since']} lastUpdate={elem['last_update']}/>
        </div>
      )
  }
 
  return (
    <div className='container p-5'>
      <div className='row justify-content-center mb-2'>
        <div className='col-lg-7 col-xs-12'>
          <div className='row justify-content-end mb-2'>
            <div className='col-auto'>
              <button className='btn btn-outline-dark' onClick={() => reloadDevices()}>
                <i className='bi bi-arrow-clockwise'></i> Ricarica
              </button>
            </div>
          </div>
          <div className='row justify-content-end'>
            <div className='col-12'>
              {getDevices()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Devices;
