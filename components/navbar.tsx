'use client'
import React, { useState } from 'react'
import { FaDiscord, FaLinkedinIn, FaXTwitter, FaBars, FaInstagram } from 'react-icons/fa6'
import { AnimatePresence, motion } from 'framer-motion'
import Link from 'next/link'
import ConnectButton from './connect-button'

const Navbar = () => {

    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

    const mobileMenuAnimation = {
        hidden: { opacity: 0, y: -20 },
        visible: { opacity: 1, y: 0 }
    };

    return (
        <div className='sticky top-0 flex items-center justify-between bg-[#231f20] w-full md:py-6 py-4 px-4 md:px-16 overflow-x-hidden z-50'>
            {/* logo */}
            <div className='flex items-center space-x-4 w-full md:w-1/4 justify-between'>
                <Link href='/'>
                    <img src='https://mygeotokens.com/wp-content/uploads/2023/05/My-Geo-Tokens-The-Worlds-First-Geospatial-NFT-Marketplace.gif' alt='logo' className='w-36 md:w-56' />
                </Link>
                <div className='md:hidden'>
                    <FaBars size={28} className='text-[#fff1e9]' color='' onClick={toggleMobileMenu} />
                </div>
            </div>
            {/* nav */}
            <div className='hidden md:flex items-center justify-items-end space-x-8'>
                <ul className='flex items-center space-x-8 text-xl'>
                    <Link href='https://mygeotokens.com/#about' target='_blank' className='text-[#fff1e9] hover:text-[#00d084]'>About</Link>
                    <Link href='https://mygeotokens.gitbook.io/' target='_blank' className='text-[#fff1e9] hover:text-[#00d084]'>GitBook</Link>
                    <Link href='https://mygeotokens.com/#invest' target='_blank' className='text-[#fff1e9] hover:text-[#00d084]'>Invest</Link>
                    <Link href='https://mygeotokens.com/#connect' target='_blank' className='text-[#fff1e9] hover:text-[#00d084]'>Connect</Link>
                    <li className='text-[#fff1e9] hover:text-[#00d084]'>News & Articles</li>
                </ul>
                {/* social icons */}
                <div className="flex space-x-6 items-center justify-center ">
                    <div className='max-w-xs '>
                        <ConnectButton />
                    </div>
                    <a href="https://discord.gg/mygeotokens" target="_blank" rel="noopener noreferrer" className='text-[#fff1e9]'>
                        <FaDiscord size={25} />
                    </a>
                    <a href="https://twitter.com/mygeotokens" target="_blank" rel="noopener noreferrer" className='text-[#fff1e9]'>
                        <FaXTwitter size={25} />
                    </a>
                    {/* <a href="https://www.instagram.com/mygeotokens/" target="_blank" rel="noopener noreferrer" className='text-[#fff1e9]'>
                        <FaInstagram size={25} />
                    </a> */}
                    <a href="https://www.linkedin.com/company/mygeotokens/" target="_blank" rel="noopener noreferrer" className='text-[#fff1e9]'>
                        <FaLinkedinIn size={25} />
                    </a>
                </div>
            </div>
            {/* Mobile menu */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        className="fixed top-16 left-0 w-full bg-[#231f20] z-50 py-4"
                        initial="hidden"
                        animate="visible"
                        exit="hidden"
                        variants={mobileMenuAnimation}
                    >
                        <ul className='flex flex-col items-center space-y-8 text-xl'>
                            <Link href='https://mygeotokens.com/#about' target='_blank' className='text-[#fff1e9] hover:text-[#00d084]'>About</Link>
                            <Link href='https://mygeotokens.gitbook.io/' target='_blank' className='text-[#fff1e9] hover:text-[#00d084]'>GitBook</Link>
                            <Link href='https://mygeotokens.com/#invest' target='_blank' className='text-[#fff1e9] hover:text-[#00d084]'>Invest</Link>
                            <Link href='https://mygeotokens.com/#connect' target='_blank' className='text-[#fff1e9] hover:text-[#00d084]'>Connect</Link>
                            <li className='text-[#fff1e9]'>News & Articles</li>
                            <li>
                                {/* <ConnectWallet theme='dark' /> */}
                            </li>
                        </ul>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}

export default Navbar