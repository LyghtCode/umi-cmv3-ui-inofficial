import React from 'react';

const ShareToTwitter = () => {
    const text = "Check out my #MyGeoTokens mints! 🌟 Check out site and discover more @MyGeoTokens!";
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=https://my-geo-tokens.vercel.app&hashtags=OpenToAdventure`;


    return (
        <div>
            <a className="twitter-share-button bg-black py-3 w-full font-black text-[#35C47D] rounded-full hover:bg-white hover:text-black transition-all duration-300"
                href="https://twitter.com/intent/tweet?text=Hello%20worlddddddddd"
                target='_blank'
                rel='noopener noreferrer'
            >
                Tweet</a>
        </div>
    );
}

export default ShareToTwitter;

