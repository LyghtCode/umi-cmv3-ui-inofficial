import React from 'react'

const Reveal = () => {
    return (
        <div className='flex text-[#fff1e9] min-h-[65dvh] items-center justify-center p-6 md:p-0' style={{
            backgroundImage: `url('https://mygeotokens.com/wp-content/uploads/2023/11/MGT_-BKG_Gradients_WEB_Red-Gradient.png')`, backgroundPosition: 'bottom', backgroundSize: 'cover',
            backgroundAttachment: 'fixed'
        }}>
            <div className='flex flex-col md:flex-row gap-16 md:gap-20 max-w-screen-xl'>
                <div className='w-full md:w-1/2 space-y-4 md:space-y-10'>
                    <h3 className='text-2xl md:text-4xl font-black'>
                        Fair minting & reveal
                    </h3>
                    <p className='text-xl'>
                        {`Each NFT is revealed immediately after you mint, so you know which variations you own and have a better chance at a SUPER Geo airdrop by collecting at least one of each variation. The distribution is carefully randomized within the smart contract to ensure a fair and equitable allocation for every participant in the MyGeoTokens mint.`}
                    </p>
                </div>
                <div className='w-full md:w-1/2 space-y-4 md:space-y-10'>
                    <h3 className='text-2xl md:text-4xl font-black'>
                        NFT utility & benefits
                    </h3>
                    <p className='text-xl'>
                        {`Each variation offers a different distribution of value, but all provide key benefits including revenue share, travel giveaways, and exclusive access to Geo's Alpha Group. Hold one of each variation and get a SUPER Geo NFT airdropped for even more benefits!`}
                    </p>
                </div>
            </div>
        </div>
    )
}

export default Reveal