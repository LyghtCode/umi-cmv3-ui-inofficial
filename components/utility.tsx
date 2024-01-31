'use client'
import React, { useState } from 'react'
import { FaArrowDownLong, FaArrowUpLong } from "react-icons/fa6";
import MintButton from './mint-button';


const drawers = [
    {
        title: "Early App Access",
        description1: `As a valued member of the community, you'll gain exclusive access to the app in beta- phase and offer feedback to shape the experience of the platform.We're eager to show you what we're building when ready and listen to what you have to say before launch and after.`,
        description2: 'Experience the app and features before anyone else.',
    },
    {
        title: 'Travel Giveaways',
        description1: 'Seize annual travel voucher giveaway opportunities that enhance the MyGeoTokens community experience. We\'re eager to amplify your travel plans on the trip you\'ve always wanted to take!',
        description2: 'Each tier has a chance to enter every year.',

    },
    {
        title: 'Geo\'s Alpha Group',
        description1: 'Join a league of adventurers for exclusive access to future NFT collection drops and insider location hints. You have exclusive access to special events and unique opportunities launched with MyGeoTokens app.',
        description2: 'Members find out where drop locations are before anyone else.',
    },
    {
        title: 'Revenue Share',
        description1: 'As an NFT holder and member of the Collectors Club, you benefit from the marketplace\'s success.Each variation offers different levels of revenue share; hold one of each for a SUPER Geo Club NFT boost, airdropped to your wallet!',
        description2: '20% of platform profits are distributed to the Collectors Club.',
    },
]


const Utility = () => {

    const [openDrawerIndex, setOpenDrawerIndex] = useState(null);

    const toggleDrawer = (index: React.SetStateAction<null>) => {
        if (index === openDrawerIndex) {
            setOpenDrawerIndex(null); // Close drawer if it's already open
        } else {
            setOpenDrawerIndex(index); // Open the clicked drawer
        }
    }

    const scrollToMint = (event: { preventDefault: () => void }) => {
        event.preventDefault(); // Prevent the default anchor behavior

        const mintSection = document.getElementById('mint');
        if (mintSection) {
            const offsetTop = mintSection.getBoundingClientRect().top + window.pageYOffset - 100; // Adjust -100 for the offset
            window.scrollTo({ top: offsetTop, behavior: 'smooth' });
        }
    }

    return (
        <div
            id="about"
            className='w-full min-h-[70dvh] flex items-center' style={{
                backgroundImage: `url('https://mygeotokens.com/wp-content/uploads/2023/11/MGT_-BKG_Green_WEB_Gradient-Right.png')`,
                backgroundPosition: 'bottom',
                backgroundSize: 'cover',
                backgroundAttachment: 'fixed',
            }}>
            <div className="max-w-screen-xl flex flex-col md:flex-row items-center mx-auto px-6 sm:px-6 lg:px-8 gap-8 md:gap-16 py-8">
                <div className='text-[#fff1e9] w-full space-y-8'>
                    <h3 className='text-3xl md:text-4xl font-black leading-tight'>
                        The unmatched utility of MyGeoTokens NFTs
                    </h3>
                    <p className='text-lg md:text-xl'>
                        {`Join the Collectors Club, where every MyGeoTokens Genesis Collection NFT unlocks exclusive access, vacation giveaways, and a reward share from our marketplace's success. Every NFT in the MyGeoTokens Genesis Collection has utility.`}
                    </p>
                    <MintButton />
                </div>
                <div className='w-full'>
                    {drawers.map((drawer, index) => (
                        <details key={index} className='group rounded-sm mt-8 border border-[#fff1e9] transition-all duration-300'>
                            <summary className='text-lg font-bold cursor-pointer flex justify-between items-center transition-all text-[#fff1e9] duration-300 p-3 hover:bg-[#35c47d] hover:text-black'>
                                {drawer.title}
                                {
                                    openDrawerIndex === index ? <FaArrowUpLong className='group text-[#fff1e9] group-hover:text-black transition-all duration-300' /> : <FaArrowDownLong className='group text-[#fff1e9] group-hover:text-black transition-all duration-300' />
                                }
                            </summary>
                            <div className='p-4 text-[#fff1e9] text-lg'>
                                <p className='text-opacity-75'>
                                    {drawer.description1}
                                </p>
                                <p className='text-opacity-75 mt-2 font-bold'>
                                    {drawer.description2}
                                </p>
                            </div>
                        </details>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default Utility