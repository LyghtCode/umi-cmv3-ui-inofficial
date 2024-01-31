import React, { useState } from 'react'
import ConnectButton from './connect-mint';
import { useWallet } from '@solana/wallet-adapter-react';
import StartMint from './start-mint'
import ShareToTwitter from './share-to-twitter';


const CircularProgress = ({ percentage, total, current }: { percentage: number, total: number, current: number }) => {
    const radius = 72; // Radius of the circle
    const strokeWidth = 12; // Width of the progress bar stroke
    const normalizedRadius = radius - strokeWidth / 2;
    const circumference = normalizedRadius * 2 * Math.PI;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;

    return (
        <div className="relative flex justify-center items-center w-full h-full">
            <svg
                height={radius * 2}
                width={radius * 2}
                className="text-gray-700"
            >

                {/* Background circle in gray */}
                <circle
                    stroke="#29915D"
                    fill="transparent"
                    strokeWidth={strokeWidth}
                    r={normalizedRadius}
                    cx={radius}
                    cy={radius}
                />
                <circle
                    stroke="white"
                    fill="transparent"
                    strokeWidth={strokeWidth}
                    strokeDasharray={circumference + ' ' + circumference}
                    style={{ strokeDashoffset }}
                    r={normalizedRadius}
                    cx={radius}
                    cy={radius}
                />
            </svg>
            <div className="absolute flex flex-col items-center justify-center">
                <span className="font-semibold text-black">{`Minted`}</span>
                <span className="text-3xl font-black text-black">{`${percentage}%`}</span>
                <span className="text-sm text-black">{`${current}/${total}`}</span>
            </div>
        </div>
    );
};

const MintNFT = () => {
    const { connected } = useWallet()
    const [selectedPayment, setSelectedPayment] = useState('sol');
    const [isOpen, setIsOpen] = useState(false);
    const [qty, setQty] = useState(1);

    const toggleDropdown = () => setIsOpen(!isOpen);

    const selectOption = (value: React.SetStateAction<string>) => {
        setSelectedPayment(value);
        setIsOpen(false);
    };

    return (
        <div id='mint' className='bg-[#35C47D] flex flex-col md:flex-row w-full justify-center md:space-x-16 md:items-end py-8 px-6 md:px-0 space-y-4 md:space-y-0 text-center md:text-left'>
            <div className=''>
                {/* <img src="https://mygeotokens.com/wp-content/uploads/2023/12/Mint-a-MyGeoTokens-NFT.png" alt="" className='w-40' /> */}
                <CircularProgress percentage={22} total={3333} current={734} />
            </div>
            <div className='flex flex-col justify-start items-start'>
                <h3 className='text-3xl md:text-[50px] text-black font-black'>
                    Mint your NFT!
                </h3>
                <p className="text-white text-[12px] md:text-[14px] w-full -mt-2">
                    Whitelist max 5 per wallet
                </p>
                <div className='flex justify-center'>
                    {
                        connected ?
                            <StartMint />
                            :
                            <ConnectButton />
                    }
                    {/* <ShareToTwitter /> */}
                </div>
                {
                    <div className='sm:hidden p-3'>
                        <p className='text-white text-sm font-semibold'>
                            Please use your phantom wallet browser to mint
                        </p>
                    </div>
                }
            </div>
        </div>
    )
}

export default MintNFT