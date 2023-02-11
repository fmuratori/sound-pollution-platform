import React from 'react';
import {Outlet, Link} from 'react-router-dom';
import {useEffect} from 'react';
import './App.scss';

const App = function() {

  useEffect(() => {}, [])

  return (
    <div>
      <div>
        {/* dashboard */}

        <nav className='navbar navbar-expand-lg navbar-light bg-light m-0 p-0'>
          <div className='container-fluid'>
            <div  className='navbar-brand p-2'>
              <span className='my-logo-text d-flex align-items-center'>
                
                <Link to={``} className='nav-link active'>
                Sound pollution monitor
                </Link>
              </span>
            </div>
            <button className='navbar-toggler' type='button' data-bs-toggle='collapse' data-bs-target='#navbarSupportedContent' aria-controls='navbarSupportedContent' aria-expanded='false' aria-label='Toggle navigation'>
              <span className='navbar-toggler-icon'></span>
            </button>
            
          </div>
        </nav>
      </div>

      <div>
        {/* route to views */}

        <Outlet />
      </div>
      
    </div>
  );
}


export default App;