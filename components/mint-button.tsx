'use client'
import React from 'react'

const MintButton = () => {

    const scrollToMint = (event: { preventDefault: () => void }) => {
        event.preventDefault(); // Prevent the default anchor behavior

        const mintSection = document.getElementById('mint');
        if (mintSection) {
            const offsetTop = mintSection.getBoundingClientRect().top + window.pageYOffset - 100; // Adjust -100 for the offset
            window.scrollTo({ top: offsetTop, behavior: 'smooth' });
        }
    }

    return (
        <button onClick={scrollToMint} className='flex items-center justify-center w-full h-12 bg-[#e05e5c] rounded-full mt-8 md:mt-0'>
            <span className='text-[#fff1e9] font-bold'>Mint now</span>
        </button>
    )
}

export default MintButton