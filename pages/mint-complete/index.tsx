import Footer from '@/components/footer'
import Navbar from '@/components/navbar'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

const MintComplete = () => {

    // scroll to section
    const scrollTo = (id: string) => {
        const el = document.getElementById(id);
        if (el) {
            el.scrollIntoView({ behavior: "smooth" });
        }
    };

    return (
        <>
            <Navbar />
            <div className='bg-[#35C47D] min-h-screen flex flex-col items-center justify-center text-center space-y-8 p-8 md:p-16'>
                <div>
                    <h3 className='font-black text-[#231f20] text-3xl leading-none md:text-[55px] max-w-3xl'>Welcome to the
                    </h3>
                    <h3 className='font-black text-[#231f20] leading-8 md:leading-normal text-3xl md:text-[55px]'>
                        MyGeoTokens Collector’s Club
                    </h3>
                </div>
                <p className='text-xl'>Your NFTs, Revealed!</p>
                <img src='https://mygeotokens.com/wp-content/uploads/2023/12/Genesis-NFTs__Luna-Geo.png' width={600} height={1000} alt='nfts' className='w-80' />
                <p className='text-xl'>What would you like to do now?</p>
                <div className='space-y-8 w-full md:max-w-md'>
                    <div className=''>
                        <Link href='https://twitter.com/mygeotokens/' target='_blank'>
                            <button className='bg-black py-3 w-full font-black text-[#35C47D] rounded-full hover:bg-white hover:text-black transition-all duration-300'>Share my NFTs on (X) Twitter</button>
                        </Link>
                        <p className='mt-2'>Get a $SOL rebate when you share.{" "}
                            <span onClick={() => scrollTo("rebate")} className="underline cursor-pointer">
                                Learn More
                            </span>
                        </p>
                    </div>
                    <div className=''>
                        <Link href='/' target='_blank'>
                            <button className='bg-transparent border border-black hover:bg-black hover:text-[#35C47D] py-3 w-full font-black text-black rounded-full'>Mint more!</button>
                        </Link>
                    </div>
                    <div className=''>
                        <Link href='https://discord.gg/VhrcfZ78Uj' target='_blank'>
                            <button className='bg-transparent border border-black hover:bg-black hover:text-[#35C47D] py-3 w-full font-black text-black rounded-full'>Enter out discord</button>
                        </Link>
                    </div>
                    <div className=''>
                        <Link href='https://mygeotokens.gitbook.io/mygeotokens' target='_blank'>
                            <button className='bg-transparent border border-black hover:bg-black hover:text-[#35C47D] py-3 w-full font-black text-black rounded-full'>Read out GitBook</button>
                        </Link>
                    </div>
                </div>
            </div>
            <div id="rebate" className="w-full p-4 py-8 md:p-8 bg-[#231F20] flex flex-col items-center justify-center md:space-y-8 text-center">
                <p className="text-white text-xl font-bold mb-4">Share your mints on X (Twitter) to receive a $SOL rebate:</p>
                <div className="overflow-hidden md:w-[50%]">
                    <table className="min-w-full">
                        <thead className="border">
                            <tr className='border'>
                                <th className="text-sm border font-semibold text-white py-2 px-4 text-left">NFTs MINTED</th>
                                <th className="text-sm border font-semibold text-white py-2 px-4 text-left">REBATE PER NFT</th>
                            </tr>
                        </thead>
                        <tbody className="border text-white">
                            <tr className='border'>
                                <td className="py-2 px-4 border">Whitelisted 1 - 4</td>
                                <td className="py-2 px-4 border">0.1</td>
                            </tr>
                            <tr>
                                <td className="py-2 px-4 border">Whitelisted 5 (Max)</td>
                                <td className="py-2 px-4 border">0.2</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div className="mt-4">
                    <a href="#" className="text-white text-xl">Jump into our #mint-rebate Discord channel for more info!</a>
                </div>
            </div>
            <Footer />
        </>
    )
}

export default MintComplete