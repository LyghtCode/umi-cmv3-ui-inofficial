import React from 'react';

const ShareToTwitter = () => {
    const text = "On my way to minting the genesis collection NFT!";
    const imageUrl = "YOUR_PUBLIC_IMAGE_URL"; // Replace with the URL of your hosted image
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(imageUrl)}`;

    return (
        <div>
            <a className="twitter-share-button bg-orange-400 text-white rounded-md px-4 py-2"
                href="https://twitter.com/intent/tweet?text=Hello%20worlddddddddd"
                target='_blank'
                rel='noopener noreferrer'
            >
                Tweet</a>
        </div>
    );
}

export default ShareToTwitter;
