import React from 'react'
import Card from './card'
import MintButton from './mint-button'

const collections = [
    {
        title: 'SUPER Geo Club',
        quantity: 'Hold 1 of each NFT',
        image: 'https://mygeotokens.com/wp-content/uploads/2023/12/GEO-Super-Hero_Teaser.png',
        features: [
            `An airdropped SUPER GEO NFT`,
            `5% Shared Collector's Club Rewards(bonus)`,
            `SUPER Geo Club Discord role and badge`,
            `(Image revealed when airdropped)`,
        ]
    },
    {
        title: 'Lunar Geo',
        quantity: '33 NFTs',
        image: 'https://mygeotokens.com/wp-content/uploads/2023/12/Genesis-NFTs__Luna-Geo.png',
        features: [
            `5% Shared Collector's Club Rewards`,
            `Yearly $1500 travel voucher giveaway`,
            `Lunar Holder Discord role and badge`,
            `Access to future drops and insider location hints`,
        ]
    },
    {
        title: 'Globe Geo',
        quantity: '150 NFTs',
        image: 'https://mygeotokens.com/wp-content/uploads/2023/12/Genesis-NFTs__Globe-Geo.png',
        features: [
            `4% Shared Collector's Club Rewards`,
            `Yearly $1250 travel voucher giveaway`,
            `Globe Holder Discord role and badge`,
            `Access to future drops and insider location hints`,
        ]
    },
    {
        title: 'Cliff Hanger Geo',
        quantity: '450 NFTs',
        image: 'https://mygeotokens.com/wp-content/uploads/2023/12/Genesis-NFTs__Cliff-Hanger-Geo.png',
        features: [
            `3% Shared Collector's Club Rewards`,
            `Yearly $1000 travel voucher giveaway`,
            `Cliff Holder Discord role and badge`,
            `Access to future drops and insider location hints`,
        ]
    },
    {
        title: 'POTUS Geo',
        quantity: '900 NFTs',
        image: 'https://mygeotokens.com/wp-content/uploads/2023/12/Genesis-NFTs__POTUS-Geo.png',
        features: [
            `2% Shared Collector's Club Rewards`,
            `Yearly $750 travel voucher giveaway`,
            `POTUS Holder Discord role and badge`,
            `Access to future drops and insider location hints`,
        ]
    },
    {
        title: 'Mapping Geo',
        quantity: '1800 NFTs',
        image: 'https://mygeotokens.com/wp-content/uploads/2023/12/Genesis-NFTs__Mapping-Geo.png',
        features: [
            `1% Shared Collector's Club Rewards`,
            `Yearly $500 travel voucher giveaway`,
            `Mapping Holder Discord role and badge`,
            `Access to future drops and insider location hints`,
        ]
    },
]

const Value = () => {

    return (
        <div className='w-full'
            style={{
                backgroundImage: `url('https://mygeotokens.com/wp-content/uploads/2023/11/MGT_-BKG_Gradients_WEB_Blue-Gradient.png')`,
                backgroundPosition: 'bottom',
                backgroundSize: 'cover',
                backgroundAttachment: 'fixed'

            }}
        >
            <div className="max-w-screen-xl w-full mx-auto py-24 md:space-y-20 px-4">
                <h3 className='text-center text-[#fff1e9] font-black text-2xl'>Explore the value of each variation in the 3,333 NFT Genesis collection:</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-16 md:gap-8 mt-8 lg:gap-y-16">
                    {collections.map((collection, index) => (
                        <div key={index}>
                            <Card title={collection.title} image={collection.image} quantity={collection.quantity} features={collection.features} />
                        </div>
                    ))}
                </div>
                <MintButton />
            </div>
        </div>
    )
}

export default Value