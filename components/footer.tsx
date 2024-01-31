import Link from 'next/link';
import React from 'react'
import { FaXTwitter, FaDiscord, FaLinkedinIn, FaInstagram } from "react-icons/fa6";
import logo from "../assets/logos/logo.gif"
import Image from 'next/image';

const Footer = () => {
    return (
        <div className='w-full bg-[#231f20]'>
            <div className="max-w-screen-xl w-full mx-auto pt-20 pb-12 px-6 lg:px-0">
                <div className='flex flex-col md:flex-row items-center justify-between'>
                    <div className='space-y-8 md:space-y-2'>
                        <Image width={100} height={100} src={logo} alt="" className='w-64' />
                        {/* social icons */}
                        <div className="flex space-x-6 items-center justify-center">
                            <a href="https://discord.gg/VhrcfZ78Uj" target="_blank" rel="noopener noreferrer" className='text-[#fff1e9]'>
                                <FaDiscord size={28} />
                            </a>
                            <a href="https://twitter.com/mygeotokens" target="_blank" rel="noopener noreferrer" className='text-[#fff1e9]'>
                                <FaXTwitter size={28} />
                            </a>
                            {/* <a href="https://www.instagram.com/mygeotokens/" target="_blank" rel="noopener noreferrer" className='text-[#fff1e9]'>
                                <FaInstagram size={28} />
                            </a> */}
                            <a href="https://www.linkedin.com/company/mygeotokens/" target="_blank" rel="noopener noreferrer" className='text-[#fff1e9]'>
                                <FaLinkedinIn size={28} />
                            </a>
                        </div>
                    </div>
                    <div className='mt-12 md:mt-0'>
                        <img src="https://mygeotokens.com/wp-content/uploads/2023/05/built_on_solana-2048x172.png" alt="" className='w-56' />
                    </div>
                </div>
                <div className='w-full flex flex-col justify-end items-center md:items-end md:justify-end mt-4 md:mt-0'>
                    <p className='text-sm text-[#fff1e9]/20'>© 2024 mygeotokens.com - All Rights Reserved.</p>
                    <p className='text-sm text-[#fff1e9]/20'>Made with ❤️ by {" "}
                        <Link href='https://spidev.xyz' target='_blank'>
                            <span className='hover:text-[#fff1e9] hover:cursor-pointer transition-all duration-300'>
                                Spidev
                            </span>
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    )
}

export default Footer