import React from 'react'

const Tutorials = () => {
    return (
        <div className='w-full bg-[#231f20]'
            style={{
                backgroundImage: `url('https://mygeotokens.com/wp-content/uploads/2023/11/MGT_-BKG_Gradients_WEB_Yellow-Gradient.png')`,
                backgroundPosition: 'bottom',
                backgroundSize: 'cover',
                backgroundAttachment: 'fixed'
            }}
        >
            <div className="max-w-screen-xl w-full mx-auto pt-20 pb-12 px-6 lg:px-0">
                <div className='text-[#fff1e9] space-y-8 md:w-1/2'>
                    <h3 className='text-3xl md:text-4xl font-black leading-tight'>
                        Ready yourself for<br /> Mint Day
                    </h3>
                    <p className='text-xl'>
                        {`Learn how to set up a Solana-compatible wallet, buy and send $SOL, and mint with our DApp.`}
                    </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
                    <div className="space-y-8">
                        <h4 className='font-black text-[#fff1e9] text-2xl'>How to set up your wallet</h4>
                        {/* video */}
                        <iframe
                            className='w-full h-48 md:h-52'
                            src="https://www.youtube.com/embed/cw_GayPPaKA"
                            title="YouTube video player"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen>
                        </iframe>
                    </div>
                    <div className="space-y-8">
                        <h4 className='font-black text-[#fff1e9] text-2xl'>How to buy Solana</h4>
                        {/* video */}
                        <iframe
                            className='w-full h-48 md:h-52'
                            src="https://www.youtube.com/embed/zrFWMlo6AFs"
                            title="YouTube video player"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen>
                        </iframe>

                    </div>
                    <div className="space-y-8">
                        <h4 className='font-black text-[#fff1e9] text-2xl'>How to mint our NFTs</h4>
                        {/* video */}
                        <p className='font-black text-2xl text-[#eea136]'>COMING SOON</p>

                    </div>
                </div>
            </div>
        </div>
    )
}

export default Tutorials