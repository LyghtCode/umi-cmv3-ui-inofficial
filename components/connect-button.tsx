import dynamic from 'next/dynamic';
import React from 'react'

const WalletMultiButtonDynamic = dynamic(
    async () =>
        (await import("@solana/wallet-adapter-react-ui")).WalletMultiButton,
    { ssr: false }
);

const ConnectButton = () => {
    return (
        <WalletMultiButtonDynamic className='z-50 relative' style={{
            "color": "white",
            "fontSize": "12px",
            "position": "relative"
        }} />
    )
}

export default ConnectButton