import React from 'react';

const Loader = () => (
  <div className="loader-container flex flex-col justify-center items-center bg-transparent w-screen h-screen ">
    <div className='animate-spin scale-200 h-12 w-12 border-b-4 border-x-4 border-t-0 border-gray-500 rounded-full'></div>
  </div>
);

export default Loader;
