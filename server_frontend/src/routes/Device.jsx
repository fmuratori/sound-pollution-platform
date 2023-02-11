import './Device.scss';
import {SoundChart} from '../components/SoundChart';
import { useState, useEffect, useContext } from 'react';
import { useLocation } from 'react-router-dom';
import {SocketContext} from '../socket.js';
import moment from 'moment';

function Device() {
  const socket = useContext(SocketContext);
  const location = useLocation();
  const [device, setDevice] = useState(null);

  // const [period, setPeriod] = useState('day'); // day, week, month, quarter

  useEffect(() => {
    console.log(location.state.deviceName)

    socket.on('connect', () => {
      console.log('connected')
    });

    socket.on('disconnect', () => {
      console.log('disconnected')
    });

    socket.emit('start_watch', location.state.deviceName)

    socket.on('device_data', (payload) => {
      const device = JSON
        .parse(payload)
        // .sort((m1, m2) => m1.device_name < m2.device_name ? -1 : m1.device_name > m2.device_name ? 1 : 0)
      // console.log(device)
      
      setDevice(device)
    });


    return () => {
      socket.emit('stop_watch');
      socket.off('connect');
      socket.off('disconnect');
      socket.off('device_data');
    };

  })

  function printTime(value) {
    return (<span>
        {moment(value).format('DD-MM-YYYY HH:mm')}
      </span>)
  }
  
  function printCalendar(value) {
    return (<span>
        {moment(value).calendar().toLowerCase()}
      </span>)
  }

  return (
    <div className='container p-5'>
      {
        device != null ?
          <div>
            {/* align-items-end */}
            <div className='row gx-3 gy-3'>  
              <div className='col-6'>
                <div className='border p-3'>
                  <p className='mb-0 pb-0 h6'>
                    DISPOSITIVO
                  </p>
                  <label className='fs-3'>
                    {device.device_name}
                  </label>
                </div>
              </div>
              <div className='col-6'>
                <div className='border p-3'>
                  <p className='mb-0 pb-0 h6'>
                    COORDINATE
                  </p>
                  <label className='fs-3'>
                    {device.gps_lat}, {device.gps_lng} 
                  </label>
                </div>
              </div>
              <div className='col-6'>
                <div className='border p-3'>
                  <p className='mb-0 pb-0 h6'>
                    ATTIVO DAL
                  </p>
                  <label className='fs-3'>
                    {printTime(device.active_since)}
                  </label>
                </div>
              </div>
              <div className='col-6'>
                <div className='border p-3'>
                  <p className='mb-0 pb-0 h6'>
                    ULTIMO AGGIORNAMENTO
                  </p>
                  <label className='fs-3'>
                    {printCalendar(device.last_update)}
                  </label>
                </div>
              </div>
            </div>
            <div className='row mt-3'>
              <div className='col-12'>
                <div className='border ps-2 pe-4 pb-3 pt-5'>
                  {/* <PeriodPicker handleUpdate={(newPeriod) => updateSelectedPeriod(newPeriod)} /> */}
                  <SoundChart data={device.data}/>
                </div>
              </div>
            </div>
        </div>
      :
        <div className='d-flex justify-content-center py-5 my-5'>
          <div className='spinner-border text-primary' role='status'>
            <span className='visually-hidden'>Loading...</span>
          </div>
        </div>
      }
    </div>
  );
}

export default Device;
