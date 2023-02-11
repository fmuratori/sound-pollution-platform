const BigNumber = function(props) {
  return (
      <div className='text-center'>
          <h1 className='display-4'>
              {props.value}
          </h1>
          <p className='fs-5'>
              {props.label}  
          </p>
      </div>
  );
}

export default BigNumber;