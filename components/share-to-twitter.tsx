import React from 'react';

const ShareToTwitter = () => {
    const text = "Check out my #MyGeoTokens mints! 🌟 \n\nCheck out the mint site and discover more @MyGeoTokens! 👇\n\n";
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=https://mint.mygeotokens.com`;




    return (
        <div>
            <a className="twitter-share-button bg-black py-3 font-black text-[#35C47D] rounded-full hover:bg-white hover:text-black transition-all duration-300 w-full"
                href={twitterUrl}
                target='_blank'
                rel='noopener noreferrer'
            >
                Share my NFTs on (X) Twitter
                {/* Share during WL mint for a $SOL rebate! */}
            </a>
        </div>
    );
}

export default ShareToTwitter;


