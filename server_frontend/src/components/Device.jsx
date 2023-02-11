import './Device.scss';
import moment from 'moment';
import { useNavigate } from "react-router-dom";

export default function Device(props) {
  const navigate = useNavigate();

  function getIcon() {
    return <i className='bi bi-soundwave'></i>
    // switch (props.source) {
    //   case 'android':
    //     return <i className='bi bi-exclamation-lg'></i>
    //   case 'raspberry':
    //     return <i className='bi bi-exclamation-triangle'></i>
    //   default:
    //     return <i className='bi bi-question'></i>
    // }
  }

  function getStateText() {
    return "";
    // switch (props.state) {
    //   case 'stop':
    //     return 'Fermo'
    //   case 'malfunction':
    //     return 'Guasto'
    //   case 'urgent_maintenance':
    //     return 'Manutenzione urgente'
    //   case 'recommended_maintenance':
    //     return 'Manutenzione raccomandata'
    //   case 'regular':
    //     return 'Regolare'
    //   default:
    //     return 'Stato sconosciuto'

    // }
  }


  function printTime(value) {
    return (<span>
        dal {moment(value).format('DD-MM-YYYY HH:mm')}
      </span>)
  }
  function printCalendar(value) {
    return (<span>
        {moment(value).calendar().toLowerCase()}
      </span>)
  }
  
  function showDevice() {
    navigate('/device', { state: { deviceName: props.name} });
  }

  return (
    <div className='border p-3'>
      <div className='row align-items-center'>
        <div className='col-auto'>
          <p className='fs-1 m-0'>
            {getIcon()}
          </p>
        </div>
        <div className='col'>
          <p className='m-0'>
            <strong>{props.name}</strong>
          </p>
          <p className='m-0'>
            Attivo {printTime(props.activeSince)}
          </p>
          <p className='m-0'>
            Ultimo aggiornamento: {printCalendar(props.lastUpdate)}
          </p>
        </div>
        <div className='col-auto'>
          <p className='m-0 p-0'>
            <strong>{getStateText()}</strong>
          </p>
        </div>
        <div className='col-auto'>
          <button className='btn btn-primary ' onClick={() => showDevice()}>
            Mostra
            <i className="bi bi-chevron-right ps-2"></i>
          </button>
        </div>
      </div>
    </div>
  );
}