import { Link } from 'react-router-dom';
import './App.css';

function App() {
  return (
    <main className='h-screen sm:h-full flex flex-col md:flex-row items-center justify-center p-6 md:p-24 gap-6'>
      <section className='flex-1 flex flex-col gap-3'>
        <h1 className='text-gray-200 text-4xl font-medium'>Welcome</h1>
        <p className='text-gray-200'>
          This personal project is intended to bring together a demonstration of
          my development skills and love of art. I decided to use the Art
          Institute of Chicago's public API because of its ease of use, but also
          its breadth of material.
        </p>
        <p className='text-gray-200'>
          The content of this project is from the Institute's Essentials
          Collection. It's a great limited sample of the variety of work that is
          out there.
        </p>
        <p className='text-gray-200'>
          This project showcases my knowledge of Typescript, React, Jest,
          Tailwind, and API use. I hope you enjoy it
        </p>
        <p className='text-gray-200'>-Steven</p>
      </section>
      <section className='flex-1 flex flex-col items-center justify-center h-full w-full gap-6'>
        <img
          className='w-xs h-auto'
          src='https://upload.wikimedia.org/wikipedia/commons/thumb/3/32/Art_Institute_of_Chicago_logo.svg/1024px-Art_Institute_of_Chicago_logo.svg.png'
        />
        <p className='text-gray-100'>
          Art Institute of Chicago Essential Artists
        </p>
        <Link
          to='/artists'
          className='p-4 border-2 rounded-xl hover:border-gray-100 hover:bg-white hover:text-gray-800 hover:animate-none duration-200 ease-in-out border-gray-400 text-gray-100 motion-safe:animate-pulse'
        >
          Explore the collection
        </Link>
      </section>
    </main>
  );
}

export default App;
