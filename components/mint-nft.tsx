'use client'
import React, { useState } from 'react'
import dynamic from "next/dynamic";


const WalletMultiButtonDynamic = dynamic(
    async () =>
        (await import("@solana/wallet-adapter-react-ui")).WalletMultiButton,
    { ssr: false }
);

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
            <div className=''>
                <h3 className='text-3xl md:text-[50px] text-black font-black'>
                    Mint your NFT!
                </h3>
                <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:gap-16 mt-2">
                    <div>
                        <p className='text-xl md:text-2xl font-bold text-black'>
                            Qty*
                        </p>
                        {/* input */}

                        <input type="number" name='qty' className='w-20 h-10 bg-transparent border p-2 rounded-lg' onChange={(e) => setQty(parseInt(e.target.value))} />
                    </div>
                    <div>
                        <p className='text-xl md:text-2xl font-bold text-black'>
                            Total*
                        </p>
                        {/* dropdown */}
                        {/* <select name="payment" id="payment" className='w-40 h-10 bg-[#F5F5F5] rounded-lg'>
                            <option value="sol">
                                <DropdownOption value="sol" text="SOL" icon="https://s2.coinmarketcap.com/static/img/coins/64x64/5426.png" />
                            </option>
                            <option value="usdc">
                                <DropdownOption value="usdc" text="USDC" icon="https://s2.coinmarketcap.com/static/img/coins/64x64/3408.png" />
                            </option>
                        </select> */}
                        <div className='flex justify-center'>
                            <div className='w-40 h-10 bg-[#F5F5F5] rounded-lg cursor-pointer flex justify-between items-center px-2' onClick={toggleDropdown}>
                                <span>{selectedPayment === 'sol' ? `${qty * 1} SOL` : 'USDC'}</span>
                                <img src={selectedPayment === 'sol' ? "https://s2.coinmarketcap.com/static/img/coins/64x64/5426.png" : "https://s2.coinmarketcap.com/static/img/coins/64x64/3408.png"} alt='Payment Icon' className='w-6 h-6' />
                            </div>
                            {isOpen && (
                                <div className='absolute mt-1 w-40 bg-white border rounded-lg z-0'>
                                    <div className='hover:bg-gray-100 px-2 py-1 flex items-center cursor-pointer z-0' onClick={() => selectOption('sol')}>
                                        <img src={'https://s2.coinmarketcap.com/static/img/coins/64x64/5426.png'} alt='Solana' className='w-6 h-6 mr-2' />
                                        SOL
                                    </div>
                                    {/* <div className='hover:bg-gray-100 px-2 py-1 flex items-center cursor-pointer' onClick={() => selectOption('usdc')}>
                                        <img src={'https://s2.coinmarketcap.com/static/img/coins/64x64/3408.png'} alt='USD Coin' className='w-6 h-6 mr-2' />
                                        USDC
                                    </div> */}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            {/* red button */}
            {/* <div className='flex items-center justify-center w-64 h-12 bg-black rounded-full mt-8'>
                <p className='text-[#fff1e9] font-bold'>Connect wallet</p>
            </div> */}
            <WalletMultiButtonDynamic />
        </div>
    )
}

export default MintNFT