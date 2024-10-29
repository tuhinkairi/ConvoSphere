import { LoaderPinwheel } from 'lucide-react';
import React from 'react';

const Loader = () => (
  <div className="loader-container flex flex-col justify-center items-center bg-transparent w-screen h-screen ">
    <LoaderPinwheel className='animate-spin scale-200'/>
  </div>
);

export default Loader;
