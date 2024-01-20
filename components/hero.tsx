'use client'
import React, { useEffect, useState } from 'react'
import blue from '../assets/bg/bluegraident.png'
import green from '../assets/bg/greengradient.png'
import red from '../assets/bg/redgradient.png'
import yellow from '../assets/bg/yellowgradient.png'
import MintButton from './mint-button'

const Hero = () => {

    const images = [
        "https://nftstorage.link/ipfs/bafkreiajiqloa2si46w75auuwpyv2z43ljq5rxeomk6rh3tqbv3o6yiypm",
        "https://nftstorage.link/ipfs/bafkreibh3xhdkrseagspd46qcf7nfgwbvbtkavolwu2ffnsr63muduigju",
        "https://nftstorage.link/ipfs/bafkreibqdosphc2w6j657tfm54emn67cgqip47qbc4tbfuxn2e2iwyvvqe",
        "https://nftstorage.link/ipfs/bafkreid6dzylwjarle7yruv62sf4wge4z3oyqzuojtisonspww6bkemzjy",
    ];
    const [currentImage, setCurrentImage] = useState(images[0]);
    const [imageIndex, setImageIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setImageIndex(prevIndex => (prevIndex + 1) % images.length);
        }, 2000);

        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        setCurrentImage(images[imageIndex]);
    }, [imageIndex, images]);

    const scrollToMint = (event: { preventDefault: () => void }) => {
        event.preventDefault(); // Prevent the default anchor behavior

        const mintSection = document.getElementById('mint');
        if (mintSection) {
            const offsetTop = mintSection.getBoundingClientRect().top + window.pageYOffset - 100; // Adjust -100 for the offset
            window.scrollTo({ top: offsetTop, behavior: 'smooth' });
        }
    }

    return (
        <div className='w-full flex items-center bg-[#231f20] min-h-[90dvh] p-6 md:p-0'
            style={{

                transition: 'background 1s ease-in-out',
                backgroundPosition: 'center',
                backgroundSize: 'cover',
            }}
        >
            <div className="flex flex-col md:flex-row w-full max-w-screen-xl mx-auto items-center gap-8">
                <div className='w-full flex items-center justify-center'>
                    <img src='https://mygeotokens.com/wp-content/uploads/2023/12/Get-our-limited-edition-NFTs-at-MyGeoTokens.com_.png' alt='logo' className='w-5/6' />
                </div>
                <div className='text-[#fff1e9] space-y-8'>
                    <h1 className='text-[36px] md:text-5xl leading-tight font-bold'>
                        More than just a JPEG
                    </h1>
                    <p className='text-lg md:text-xl'>
                        Explore, earn, and experience exclusivity as a MyGeoTokens Genesis Collection holder and Collector’s Club member.
                    </p>
                    <MintButton />
                </div>
            </div>
        </div>
    )
}

export default Hero